<?php

namespace App\Services;

use App\Models\User;
use App\Models\Artisan;
use App\Models\DemandeIntervention;
use App\Models\Abonnement;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

// Service qui calcule toutes les statistiques affichées dans le tableau de bord administrateur
class AdminStatsService
{
    // Retourne un tableau complet avec KPIs, alertes, graphiques et flux d'activité récente
    public function getOverviewData()
    {
        $now        = now();
        $startMonth = $now->copy()->startOfMonth();
        $startPrev  = $now->copy()->subMonth()->startOfMonth();
        $endPrev    = $now->copy()->subMonth()->endOfMonth();

        // Comptage des utilisateurs et calcul de la tendance par rapport au mois précédent
        $totalUsers     = User::count();
        $usersThisMonth = User::whereBetween('created_at', [$startMonth, $now])->count();
        $usersPrevMonth = User::whereBetween('created_at', [$startPrev, $endPrev])->count();
        $usersTrend     = $usersPrevMonth > 0
            ? round((($usersThisMonth - $usersPrevMonth) / $usersPrevMonth) * 100, 1)
            : 0;

        // Artisans validés avec leur évolution mensuelle
        $activeArtisans    = Artisan::where('statutValidation', 'valide')->count();
        $artisansThisMonth = Artisan::where('statutValidation', 'valide')
            ->whereBetween('updated_at', [$startMonth, $now])->count();
        $artisansPrevMonth = Artisan::where('statutValidation', 'valide')
            ->whereBetween('updated_at', [$startPrev, $endPrev])->count();
        $artisansTrend = $artisansPrevMonth > 0
            ? round((($artisansThisMonth - $artisansPrevMonth) / $artisansPrevMonth) * 100, 1)
            : 0;

        // Demandes d'intervention du mois en cours et précédent
        $requestsThisMonth = DemandeIntervention::whereBetween('created_at', [$startMonth, $now])->count();
        $requestsPrevMonth = DemandeIntervention::whereBetween('created_at', [$startPrev, $endPrev])->count();
        $requestsTrend     = $requestsPrevMonth > 0
            ? round((($requestsThisMonth - $requestsPrevMonth) / $requestsPrevMonth) * 100, 1)
            : 0;

        // Revenus générés via les paiements validés (statut = succes)
        $revenueThisMonth = DB::table('paiements')
            ->join('abonnements', 'paiements.abonnement_id', '=', 'abonnements.id')
            ->where('paiements.statut', 'succes')
            ->whereBetween('paiements.created_at', [$startMonth, $now])
            ->sum('paiements.montant');
        $revenuePrevMonth = DB::table('paiements')
            ->join('abonnements', 'paiements.abonnement_id', '=', 'abonnements.id')
            ->where('paiements.statut', 'succes')
            ->whereBetween('paiements.created_at', [$startPrev, $endPrev])
            ->sum('paiements.montant');
        $revenueTrend = $revenuePrevMonth > 0
            ? round((($revenueThisMonth - $revenuePrevMonth) / $revenuePrevMonth) * 100, 1)
            : 0;

        // Alertes : artisans en attente, plaintes non lues, abonnements qui expirent bientôt
        $pendingArtisans = Artisan::where('statutValidation', 'en_attente')->count();
        $expiringIn7Days = Abonnement::where('statut', 'actif')
            ->whereBetween('date_fin', [$now, $now->copy()->addDays(7)])
            ->count();

        try {
            $unreadComplaints = DB::table('reclamations')->where('statut', 'nouveau')->count();
        } catch (\Exception $e) {
            // Si la table n'existe pas encore, on retourne 0 sans bloquer
            $unreadComplaints = 0;
        }

        // Données pour le graphique d'inscriptions hebdomadaires (8 dernières semaines)
        $weeklyReg = [];
        for ($i = 7; $i >= 0; $i--) {
            $weekStart   = $now->copy()->subWeeks($i)->startOfWeek();
            $weekEnd     = $weekStart->copy()->endOfWeek();
            $label       = 'S' . $weekStart->weekOfYear;

            $weeklyReg[] = [
                'week'     => $label,
                'clients'  => User::where('type', 'client')->whereBetween('created_at', [$weekStart, $weekEnd])->count(),
                'artisans' => User::where('type', 'artisan')->whereBetween('created_at', [$weekStart, $weekEnd])->count(),
            ];
        }

        // Top 10 des wilayas avec le plus de demandes d'intervention
        $topWilayas = DemandeIntervention::select('wilaya_id', DB::raw('count(*) as total'))
            ->with('wilaya:id,nom')
            ->groupBy('wilaya_id')
            ->orderByDesc('total')
            ->limit(10)
            ->get()
            ->map(fn($r) => [
                'wilaya' => $r->wilaya?->nom ?? 'N/A',
                'count'  => $r->total,
            ]);

        // Flux d'activité récente : artisans, interventions et abonnements combinés
        $recentArtisans = Artisan::with('user:id,nomComplet')
            ->latest()->limit(5)->get()
            ->map(fn($a) => [
                'type'    => 'artisan_submitted',
                'message' => 'Nouveau profil artisan soumis : ' . $a->user?->nomComplet,
                'at'      => $a->created_at,
                'link'    => '/dashboard/admin/artisans',
            ]);

        $recentInterventions = DemandeIntervention::with('client.user:id,nomComplet')
            ->latest()->limit(5)->get()
            ->map(fn($i) => [
                'type'    => 'intervention_created',
                'message' => 'Nouvelle demande publiée : "' . $i->titre . '"',
                'at'      => $i->created_at,
                'link'    => '/dashboard/admin/interventions',
            ]);

        $recentSubscriptions = Abonnement::with('artisan.user:id,nomComplet')
            ->latest()->limit(5)->get()
            ->map(fn($s) => [
                'type'    => 'subscription_renewed',
                'message' => 'Abonnement activé pour : ' . $s->artisan?->user?->nomComplet,
                'at'      => $s->created_at,
                'link'    => '/dashboard/admin/subscriptions',
            ]);

        // On fusionne et trie les événements récents pour n'afficher que les 10 plus récents
        $activityFeed = $recentArtisans
            ->concat($recentInterventions)
            ->concat($recentSubscriptions)
            ->sortByDesc('at')
            ->take(10)
            ->values();

        return [
            'kpis' => [
                [
                    'label' => 'Utilisateurs Inscrits',
                    'key'   => 'total_users',
                    'value' => $totalUsers,
                    'trend' => $usersTrend,
                    'icon'  => 'Users',
                    'color' => 'blue',
                ],
                [
                    'label' => 'Artisans Actifs',
                    'key'   => 'active_artisans',
                    'value' => $activeArtisans,
                    'trend' => $artisansTrend,
                    'icon'  => 'Briefcase',
                    'color' => 'emerald',
                ],
                [
                    'label' => 'Demandes ce mois',
                    'key'   => 'requests_month',
                    'value' => $requestsThisMonth,
                    'trend' => $requestsTrend,
                    'icon'  => 'ClipboardList',
                    'color' => 'violet',
                ],
                [
                    'label' => 'Revenus ce mois (DA)',
                    'key'   => 'revenue_month',
                    'value' => number_format($revenueThisMonth, 0, '.', ' ') . ' DA',
                    'trend' => $revenueTrend,
                    'icon'  => 'TrendingUp',
                    'color' => 'amber',
                ],
            ],
            'alerts' => [
                'pending_artisans'  => $pendingArtisans,
                'unread_complaints' => $unreadComplaints,
                'expiring_subs'     => $expiringIn7Days,
            ],
            'charts' => [
                'weekly_registrations' => $weeklyReg,
                'top_wilayas'          => $topWilayas,
            ],
            'activity_feed' => $activityFeed,
        ];
    }
}
