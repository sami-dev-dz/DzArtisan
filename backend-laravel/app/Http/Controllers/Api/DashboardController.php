<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DemandeIntervention;
use App\Models\Abonnement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function stats()
    {
        $user = Auth::user();

        if ($user->type === 'client') {
            return response()->json([
                [
                    'label' => 'Missions Postées',
                    'value' => $user->demandesIntervention()->count(),
                    'icon' => 'ClipboardList',
                    'trend' => '+2'
                ],
                [
                    'label' => 'Missions Terminées',
                    'value' => $user->demandesIntervention()->where('statut', 'completed')->count(),
                    'icon' => 'CheckCircle',
                    'trend' => '+1'
                ],
                [
                    'label' => 'Dépenses Totales',
                    'value' => '45,000 DA',
                    'icon' => 'Wallet',
                    'trend' => '+5k'
                ]
            ]);
        }

        $artisan = $user->artisan;
        if (!$artisan) {
            return response()->json([
                'stats' => [],
                'completeness' => 0,
                'missing_items' => [],
                'subscription' => $this->getSubscriptionSummary($user),
            ]);
        }
        $artisan->load(['categories', 'wilayas']);

        $opportunitesCount = $artisan->matchingRequests()->count();
        $propositionsCount = \App\Models\DemandeProposition::where('artisan_id', $artisan->id)->count();
        $interventionsTermineesCount = \App\Models\DemandeIntervention::where('artisan_id', $artisan->id)->whereIn('statut', ['completed', 'terminee'])->count();

        return response()->json([
            'stats' => [
                [
                    'label' => 'Missions Dispos',
                    'value' => number_format($opportunitesCount), 
                    'icon' => 'Zap',
                    'trend' => '+N/A' 
                ],
                [
                    'label' => 'Devis Soumis',
                    'value' => number_format($propositionsCount), 
                    'icon' => 'Send',
                    'trend' => '+N/A'
                ],
                [
                    'label' => 'Missions Terminées',
                    'value' => number_format($interventionsTermineesCount),
                    'icon' => 'ShieldCheck',
                    'trend' => '+N/A'
                ],
                [
                    'label' => 'Note Globale',
                    'value' => number_format($artisan->average_rating, 1) . '/5',
                    'icon' => 'Star',
                    'trend' => $artisan->reviews_count . ' avis'
                ]
            ],
            'completeness' => $artisan->completeness,
            'missing_items' => $this->getMissingItems($artisan),
            'subscription' => $this->getSubscriptionSummary($user)
        ]);
    }

    public function matchingRequests()
    {
        $user = Auth::user();
        if ($user->type !== 'artisan') return response()->json(['error' => 'Non autorisé'], 403);

        $artisan = $user->artisan;
        if (!$artisan) {
            return response()->json([]);
        }

        // Combiner pivot (many-to-many) + champ direct — même logique que ArtisanJobController
        $categoryIds = $artisan->categories()->pluck('categorie_metiers.id')->toArray();
        if ($artisan->categorie_id) {
            $categoryIds[] = $artisan->categorie_id;
        }
        $categoryIds = array_unique(array_filter($categoryIds));

        $wilayaIds = $artisan->wilayas()->pluck('wilayas.id')->toArray();
        if ($artisan->wilaya_id) {
            $wilayaIds[] = $artisan->wilaya_id;
        }
        $wilayaIds = array_unique(array_filter($wilayaIds));

        if (empty($categoryIds) || empty($wilayaIds)) {
            return response()->json([]);
        }

        $requests = DemandeIntervention::whereIn('categorie_id', $categoryIds)
            ->whereIn('wilaya_id', $wilayaIds)
            ->where('statut', 'en_attente')
            ->with(['categorie', 'wilaya', 'commune', 'client.user'])
            ->withCount('propositions')
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get();

        return response()->json($requests);
    }

    private function getMissingItems($artisan)
    {
        $missing = [];
        if (!$artisan->photo) $missing[] = ['id' => 'photo', 'label' => 'Photo de profil', 'link' => '/artisan/profile'];
        if (!$artisan->lienWhatsApp) $missing[] = ['id' => 'whatsapp', 'label' => 'Lien WhatsApp', 'link' => '/artisan/profile'];
        if (strlen($artisan->description) < 50) $missing[] = ['id' => 'about', 'label' => 'Description détaillée', 'link' => '/artisan/profile'];
        if (!$artisan->artisan_card_url) $missing[] = ['id' => 'card', 'label' => 'Carte d\'artisan', 'link' => '/artisan/profile'];
        return $missing;
    }

    private function getSubscriptionSummary($user)
    {
        $artisan = $user->artisan;
        if (!$artisan) return ['status' => 'none', 'plan' => 'none', 'days_left' => 0, 'is_premium' => false];

        $sub = $artisan->abonnement;
        if (!$sub) return ['status' => 'none', 'plan' => 'none', 'days_left' => 0, 'is_premium' => false];

        $expired = $sub->date_fin && $sub->date_fin->isPast();
        if ($expired) return ['status' => 'expired', 'plan' => $sub->plan, 'days_left' => 0, 'is_premium' => false];

        $days = (int) now()->diffInDays($sub->date_fin, false);

        return [
            'status' => $days <= 0 ? 'expired' : ($days <= 7 ? 'warning' : 'active'),
            'plan' => $sub->plan,
            'days_left' => max(0, $days),
            'is_premium' => $sub->is_premium,
            'date_fin' => $sub->date_fin,
        ];
    }
}

