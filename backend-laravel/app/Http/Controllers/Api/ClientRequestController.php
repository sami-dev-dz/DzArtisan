<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DemandeIntervention;
use App\Models\DemandeProposition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClientRequestController extends Controller
{
    /**
     * Display a listing of the client's requests.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $client = $user->client;

        if (!$client) {
            return response()->json(['message' => 'Client profile not found'], 404);
        }

        $query = DemandeIntervention::where('client_id', $client->id)
            ->with(['categorie', 'wilaya', 'commune'])
            ->withCount('propositions');

        $status = $request->query('status');

        if ($status === 'active') {
            $query->whereIn('statut', ['en_attente', 'acceptee']);
        } elseif ($status === 'archived') {
            $query->whereIn('statut', ['terminee', 'annulee']);
        }

        $requests = $query->orderBy('created_at', 'desc')->get();

        return response()->json($requests);
    }

    /**
     * Display the specified request with its proposals.
     */
    public function show($id)
    {
        $user = Auth::user();
        $client = $user->client;

        $demande = DemandeIntervention::where('id', $id)
            ->where('client_id', $client->id)
            ->with([
                'categorie', 
                'wilaya', 
                'commune', 
                'photos', 
                'propositions.artisan.user',
                'propositions.artisan' => function($q) {
                    $q->withCount(['avis as average_rating' => function($query) {
                        $query->select(\DB::raw('coalesce(avg(note), 0)'));
                    }]);
                }
            ])
            ->firstOrFail();

        return response()->json($demande);
    }

    /**
     * Cancel a pending request.
     */
    public function cancel($id)
    {
        $user = Auth::user();
        $client = $user->client;

        $demande = DemandeIntervention::where('id', $id)
            ->where('client_id', $client->id)
            ->where('statut', 'en_attente')
            ->firstOrFail();

        $demande->update(['statut' => 'annulee']);

        return response()->json(['message' => 'Request cancelled successfully']);
    }

    /**
     * Accept an artisan's proposal.
     */
    public function acceptProposal(Request $request, $id, $proposalId)
    {
        $user = Auth::user();
        $client = $user->client;

        $demande = DemandeIntervention::where('id', $id)
            ->where('client_id', $client->id)
            ->where('statut', 'en_attente')
            ->firstOrFail();

        $proposal = DemandeProposition::where('id', $proposalId)
            ->where('demande_id', $id)
            ->firstOrFail();

        // Transaction to ensure atomicity
        \DB::transaction(function () use ($demande, $proposal) {
            $demande->update([
                'statut' => 'acceptee',
                'artisan_id' => $proposal->artisan_id
            ]);

            $proposal->update(['statut' => 'acceptee']);
            
            // Reject other proposals
            DemandeProposition::where('demande_id', $demande->id)
                ->where('id', '!=', $proposal->id)
                ->update(['statut' => 'rejetee']);
        });

        return response()->json(['message' => 'Proposal accepted successfully']);
    }
}
