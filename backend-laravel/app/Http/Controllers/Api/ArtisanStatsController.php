<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Artisan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ArtisanStatsController extends Controller
{
    /**
     * Log a contact click event (WhatsApp or Call)
     */
    public function logContact(Request $request, $artisanId)
    {
        $request->validate([
            'type' => 'required|in:whatsapp,call'
        ]);

        $artisan = Artisan::findOrFail($artisanId);

        DB::table('artisan_contact_logs')->insert([
            'artisan_id' => $artisan->id,
            'user_id' => Auth::id(), // null if guest
            'type' => $request->type,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Contact event logged']);
    }

    /**
     * Get response rate for an artisan
     */
    public function getResponseRate($artisanId)
    {
        $artisan = Artisan::findOrFail($artisanId);
        
        // Total "Job Opportunities" (Requests where this artisan was shown or matched)
        // For simplicity, we'll count Requests where this artisan belongs to the matching category and wilaya
        $matchingRequestsCount = $artisan->matchingRequests()->count();

        if ($matchingRequestsCount === 0) {
            return response()->json(['rate' => null, 'label' => 'Données insuffisantes']);
        }

        // Total "Responses" (Requests marked as 'artisan_contacte' where this artisan is the assigned one)
        $responsesCount = DB::table('demandes_interventions')
            ->where('artisan_id', $artisan->id)
            ->where('statut', 'artisan_contacte')
            ->count();

        $rate = ($responsesCount / $matchingRequestsCount) * 100;

        // Determine label (e.g. "Typically responds within 2 hours")
        // Since we don't have exact timing yet, we'll use rate as proxy or fixed labels
        $label = $rate >= 80 ? "Répond très souvent" : ($rate >= 50 ? "Réponse rapide" : "Répond sous peu");

        return response()->json([
            'rate' => round($rate, 1),
            'label' => $label,
            'matching_requests' => $matchingRequestsCount,
            'responses' => $responsesCount
        ]);
    }
}
