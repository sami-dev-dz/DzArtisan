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
                'name' => 'Plan Free',
                'price' => 0,
                'duration_months' => 0,
                'description' => 'Accès limité au tableau de bord',
                'features' => ['Visibilité basique', 'Accès restreint aux annonces', 'Fonctionnalités avancées bloquées'],
                'available' => true,
                'reason' => null
            ],
            [
                'id' => 'mensuel',
                'name' => 'Abonnement 1 Mois',
                'price' => 500,
                'duration_months' => 1,
                'description' => 'Idéal pour tester les fonctionnalités Premium',
                'features' => ['Accès illimité aux jobs', 'Interaction directe avec les clients', 'Badge Artisan Pro'],
                'available' => true
            ],
            [
                'id' => 'trimestriel',
                'name' => 'Abonnement 3 Mois',
                'price' => 1500,
                'duration_months' => 3,
                'description' => 'Le choix le plus populaire',
                'features' => ['Toutes les fonctionnalités 1 Mois', 'Meilleur taux de conversion', 'Support prioritaire'],
                'available' => true,
                'best_value' => true
            ],
            [
                'id' => 'annuel',
                'name' => 'Abonnement 1 An',
                'price' => 4000,
                'duration_months' => 12,
                'description' => 'Maximisez vos revenus',
                'features' => ['Visibilité maximum 58 Wilayas', 'Badge Elite', 'Assistance premium', 'Economie massive'],
                'available' => true
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

        if (!$artisan) {
            return response()->json([
                'statut' => 'aucun',
                'plan' => 'none',
                'days_left' => 0,
                'is_premium' => false,
            ]);
        }

        $subscription = $artisan->abonnement;

        if (!$subscription) {
            return response()->json([
                'statut' => 'aucun',
                'plan' => 'none',
                'days_left' => 0,
                'is_premium' => false,
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
            'is_premium' => $subscription->is_premium,
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

            $subscription = Abonnement::updateOrCreate(
                ['artisan_id' => $artisan->id],
                [
                    'plan' => 'gratuit',
                    'statut' => 'actif',
                    'date_debut' => now(),
                    'date_fin' => now()->addYears(10),
                ]
            );

            return response()->json(['message' => 'Plan gratuit sélectionné', 'subscription' => $subscription]);
        }

        $priceMap = ['mensuel' => 500, 'trimestriel' => 1500, 'annuel' => 4000];

        $subscription = Abonnement::updateOrCreate(
            ['artisan_id' => $artisan->id],
            [
                'plan' => $request->plan_id,
                'statut' => 'en_attente',

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
            'preuve_paiement' => 'required|string', 
        ]);

        $paiement = Paiement::findOrFail($request->paiement_id);

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
