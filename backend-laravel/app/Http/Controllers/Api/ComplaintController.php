<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reclamation;
use App\Models\DemandeIntervention;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ComplaintController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $complaints = Reclamation::where('demandeur_id', $user->id)
            ->with(['accuse', 'intervention'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($complaints);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'intervention_id' => 'required|exists:demandes_interventions,id',
            'titre' => 'required|string|max:200',
            'description' => 'required|string|min:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $intervention = DemandeIntervention::where('id', $request->intervention_id)
            ->where(function($query) use ($user) {
                $query->where('client_id', $user->client?->id)
                      ->orWhere('artisan_id', $user->artisan?->id);
            })->first();

        if (!$intervention) {
            return response()->json(['error' => 'Intervention introuvable ou non autorisée.'], 403);
        }

        $isClient = $user->role === 'client';
        $accuseId = $isClient ? $intervention->artisan->user_id : $intervention->client->user_id;
        $type = $isClient ? 'client_vers_artisan' : 'artisan_vers_client';

        $complaint = Reclamation::create([
            'demandeur_id' => $user->id,
            'accuse_id' => $accuseId,
            'type' => $type,
            'categorie' => 'mauvaise_prestation', 
            'description' => "Sujet: " . $request->titre . "\n\n" . $request->description,
            'statut' => 'nouveau',
            'intervention_id' => $intervention->id,
        ]);

        return response()->json($complaint, 201);
    }
}
