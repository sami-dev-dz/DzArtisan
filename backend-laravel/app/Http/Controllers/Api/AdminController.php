<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Artisan;
use App\Models\Client;
use App\Models\DemandeIntervention;
use App\Models\Abonnement;
use App\Models\Avis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Mail\UserDeletionMail;
use App\Mail\AdminDirectMail;
use App\Mail\ArtisanApproved;
use App\Mail\ArtisanRejected;
use App\Mail\ArtisanSuspended;
use App\Mail\SuspensionLifted;
use App\Notifications\ArtisanStatusNotification;

class AdminController extends Controller
{

    private function guardAdmin()
    {
        if (Auth::user()?->type !== 'admin') {
            abort(403, 'Accès réservé aux administrateurs.');
        }
    }

    public function overview()
    {
        $this->guardAdmin();

        $now        = now();
        $startMonth = $now->copy()->startOfMonth();
        $startPrev  = $now->copy()->subMonth()->startOfMonth();
        $endPrev    = $now->copy()->subMonth()->endOfMonth();

        $totalUsers     = User::count();
        $usersThisMonth = User::whereBetween('created_at', [$startMonth, $now])->count();
        $usersPrevMonth = User::whereBetween('created_at', [$startPrev, $endPrev])->count();
        $usersTrend     = $usersPrevMonth > 0
            ? round((($usersThisMonth - $usersPrevMonth) / $usersPrevMonth) * 100, 1)
            : 0;

        $activeArtisans     = Artisan::where('statutValidation', 'valide')->count();
        $artisansThisMonth  = Artisan::where('statutValidation', 'valide')
            ->whereBetween('updated_at', [$startMonth, $now])->count();
        $artisansPrevMonth  = Artisan::where('statutValidation', 'valide')
            ->whereBetween('updated_at', [$startPrev, $endPrev])->count();
        $artisansTrend = $artisansPrevMonth > 0
            ? round((($artisansThisMonth - $artisansPrevMonth) / $artisansPrevMonth) * 100, 1)
            : 0;

        $requestsThisMonth = DemandeIntervention::whereBetween('created_at', [$startMonth, $now])->count();
        $requestsPrevMonth = DemandeIntervention::whereBetween('created_at', [$startPrev, $endPrev])->count();
        $requestsTrend = $requestsPrevMonth > 0
            ? round((($requestsThisMonth - $requestsPrevMonth) / $requestsPrevMonth) * 100, 1)
            : 0;

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

        $pendingArtisans    = Artisan::where('statutValidation', 'en_attente')->count();
        $expiringIn7Days    = Abonnement::where('statut', 'actif')
            ->whereBetween('date_fin', [$now, $now->copy()->addDays(7)])
            ->count();

        try {
            $unreadComplaints = DB::table('reclamations')
                ->where('statut', 'nouveau')
                ->count();
        } catch (\Exception $e) {
            $unreadComplaints = 0;
        }

        $weeklyReg = [];
        for ($i = 7; $i >= 0; $i--) {
            $weekStart = $now->copy()->subWeeks($i)->startOfWeek();
            $weekEnd   = $weekStart->copy()->endOfWeek();
            $label     = 'S' . $weekStart->weekOfYear;

            $weeklyReg[] = [
                'week'    => $label,
                'clients'  => User::where('type', 'client')->whereBetween('created_at', [$weekStart, $weekEnd])->count(),
                'artisans' => User::where('type', 'artisan')->whereBetween('created_at', [$weekStart, $weekEnd])->count(),
            ];
        }

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

        $recentArtisans = Artisan::with('user:id,nomComplet')
            ->latest()->limit(5)
            ->get()
            ->map(fn($a) => [
                'type'    => 'artisan_submitted',
                'message' => 'Nouveau profil artisan soumis : ' . $a->user?->nomComplet,
                'at'      => $a->created_at,
                'link'    => '/dashboard/admin/artisans',
            ]);

        $recentInterventions = DemandeIntervention::with('client.user:id,nomComplet')
            ->latest()->limit(5)
            ->get()
            ->map(fn($i) => [
                'type'    => 'intervention_created',
                'message' => 'Nouvelle demande publiée : "' . $i->titre . '"',
                'at'      => $i->created_at,
                'link'    => '/dashboard/admin/interventions',
            ]);

        $recentSubscriptions = Abonnement::with('artisan.user:id,nomComplet')
            ->latest()->limit(5)
            ->get()
            ->map(fn($s) => [
                'type'    => 'subscription_renewed',
                'message' => 'Abonnement activé pour : ' . $s->artisan?->user?->nomComplet,
                'at'      => $s->created_at,
                'link'    => '/dashboard/admin/subscriptions',
            ]);

        $activityFeed = $recentArtisans
            ->concat($recentInterventions)
            ->concat($recentSubscriptions)
            ->sortByDesc('at')
            ->take(10)
            ->values();

        return response()->json([
            'kpis' => [
                [
                    'label'       => 'Utilisateurs Inscrits',
                    'key'         => 'total_users',
                    'value'       => $totalUsers,
                    'trend'       => $usersTrend,
                    'icon'        => 'Users',
                    'color'       => 'blue',
                ],
                [
                    'label'       => 'Artisans Actifs',
                    'key'         => 'active_artisans',
                    'value'       => $activeArtisans,
                    'trend'       => $artisansTrend,
                    'icon'        => 'Briefcase',
                    'color'       => 'emerald',
                ],
                [
                    'label'       => 'Demandes ce mois',
                    'key'         => 'requests_month',
                    'value'       => $requestsThisMonth,
                    'trend'       => $requestsTrend,
                    'icon'        => 'ClipboardList',
                    'color'       => 'violet',
                ],
                [
                    'label'       => 'Revenus ce mois (DA)',
                    'key'         => 'revenue_month',
                    'value'       => number_format($revenueThisMonth, 0, '.', ' ') . ' DA',
                    'trend'       => $revenueTrend,
                    'icon'        => 'TrendingUp',
                    'color'       => 'amber',
                ],
            ],
            'alerts' => [
                'pending_artisans'   => $pendingArtisans,
                'unread_complaints'  => $unreadComplaints,
                'expiring_subs'      => $expiringIn7Days,
            ],
            'charts' => [
                'weekly_registrations' => $weeklyReg,
                'top_wilayas'          => $topWilayas,
            ],
            'activity_feed' => $activityFeed,
        ]);
    }

    public function indexArtisans(Request $request)
    {
        $this->guardAdmin();

        $status = $request->query('status', 'pending'); 
        $search = $request->query('search');
        $wilayaId = $request->query('wilaya_id');

        $query = Artisan::with([
            'user:id,nomComplet,email,telephone,statut,created_at',
            'primaryCategorie:id,nom', 
            'primaryWilaya:id,nom',
            'abonnement'
        ])
        ->withAdminStatus($status);

        if ($search) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('nomComplet', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($wilayaId) {
            $query->where('wilaya_id', $wilayaId);
        }

        $artisans = $query->latest()->paginate(15);

        return response()->json($artisans);
    }

    public function indexClients(Request $request)
    {
        $this->guardAdmin();

        $search = $request->query('search');
        $wilayaId = $request->query('wilaya_id');
        $status = $request->query('status'); 

        $query = Client::with(['user:id,nomComplet,email,telephone,statut,created_at', 'wilaya:id,nom'])
            ->withCount('demandesInterventions as requests_count');

        if ($search) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('nomComplet', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($wilayaId) {
            $query->where('wilaya_id', $wilayaId);
        }

        if ($status) {
            $query->whereHas('user', fn($q) => $q->where('statut', $status));
        }

        $clients = $query->latest('created_at')->paginate(15);

        return response()->json($clients);
    }

    public function sendDirectEmail(Request $request)
    {
        $this->guardAdmin();

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'subject' => 'required|string|max:255',
            'message' => 'required|string'
        ]);

        $user = User::findOrFail($validated['user_id']);

        Mail::to($user->email)->send(new AdminDirectMail($user, $validated['subject'], $validated['message']));

        return response()->json(['message' => 'E-mail envoyé avec succès.']);
    }

    public function deleteUser(Request $request, $id)
    {
        $this->guardAdmin();

        $request->validate([
            'reason' => 'required|string|max:1000'
        ]);

        $user = User::findOrFail($id);
        $userName = $user->nomComplet;
        $userEmail = $user->email;

        Mail::to($userEmail)->send(new UserDeletionMail($userName, $request->reason));

        $user->update([
            'nomComplet' => 'Utilisateur Supprimé',
            'email'      => 'deleted_' . $user->id . '@dzartisan.dz',
            'telephone'  => '0000000000',
            'password'   => bcrypt(Str::random(40)),
            'statut'     => 'supprime'
        ]);

        if ($user->artisan) {
            $user->artisan->update([
                'description' => 'Compte supprimé',
                'telephone'   => '0000000000',
                'photo'       => null,
                'lienWhatsApp' => null
            ]);
        }

        if ($user->client) {
            $user->client->update([
                'telephone' => '0000000000',
                'adresse'   => 'Information supprimée'
            ]);
        }

        return response()->json(['message' => 'Le compte a été supprimé définitivement et les données personnelles ont été anonymisées.']);
    }

    public function bulkAction(Request $request)
    {
        $this->guardAdmin();

        $validated = $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
            'type' => 'required|in:email,suspend',
            'subject' => 'required_if:type,email|string|max:255',
            'message' => 'required|string', 
        ]);

        $users = User::whereIn('id', $validated['user_ids'])->get();

        if ($validated['type'] === 'email') {
            foreach ($users as $user) {

                Mail::to($user->email)->queue(new AdminDirectMail($user, $validated['subject'], $validated['message']));
            }
            $msg = count($users) . " e-mails ont été mis en file d'attente.";
        } else {
            User::whereIn('id', $validated['user_ids'])->update(['statut' => 'suspendu']);

            $msg = count($users) . " comptes ont été suspendus.";
        }

        return response()->json(['message' => $msg]);
    }

    public function updateArtisanStatus(Request $request, $id)
    {
        $this->guardAdmin();

        $request->validate([
            'action' => 'required|in:approve,reject,suspend,unsuspend',
            'reason' => 'nullable|required_if:action,reject,suspend|string|max:1000'
        ]);

        $artisan = Artisan::with('user')->findOrFail($id);
        $user = $artisan->user;

        switch ($request->action) {
            case 'approve':
                $artisan->update([
                    'statutValidation' => 'valide',
                    'dateValidation'   => now(),
                    'rejection_reason' => null
                ]);
                $user->update(['statut' => 'actif']);
                $user->notify(new ArtisanStatusNotification('approved'));
                $message = "L'artisan a été approuvé avec succès.";
                break;

            case 'reject':
                $artisan->update([
                    'statutValidation' => 'refuse',
                    'rejection_reason' => $request->reason
                ]);
                $user->notify(new ArtisanStatusNotification('rejected', $request->reason));
                $message = "Le dossier de l'artisan a été rejeté.";
                break;

            case 'suspend':
                $user->update(['statut' => 'suspendu']);
                $artisan->update(['suspension_reason' => $request->reason]);
                $user->notify(new ArtisanStatusNotification('suspended', $request->reason));
                $message = "Le compte de l'artisan a été suspendu.";
                break;

            case 'unsuspend':
                $user->update(['statut' => 'actif']);
                $artisan->update(['suspension_reason' => null]);

                $user->notify(new ArtisanStatusNotification('approved')); 
                $message = "La suspension a été levée.";
                break;
        }

        return response()->json([
            'message' => $message,
            'artisan' => $artisan->load('user')
        ]);
    }

    public function promoteArtisan(Request $request, $id)
    {
        $this->guardAdmin();

        $request->validate([
            'type'  => 'required|in:featured,recommended',
            'value' => 'required|boolean'
        ]);

        $artisan = Artisan::findOrFail($id);

        if ($request->type === 'featured') {
            $artisan->is_featured = $request->value;
        } else {
            $artisan->is_recommended = $request->value;
        }

        $artisan->save();

        $label = $request->type === 'featured' ? 'Mise en avant' : 'Recommandation';
        $statusLabel = $request->value ? 'activée' : 'désactivée';

        return response()->json([
            'message' => "{$label} {$statusLabel} avec succès.",
            'artisan' => $artisan
        ]);
    }
}
