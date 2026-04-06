<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Abonnement;
use App\Models\Paiement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $artisan = $user->artisan;
        
        $user = Auth::user();
        $email = $user->email;
        $phone = $user->telephone;

        $trial_used = Abonnement::whereHas('artisan.user', function($q) use ($email, $phone) {
            $q->where('email', $email)
              ->orWhere('telephone', $phone);
        })->where('plan', 'gratuit')->exists();

        $plans = [
            [
                'id' => 'gratuit',
                'name' => 'Découverte (Trial)',
                'price' => 0,
                'duration_months' => 3,
                'description' => 'Idéal pour découvrir la plateforme',
                'features' => ['Badge Découverte', 'Visibilité standard', 'Limité à 3 mois'],
                'available' => !$trial_used,
                'reason' => $trial_used ? 'DEJA_UTILISE' : null
            ],
            [
                'id' => 'mensuel',
                'name' => 'Pro Mensuel',
                'price' => 1000,
                'duration_months' => 1,
                'description' => 'Flexibilité maximale',
                'features' => ['Badge Artisan Vérifié', 'Visibilité prioritaire', 'Support 24/7'],
                'available' => true
            ],
            [
                'id' => 'trimestriel',
                'name' => 'Pro Trimestriel',
                'price' => 3000,
                'duration_months' => 3,
                'description' => 'Engagement serein',
                'features' => ['Tout du plan Pro', 'Economie mensuelle', 'Badge Or'],
                'available' => true
            ],
            [
                'id' => 'annuel',
                'name' => 'Elite Annuel',
                'price' => 10000,
                'duration_months' => 12,
                'description' => 'Maximisez vos revenus',
                'features' => ['Visibilité maximum 58 Wilayas', 'Badge Elite', 'Assistance premium', 'Economisez 20%'],
                'available' => true,
                'best_value' => true
            ],
        ];

        return response()->json([
            'plans' => $plans,
            'trial_used' => $trial_used
        ]);
    }

    public function status()
    {
        $user = Auth::user();
        $artisan = $user->artisan;
        $subscription = $artisan->abonnement;

        if (!$subscription) {
            return response()->json([
                'statut' => 'aucun',
                'plan' => 'none',
                'days_left' => 0
            ]);
        }

        $now = now();
        $expired = $subscription->date_fin && $subscription->date_fin->isPast();
        $expiring_soon = $subscription->date_fin && $subscription->date_fin->diffInDays($now) <= 7;

        return response()->json([
            'id' => $subscription->id,
            'plan' => $subscription->plan,
            'statut' => $subscription->statut,
            'date_debut' => $subscription->date_debut,
            'date_fin' => $subscription->date_fin,
            'expired' => $expired,
            'expiring_soon' => $expiring_soon,
            'days_left' => $subscription->date_fin ? max(0, $subscription->date_fin->diffInDays($now, false)) : 0,
            'history' => $subscription->paiements()->latest()->get()
        ]);
    }

    public function subscribe(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|in:gratuit,mensuel,trimestriel,annuel',
        ]);

        $user = Auth::user();
        $artisan = $user->artisan;

        // One trial per account
        // One trial per email OR phone number across all accounts
        if ($request->plan_id === 'gratuit') {
            $user = Auth::user();
            $email = $user->email;
            $phone = $user->telephone;

            $exists = Abonnement::whereHas('artisan.user', function($q) use ($email, $phone) {
                $q->where('email', $email)
                  ->orWhere('telephone', $phone);
            })->where('plan', 'gratuit')->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'L\'offre découverte a déjà été activée pour cet email ou ce numéro de téléphone. Veuillez choisir un plan payant.',
                    'code' => 'TRIAL_ALREADY_USED'
                ], 403);
            }

            // Create trial subscription immediately
            $subscription = Abonnement::updateOrCreate(
                ['artisan_id' => $artisan->id],
                [
                    'plan' => 'gratuit',
                    'statut' => 'actif',
                    'date_debut' => now(),
                    'date_fin' => now()->addMonths(3),
                ]
            );

            return response()->json(['message' => 'Offre découverte activée !', 'subscription' => $subscription]);
        }

        // For paid plans, create a pending subscription
        $priceMap = ['mensuel' => 1000, 'trimestriel' => 3000, 'annuel' => 10000];
        
        $subscription = Abonnement::updateOrCreate(
            ['artisan_id' => $artisan->id],
            [
                'plan' => $request->plan_id,
                'statut' => 'en_attente',
                // Dates will be set upon payment confirmation
            ]
        );

        $paiement = Paiement::create([
            'abonnement_id' => $subscription->id,
            'montant' => $priceMap[$request->plan_id],
            'methode' => $request->methode ?? 'virement',
            'statut' => 'en_attente'
        ]);

        return response()->json([
            'message' => 'Veuillez procéder au paiement.',
            'subscription' => $subscription,
            'paiement_id' => $paiement->id
        ]);
    }

    public function uploadProof(Request $request)
    {
        $request->validate([
            'paiement_id' => 'required|exists:paiements,id',
            'preuve_paiement' => 'required|string', // Cloudinary URL
        ]);

        $paiement = Paiement::findOrFail($request->paiement_id);
        
        // Ensure this payment belongs to the user
        if ($paiement->abonnement->artisan_id !== Auth::user()->artisan->id) {
            abort(403);
        }

        $paiement->update([
            'preuve_paiement' => $request->preuve_paiement,
            'statut' => 'en_attente',
            'notes' => 'Preuve de virement soumise par l\'artisan.'
        ]);

        return response()->json(['message' => 'Preuve de paiement reçue. Un administrateur va vérifier votre virement.']);
    }

    public function history()
    {
        $artisan = Auth::user()->artisan;
        $abonnement = $artisan->abonnement;
        
        if (!$abonnement) return response()->json([]);

        $history = Paiement::where('abonnement_id', $abonnement->id)
            ->latest()
            ->get();

        return response()->json($history);
    }
}
