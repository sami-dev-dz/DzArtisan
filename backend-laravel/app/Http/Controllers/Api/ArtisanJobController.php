<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DemandeIntervention;
use App\Models\DemandeProposition;
use App\Notifications\NewProposalNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ArtisanJobController extends Controller
{

    public function index(Request $request)
    {
        $user    = Auth::user();
        $artisan = $user->artisan;

        if (!$artisan) {
            return response()->json(['message' => 'Profil artisan introuvable.'], 404);
        }

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
            return response()->json(['data' => [], 'message' => 'Veuillez compléter votre profil (catégories et wilayas).']);
        }

        $jobs = DemandeIntervention::whereIn('categorie_id', $categoryIds)
            ->whereIn('wilaya_id', $wilayaIds)
            ->where('statut', 'en_attente')
            ->with(['categorie:id,nom,icone', 'wilaya:id,nom', 'commune:id,nom', 'photos'])
            ->withCount('propositions')

            ->whereDoesntHave('propositions', function ($q) use ($artisan) {
                $q->where('artisan_id', $artisan->id);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($jobs);
    }

    public function show($id)
    {
        $artisan = Auth::user()->artisan;

        if (!$artisan) {
            return response()->json(['message' => 'Profil artisan introuvable.'], 404);
        }

        $job = DemandeIntervention::with([
            'categorie:id,nom,icone',
            'wilaya:id,nom',
            'commune:id,nom',
            'photos',
        ])
        ->withCount('propositions')
        ->findOrFail($id);

        $hasApplied = DemandeProposition::where('demande_id', $id)
            ->where('artisan_id', $artisan->id)
            ->exists();

        return response()->json([
            'job'        => $job,
            'has_applied' => $hasApplied,
        ]);
    }

    public function applied()
    {
        $user    = Auth::user();
        $artisan = $user->artisan;

        if (!$artisan) {
            return response()->json(['message' => 'Profil artisan introuvable.'], 404);
        }

        $proposals = DemandeProposition::where('artisan_id', $artisan->id)
            ->with([
                'demande.categorie:id,nom,icone',
                'demande.wilaya:id,nom',
                'demande.commune:id,nom',
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($proposals);
    }

    public function store(Request $request)
    {
        $user    = Auth::user();
        $artisan = $user->artisan;

        if (!$artisan) {
            return response()->json(['message' => 'Profil artisan introuvable.'], 404);
        }

        if (!$artisan->abonnement?->is_premium) {
            return response()->json([
                'message' => 'L\'accès aux propositions nécessite un Abonnement Premium. Veuillez mettre à niveau votre plan.',
            ], 403);
        }

        $validated = $request->validate([
            'demande_id'    => 'required|exists:demandes_interventions,id',
            'message'       => 'nullable|string|max:1000',
            'tarif_propose' => 'nullable|numeric|min:0',
        ]);

        $demande = DemandeIntervention::with('client.user')->findOrFail($validated['demande_id']);

        if ($demande->statut !== 'en_attente') {
            return response()->json([
                'message' => 'Cette demande n\'accepte plus de propositions.',
            ], 422);
        }

        if (DemandeProposition::where('demande_id', $demande->id)->where('artisan_id', $artisan->id)->exists()) {
            return response()->json([
                'message' => 'Vous avez déjà soumis une proposition pour cette demande.',
            ], 422);
        }

        $proposal = DB::transaction(function () use ($demande, $artisan, $validated) {
            $p = DemandeProposition::create([
                'demande_id'    => $demande->id,
                'artisan_id'    => $artisan->id,
                'message'       => $validated['message'] ?? null,
                'tarif_propose' => $validated['tarif_propose'] ?? null,
                'statut'        => 'en_attente',
            ]);

            if ($demande->client?->user) {
                try {
                    $demande->client->user->notify(new NewProposalNotification($demande, $artisan));
                } catch (\Exception $e) {

                    \Log::warning('Proposal notification failed: ' . $e->getMessage());
                }
            }

            return $p;
        });

        return response()->json($proposal->load(['artisan.user', 'demande']), 201);
    }

    public function withdraw($id)
    {
        $user    = Auth::user();
        $artisan = $user->artisan;

        if (!$artisan) {
            return response()->json(['message' => 'Profil artisan introuvable.'], 404);
        }

        $proposal = DemandeProposition::where('id', $id)
            ->where('artisan_id', $artisan->id)
            ->firstOrFail();

        if ($proposal->statut !== 'en_attente') {
            return response()->json([
                'message' => 'Impossible de retirer une proposition déjà acceptée ou rejetée.',
            ], 422);
        }

        $proposal->delete();

        return response()->json(['message' => 'Votre proposition a été retirée avec succès.']);
    }
}
