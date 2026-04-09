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

        // Artisan Stats
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

        return response()->json([
            'stats' => [
                [
                    'label' => 'Vues du profil',
                    'value' => '1,245', // In a real app, this would be from a views table
                    'icon' => 'Eye',
                    'trend' => '+12%'
                ],
                [
                    'label' => 'Contacts reçus',
                    'value' => '28', 
                    'icon' => 'PhoneCall',
                    'trend' => '+5'
                ],
                [
                    'label' => 'Note Moyenne',
                    'value' => '4.8/5',
                    'icon' => 'Star',
                    'trend' => '+0.2'
                ],
                [
                    'label' => 'Total Avis',
                    'value' => '14',
                    'icon' => 'MessagesSquare',
                    'trend' => '+2'
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
        $requests = $artisan->scopeMatchingRequests(DemandeIntervention::query())->limit(5)->get();
        
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
        $sub = $user->abonnement;
        if (!$sub) return ['status' => 'expired', 'days_left' => 0];
        
        $days = (int) now()->diffInDays($sub->ends_at, false);
        
        return [
            'status' => $days <= 0 ? 'expired' : ($days <= 7 ? 'warning' : 'active'),
            'days_left' => $days,
            'ends_at' => $sub->ends_at
        ];
    }
}


