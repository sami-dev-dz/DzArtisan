<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Artisan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ArtisanStatsController extends Controller
{

    public function logContact(Request $request, $artisanId)
    {
        $request->validate([
            'type' => 'required|in:whatsapp,call'
        ]);

        $artisan = Artisan::findOrFail($artisanId);

        DB::table('artisan_contact_logs')->insert([
            'artisan_id' => $artisan->id,
            'user_id' => Auth::id(), 
            'type' => $request->type,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Contact event logged']);
    }

    public function getResponseRate($artisanId)
    {
        $artisan = Artisan::findOrFail($artisanId);

        $matchingRequestsCount = $artisan->matchingRequests()->count();

        if ($matchingRequestsCount === 0) {
            return response()->json(['rate' => null, 'label' => 'Données insuffisantes']);
        }

        $responsesCount = DB::table('demandes_interventions')
            ->where('artisan_id', $artisan->id)
            ->where('statut', 'artisan_contacte')
            ->count();

        $rate = ($responsesCount / $matchingRequestsCount) * 100;

        $label = $rate >= 80 ? "Répond très souvent" : ($rate >= 50 ? "Réponse rapide" : "Répond sous peu");

        return response()->json([
            'rate' => round($rate, 1),
            'label' => $label,
            'matching_requests' => $matchingRequestsCount,
            'responses' => $responsesCount
        ]);
    }
}
