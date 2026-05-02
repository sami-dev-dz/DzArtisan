<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Artisan;
use App\Models\Wilaya;
use App\Models\DemandeIntervention;
use App\Models\CategorieMetier;
use App\Models\Avis;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;

class AdminStatsController extends Controller
{

    private function guardAdmin()
    {
        if (Auth::user()?->type !== 'admin') {
            abort(403, 'Accès réservé aux administrateurs.');
        }
    }

    public function index()
    {
        $this->guardAdmin();

        $now = now();
        $last12Months = [];
        for ($i = 11; $i >= 0; $i--) {
            $month = $now->copy()->subMonths($i);
            $last12Months[] = [
                'month' => $month->format('Y-m'),
                'label' => $month->translatedFormat('M Y'),
            ];
        }

        $wilayaActivity = Wilaya::select('id', 'nom')
            ->withCount('communes')
            ->get()
            ->map(function($w) {
                $requestCount = DemandeIntervention::where('wilaya_id', $w->id)->count();
                $artisanCount = Artisan::where('wilaya_id', $w->id)->count();

                $topCategory = DemandeIntervention::where('wilaya_id', $w->id)
                    ->select('categorie_id', DB::raw('count(*) as total'))
                    ->groupBy('categorie_id')
                    ->orderByDesc('total')
                    ->with('categorie:id,nom')
                    ->first();

                return [
                    'id' => $w->id,
                    'nom' => $w->nom,
                    'requests_count' => $requestCount,
                    'artisans_count' => $artisanCount,
                    'top_category' => $topCategory?->categorie?->nom ?? 'N/A',
                    'activity_level' => $this->calculateActivityLevel($requestCount)
                ];
            });

        $topWilayas = DemandeIntervention::select('wilaya_id', DB::raw('count(*) as total'))
            ->groupBy('wilaya_id')
            ->orderByDesc('total')
            ->limit(10)
            ->with('wilaya:id,nom')
            ->get()
            ->map(fn($r) => [
                'name' => $r->wilaya?->nom ?? 'Inconnu',
                'requests' => $r->total
            ]);

        $categoryDistribution = DemandeIntervention::select('categorie_id', DB::raw('count(*) as total'))
            ->groupBy('categorie_id')
            ->orderByDesc('total')
            ->limit(8) 
            ->with('categorie:id,nom')
            ->get()
            ->map(fn($r) => [
                'name' => $r->categorie?->nom ?? 'Autre',
                'value' => $r->total
            ]);

        $satisfactionTrends = [];
        foreach($last12Months as $m) {
            $avg = Avis::whereRaw("DATE_FORMAT(created_at, '%Y-%m') = ?", [$m['month']])->avg('note');
            $satisfactionTrends[] = [
                'month' => $m['label'],
                'rating' => round($avg ?? 0, 1)
            ];
        }

        $globalViews = Artisan::sum('profile_views_count');
        $globalContacts = Artisan::sum('contacts_count');
        $globalRequests = DemandeIntervention::count();
        $globalResponses = Artisan::sum('requests_responded_count');

        $conversionMetrics = [
            'view_to_contact' => $globalViews > 0 ? round(($globalContacts / $globalViews) * 100, 1) : 0,
            'request_to_response' => $globalRequests > 0 ? round(($globalResponses / $globalRequests) * 100, 1) : 0,
        ];

        return response()->json([
            'wilaya_activity' => $wilayaActivity,
            'top_wilayas' => $topWilayas,
            'category_distribution' => $categoryDistribution,
            'satisfaction_trends' => $satisfactionTrends,
            'conversion_metrics' => $conversionMetrics,
        ]);
    }

    public function artisanRanking(Request $request)
    {
        $this->guardAdmin();

        $artisans = Artisan::with(['user:id,nomComplet', 'primaryCategorie:id,nom'])
            ->orderBy('avg_response_time_minutes', 'asc') 
            ->paginate(20);

        return response()->json($artisans);
    }

    public function exportCSV(Request $request)
    {
        $this->guardAdmin();

        $type = $request->input('type', 'artisans');

        return match($type) {
            'clients'       => $this->exportClients(),
            'interventions' => $this->exportInterventions(),
            'transactions'  => $this->exportTransactions(),
            default         => $this->exportArtisans(),
        };
    }

    private function exportArtisans()
    {
        $filename = "artisans_performance_" . now()->format('Y-m-d_H-i') . ".csv";
        $headers = $this->csvHeaders($filename);
        $columns = ['ID', 'Artisan', 'Email', 'Catégorie', 'Wilaya', 'Statut Validation', 'Vues Profil', 'Contacts', 'Taux Conv (%)', 'Temps Réponse (min)', 'Demandes Répondues', 'Créé le'];

        $callback = function() use ($columns) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            fputcsv($file, $columns, ';');

            Artisan::with(['user:id,nomComplet,email', 'primaryCategorie:id,nom', 'primaryWilaya:id,nom'])
                ->chunk(100, function($artisans) use ($file) {
                    foreach ($artisans as $a) {
                        $convRate = $a->profile_views_count > 0
                            ? round(($a->contacts_count / $a->profile_views_count) * 100, 2)
                            : 0;
                        fputcsv($file, [
                            $a->id,
                            $a->user?->nomComplet,
                            $a->user?->email,
                            $a->primaryCategorie?->nom,
                            $a->primaryWilaya?->nom,
                            $a->statutValidation,
                            $a->profile_views_count,
                            $a->contacts_count,
                            $convRate,
                            round($a->avg_response_time_minutes, 1),
                            $a->requests_responded_count,
                            $a->created_at?->format('d/m/Y'),
                        ], ';');
                    }
                });
            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }

    private function exportClients()
    {
        $filename = "clients_" . now()->format('Y-m-d_H-i') . ".csv";
        $headers = $this->csvHeaders($filename);
        $columns = ['ID', 'Nom Complet', 'Email', 'Téléphone', 'Nb Demandes', 'Nb Interventions', 'Inscrit le'];

        $callback = function() use ($columns) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            fputcsv($file, $columns, ';');

            User::where('type', 'client')
                ->withCount(['demandesInterventions', 'interventions'])
                ->chunk(100, function($users) use ($file) {
                    foreach ($users as $u) {
                        fputcsv($file, [
                            $u->id,
                            $u->nomComplet,
                            $u->email,
                            $u->telephone,
                            $u->demandes_interventions_count,
                            $u->interventions_count,
                            $u->created_at?->format('d/m/Y'),
                        ], ';');
                    }
                });
            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }

    private function exportInterventions()
    {
        $filename = "interventions_" . now()->format('Y-m-d_H-i') . ".csv";
        $headers = $this->csvHeaders($filename);
        $columns = ['ID', 'Titre', 'Client', 'Artisan', 'Catégorie', 'Wilaya', 'Statut', 'Montant Estimé', 'Date Création'];

        $callback = function() use ($columns) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            fputcsv($file, $columns, ';');

            DemandeIntervention::with(['client:id,nomComplet', 'artisan.user:id,nomComplet', 'categorie:id,nom', 'wilaya:id,nom'])
                ->chunk(100, function($items) use ($file) {
                    foreach ($items as $item) {
                        fputcsv($file, [
                            $item->id,
                            $item->titre,
                            $item->client?->nomComplet,
                            $item->artisan?->user?->nomComplet,
                            $item->categorie?->nom,
                            $item->wilaya?->nom,
                            $item->statut,
                            $item->budget_max ?? 'N/A',
                            $item->created_at?->format('d/m/Y'),
                        ], ';');
                    }
                });
            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }

    private function exportTransactions()
    {
        $filename = "transactions_" . now()->format('Y-m-d_H-i') . ".csv";
        $headers = $this->csvHeaders($filename);
        $columns = ['ID', 'Artisan', 'Plan', 'Montant (DZD)', 'Méthode', 'Statut', 'Date Paiement'];

        $callback = function() use ($columns) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            fputcsv($file, $columns, ';');

            DB::table('paiements')
                ->join('abonnements', 'paiements.abonnement_id', '=', 'abonnements.id')
                ->join('artisans', 'abonnements.artisan_id', '=', 'artisans.id')
                ->join('users', 'artisans.user_id', '=', 'users.id')
                ->join('plans', 'abonnements.plan_id', '=', 'plans.id')
                ->select(
                    'paiements.id',
                    'users.nomComplet as artisan_name',
                    'plans.nom as plan_name',
                    'paiements.montant',
                    'paiements.methode_paiement',
                    'paiements.statut',
                    'paiements.created_at'
                )
                ->orderByDesc('paiements.created_at')
                ->chunk(100, function($rows) use ($file) {
                    foreach ($rows as $row) {
                        fputcsv($file, [
                            $row->id,
                            $row->artisan_name,
                            $row->plan_name,
                            $row->montant,
                            $row->methode_paiement,
                            $row->statut,
                            $row->created_at,
                        ], ';');
                    }
                });
            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }

    private function csvHeaders(string $filename): array
    {
        return [
            "Content-type"        => "text/csv; charset=UTF-8",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];
    }

    private function calculateActivityLevel($count)
    {
        if ($count > 100) return 4; 
        if ($count > 50)  return 3;
        if ($count > 10)  return 2;
        if ($count > 0)   return 1;
        return 0; 
    }
}
