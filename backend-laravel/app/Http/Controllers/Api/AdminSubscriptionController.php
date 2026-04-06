<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Abonnement;
use App\Models\Paiement;
use App\Models\Artisan;
use App\Mail\SubscriptionConfirmed;
use App\Mail\SubscriptionRejected;
use App\Notifications\SubscriptionAlertNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class AdminSubscriptionController extends Controller
{
    /**
     * List all subscriptions with advanced filters.
     */
    public function index(Request $request)
    {
        $query = Abonnement::with(['artisan.user', 'paiements']);

        // Filter by plan
        if ($request->plan) {
            $query->where('plan', $request->plan);
        }

        // Filter by status
        if ($request->status) {
            $now = now();
            switch ($request->status) {
                case 'active':
                    $query->where('statut', 'actif')->where('date_fin', '>', $now);
                    break;
                case 'trial':
                    $query->where('plan', 'gratuit')->where('trial_ends_at', '>', $now);
                    break;
                case 'expiring_soon':
                    $query->where('date_fin', '>', $now)
                          ->where('date_fin', '<=', $now->copy()->addDays(7));
                    break;
                case 'expired':
                    $query->where('date_fin', '<=', $now);
                    break;
                case 'suspended':
                    $query->where('statut', 'suspendu');
                    break;
            }
        }

        // Search by artisan name
        if ($request->search) {
            $query->whereHas('artisan.user', function($q) use ($request) {
                $q->where('nomComplet', 'like', '%' . $request->search . '%');
            });
        }

        return response()->json($query->latest()->paginate(15));
    }

    /**
     * Get pending payment confirmation requests.
     */
    public function pending()
    {
        $pending = Paiement::with(['abonnement.artisan.user'])
            ->where('statut', 'en_attente')
            ->whereNotNull('preuve_paiement')
            ->latest()
            ->get();

        return response()->json($pending);
    }

    /**
     * Confirm a payment and activate subscription.
     */
    public function confirm($id)
    {
        $paiement = Paiement::with('abonnement.artisan.user')->findOrFail($id);
        $abonnement = $paiement->abonnement;

        // Set activation and expiration dates
        $durationMonths = match($abonnement->plan) {
            'mensuel' => 1,
            'trimestriel' => 3,
            'annuel' => 12,
            default => 1
        };

        $startDate = now();
        $endDate = $startDate->copy()->addMonths($durationMonths);

        $paiement->update(['statut' => 'succes']);
        
        $abonnement->update([
            'statut' => 'actif',
            'date_debut' => $startDate,
            'date_fin' => $endDate
        ]);

        // Notify artisan
        $artisan = $abonnement->artisan;
        $artisan->user->notify(new SubscriptionAlertNotification($abonnement, 'active'));

        return response()->json([
            'message' => 'Paiement confirmé et abonnement activé.',
            'abonnement' => $abonnement
        ]);
    }

    /**
     * Reject a payment.
     */
    public function reject(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        $paiement = Paiement::with('abonnement.artisan.user')->findOrFail($id);

        $paiement->update([
            'statut' => 'echec',
            'notes' => $request->reason
        ]);

        // Notify artisan
        $artisan = $paiement->abonnement->artisan;
        $artisan->user->notify(new SubscriptionAlertNotification($paiement->abonnement, 'expired'));

        return response()->json(['message' => 'Paiement rejeté et artisan notifié.']);
    }

    /**
     * Manually activate a subscription for an artisan.
     */
    public function manualActivate(Request $request)
    {
        $request->validate([
            'artisan_id' => 'required|exists:artisans,id',
            'plan' => 'required|in:mensuel,trimestriel,annuel',
            'amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string'
        ]);

        $artisan = Artisan::findOrFail($request->artisan_id);
        
        $durationMonths = match($request->plan) {
            'mensuel' => 1,
            'trimestriel' => 3,
            'annuel' => 12,
            default => 1
        };

        $subscription = Abonnement::updateOrCreate(
            ['artisan_id' => $artisan->id],
            [
                'plan' => $request->plan,
                'statut' => 'actif',
                'date_debut' => now(),
                'date_fin' => now()->addMonths($durationMonths)
            ]
        );

        $paiement = Paiement::create([
            'abonnement_id' => $subscription->id,
            'montant' => $request->amount,
            'methode' => 'manuel',
            'statut' => 'succes',
            'notes' => $request->notes ?? 'Activation manuelle par l\'administrateur.'
        ]);

        return response()->json([
            'message' => 'Abonnement activé manuellement avec succès.',
            'subscription' => $subscription
        ]);
    }

    /**
     * Get subscription history for an artisan.
     */
    public function artisanHistory($artisanId)
    {
        $abonnement = Abonnement::where('artisan_id', $artisanId)->first();
        
        if (!$abonnement) {
            return response()->json(['message' => 'Aucun abonnement trouvé pour cet artisan.'], 404);
        }

        $history = Paiement::where('abonnement_id', $abonnement->id)
            ->latest()
            ->get();

        return response()->json($history);
    }
}
