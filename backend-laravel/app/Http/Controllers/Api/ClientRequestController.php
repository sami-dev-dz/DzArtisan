<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DemandeIntervention;
use App\Models\DemandeProposition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

// Contrôleur qui gère les demandes d'intervention du côté client
class ClientRequestController extends Controller
{

    // Récupère toutes les demandes de l'utilisateur connecté avec un filtre optionnel par statut
    public function index(Request $request)
    {
        $user = Auth::user();
        $client = $user->client;

        // Si le profil client n'existe pas encore, on le crée automatiquement
        if (!$client) {
            if ($user->type === 'client') {
                $client = $user->client()->create([
                    'wilaya_id'  => 16,
                    'commune_id' => 1,
                ]);
            } else {
                return response()->json([]);
            }
        }

        $query = DemandeIntervention::where('client_id', $client->id)
            ->with(['categorie', 'wilaya', 'commune'])
            ->withCount('propositions');

        // Filtre : active = en cours, archived = terminée ou annulée
        $status = $request->query('status');

        if ($status === 'active') {
            $query->whereIn('statut', ['en_attente', 'acceptee']);
        } elseif ($status === 'archived') {
            $query->whereIn('statut', ['terminee', 'annulee']);
        }

        $requests = $query->orderBy('created_at', 'desc')->get();

        return response()->json($requests);
    }

    // Affiche le détail d'une demande avec ses propositions et la note moyenne des artisans
    public function show($id)
    {
        $user   = Auth::user();
        $client = $user->client;
        if (!$client && $user->type === 'client') {
            $client = $user->client()->create(['wilaya_id' => 16, 'commune_id' => 1]);
        }
        if (!$client) {
            return response()->json(['message' => 'No client profile'], 404);
        }

        $demande = DemandeIntervention::where('id', $id)
            ->where('client_id', $client->id)
            ->with([
                'categorie',
                'wilaya',
                'commune',
                'photos',
                'propositions.artisan.user',
                'propositions.artisan' => function($q) {
                    // On calcule la moyenne des notes directement dans la requête
                    $q->withCount(['avis as average_rating' => function($query) {
                        $query->select(\DB::raw('coalesce(avg(note), 0)'));
                    }]);
                }
            ])
            ->firstOrFail();

        return response()->json($demande);
    }

    // Mise à jour d'une demande (uniquement si elle est encore en attente)
    public function update(Request $request, $id)
    {
        $user   = Auth::user();
        $client = $user->client;
        if (!$client) {
            return response()->json(['message' => 'No client profile'], 404);
        }

        $demande = DemandeIntervention::where('id', $id)
            ->where('client_id', $client->id)
            ->where('statut', 'en_attente')
            ->firstOrFail();

        $validated = $request->validate([
            'titre'        => 'sometimes|string|max:255',
            'description'  => 'sometimes|string',
            'categorie_id' => 'sometimes|exists:categories_metiers,id',
            'wilaya_id'    => 'sometimes|exists:wilayas,id',
            'commune_id'   => 'sometimes|exists:communes,id',
            'latitude'     => 'nullable|numeric',
            'longitude'    => 'nullable|numeric',
            'telephone'    => 'nullable|string|max:20',
            'whatsapp'     => 'nullable|string|max:255',
            'date_souhaitee' => 'nullable|date',
        ]);

        $demande->update($validated);

        return response()->json([
            'message' => 'Request updated successfully',
            'demande' => $demande
        ]);
    }

    // Annulation d'une demande (seulement si elle est en attente)
    public function cancel($id)
    {
        $user   = Auth::user();
        $client = $user->client;
        if (!$client && $user->type === 'client') {
            $client = $user->client()->create(['wilaya_id' => 16, 'commune_id' => 1]);
        }
        if (!$client) {
            return response()->json(['message' => 'No client profile'], 404);
        }

        $demande = DemandeIntervention::where('id', $id)
            ->where('client_id', $client->id)
            ->where('statut', 'en_attente')
            ->firstOrFail();

        $demande->update(['statut' => 'annulee']);

        return response()->json(['message' => 'Request cancelled successfully']);
    }

    // Acceptation d'une proposition : on marque les autres comme rejetées et on notifie l'artisan
    public function acceptProposal(Request $request, $id, $proposalId)
    {
        $user   = Auth::user();
        $client = $user->client;
        if (!$client && $user->type === 'client') {
            $client = $user->client()->create(['wilaya_id' => 16, 'commune_id' => 1]);
        }
        if (!$client) {
            return response()->json(['message' => 'No client profile'], 404);
        }

        $demande  = DemandeIntervention::where('id', $id)
            ->where('client_id', $client->id)
            ->where('statut', 'en_attente')
            ->firstOrFail();

        $proposal = DemandeProposition::where('id', $proposalId)
            ->where('demande_id', $id)
            ->firstOrFail();

        // On utilise une transaction pour que toutes les mises à jour soient atomiques
        \DB::transaction(function () use ($demande, $proposal) {
            $demande->update([
                'statut'     => 'acceptee',
                'artisan_id' => $proposal->artisan_id
            ]);

            $proposal->update(['statut' => 'acceptee']);

            // On rejette automatiquement toutes les autres propositions
            DemandeProposition::where('demande_id', $demande->id)
                ->where('id', '!=', $proposal->id)
                ->update(['statut' => 'rejetee']);
        });

        // Chargement des relations et envoi de la notification en temps réel à l'artisan
        $proposal->load('artisan.user');
        if ($proposal->artisan && $proposal->artisan->user) {
            \Illuminate\Support\Facades\Notification::send(
                $proposal->artisan->user,
                new \App\Notifications\ProposalAcceptedNotification($demande, $user->nomComplet)
            );
        }

        return response()->json(['message' => 'Proposal accepted successfully']);
    }
}
