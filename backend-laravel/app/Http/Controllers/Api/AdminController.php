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

// Contrôleur réservé à l'administrateur pour gérer les utilisateurs, artisans et statistiques
class AdminController extends Controller
{

    // Vérifie que l'utilisateur est bien un administrateur, sinon on bloque l'accès
    private function guardAdmin()
    {
        if (Auth::user()?->type !== 'admin') {
            abort(403, 'Accès réservé aux administrateurs.');
        }
    }

    // Retourne les données de vue d'ensemble (stats globales) du tableau de bord admin
    public function overview()
    {
        $this->guardAdmin();

        $statsService = app(\App\Services\AdminStatsService::class);
        $data = $statsService->getOverviewData();

        return response()->json($data);
    }

    // Liste les artisans avec filtres par statut, recherche et wilaya
    public function indexArtisans(Request $request)
    {
        $this->guardAdmin();

        $status   = $request->query('status', 'pending');
        $search   = $request->query('search');
        $wilayaId = $request->query('wilaya_id');

        $query = Artisan::with([
            'user:id,nomComplet,email,telephone,statut,created_at',
            'primaryCategorie:id,nom',
            'primaryWilaya:id,nom',
            'abonnement'
        ])->withAdminStatus($status);

        // Filtre par nom ou email si une recherche est fournie
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

    // Liste les clients avec filtres par recherche, wilaya et statut de compte
    public function indexClients(Request $request)
    {
        $this->guardAdmin();

        $search   = $request->query('search');
        $wilayaId = $request->query('wilaya_id');
        $status   = $request->query('status');

        $query = Client::with(['user:id,nomComplet,email,telephone,statut,created_at', 'wilaya:id,nom'])
            ->withCount(['demandesInterventions as requests_count', 'avis as reviews_left_count']);

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

    // Envoie un email direct à un utilisateur depuis l'interface admin
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

    // Supprime un compte utilisateur en anonymisant ses données personnelles (RGPD)
    public function deleteUser(Request $request, $id)
    {
        $this->guardAdmin();

        $request->validate([
            'reason' => 'required|string|max:1000'
        ]);

        $user      = User::findOrFail($id);
        $userName  = $user->nomComplet;
        $userEmail = $user->email;

        // On notifie l'utilisateur par email avant de supprimer son compte
        Mail::to($userEmail)->send(new UserDeletionMail($userName, $request->reason));

        // Anonymisation des données personnelles au lieu d'une suppression physique
        $user->update([
            'nomComplet' => 'Utilisateur Supprimé',
            'email'      => 'deleted_' . $user->id . '@dzartisan.dz',
            'telephone'  => '0000000000',
            'password'   => bcrypt(Str::random(40)),
            'statut'     => 'supprime'
        ]);

        if ($user->artisan) {
            $user->artisan->update([
                'description'  => 'Compte supprimé',
                'telephone'    => '0000000000',
                'photo'        => null,
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

    // Effectue une action groupée sur plusieurs utilisateurs (envoi email ou suspension)
    public function bulkAction(Request $request)
    {
        $this->guardAdmin();

        $validated = $request->validate([
            'user_ids'   => 'required|array',
            'user_ids.*' => 'exists:users,id',
            'type'       => 'required|in:email,suspend',
            'subject'    => 'required_if:type,email|string|max:255',
            'message'    => 'required|string',
        ]);

        $users = User::whereIn('id', $validated['user_ids'])->get();

        if ($validated['type'] === 'email') {
            // On envoie les emails en file d'attente pour ne pas bloquer la requête
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

    // Change le statut de validation d'un artisan (approuver, rejeter, suspendre, réactiver)
    public function updateArtisanStatus(Request $request, $id)
    {
        $this->guardAdmin();

        $request->validate([
            'action' => 'required|in:approve,reject,suspend,unsuspend',
            'reason' => 'nullable|required_if:action,reject,suspend|string|max:1000'
        ]);

        $artisan = Artisan::with('user')->findOrFail($id);
        $user    = $artisan->user;

        // On applique l'action correspondante et on notifie l'artisan par email et WebSocket
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

    // Active ou désactive la mise en avant / recommandation d'un artisan dans la recherche
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

        $label       = $request->type === 'featured' ? 'Mise en avant' : 'Recommandation';
        $statusLabel = $request->value ? 'activée' : 'désactivée';

        return response()->json([
            'message' => "{$label} {$statusLabel} avec succès.",
            'artisan' => $artisan
        ]);
    }
}
