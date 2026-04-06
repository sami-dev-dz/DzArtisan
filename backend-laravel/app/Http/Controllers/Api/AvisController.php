<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Avis;
use App\Models\DemandeIntervention;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AvisController extends Controller
{
    /**
     * Store a new review for a completed intervention
     */
    public function store(Request $request, $interventionId)
    {
        $user = Auth::user();
        
        if ($user->type !== 'client') {
            return response()->json(['error' => 'Seuls les clients peuvent laisser des avis'], 403);
        }

        $intervention = DemandeIntervention::findOrFail($interventionId);

        // Security check
        if ($intervention->client_id !== $user->client->id) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        // Must be completed
        if ($intervention->statut !== 'termine') {
            return response()->json(['error' => 'Vous ne pouvez laisser un avis que sur une intervention terminée'], 400);
        }

        // Must have an artisan assigned
        if (!$intervention->artisan_id) {
            return response()->json(['error' => 'Aucun artisan associé à cette demande'], 400);
        }

        // Already reviewed?
        if ($intervention->avis()->exists()) {
            return response()->json(['error' => 'Vous avez déjà laissé un avis pour cette intervention'], 400);
        }

        $validated = $request->validate([
            'note' => 'required|integer|min:1|max:5',
            'commentaire' => 'nullable|string|max:500',
        ]);

        $avis = Avis::create([
            'demande_id' => $intervention->id,
            'client_id' => $intervention->client_id,
            'artisan_id' => $intervention->artisan_id,
            'note' => $validated['note'],
            'commentaire' => $validated['commentaire'],
        ]);

        return response()->json([
            'message' => 'Merci pour votre avis !',
            'avis' => $avis
        ], 201);
    }
}
