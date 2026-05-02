<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use App\Models\Artisan;
use App\Models\CategorieMetier;
use App\Models\Commune;
use App\Models\ArtisanPortfolio;
use App\Models\ArtisanUnavailability;
use App\Http\Requests\Profile\UpdateProfileRequest;

// Contrôleur qui gère la consultation et la mise à jour du profil utilisateur
class ProfileController extends Controller
{
    // Retourne les informations complètes du profil de l'utilisateur connecté
    public function index()
    {
        $user = Auth::user();
        $user->load([
            'client',
            'artisan.categories',
            'artisan.wilayas',
            'artisan.commune',
            'artisan.primaryWilaya',
            'artisan.primaryCategorie',
            'artisan.abonnement',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profil récupéré avec succès',
            'data'    => $user
        ]);
    }

    // Met à jour le profil utilisateur (informations générales + profil artisan si applicable)
    public function update(UpdateProfileRequest $request)
    {
        $user = Auth::user();
        $data = $request->validated();

        // On log les données reçues pour faciliter le débogage
        Log::info('profile.update.received', [
            'user_id'      => $user->id,
            'user_type'    => $user->type,
            'payload_keys' => array_keys($data),
        ]);

        DB::transaction(function () use ($request, $user, $data) {
            // Mise à jour des champs de base communs à tous les utilisateurs
            $userUpdates = [];
            if ($request->has('nomComplet')) {
                $userUpdates['nomComplet'] = $data['nomComplet'];
            }
            if ($request->has('telephone')) {
                $userUpdates['telephone'] = $data['telephone'];
            }
            if (!empty($userUpdates)) {
                $user->update($userUpdates);
            }

            // Si ce n'est pas un artisan, on s'arrête ici
            if ($user->type !== 'artisan') {
                return;
            }

            $artisan = $user->artisan;

            // Si le profil artisan n'existe pas encore, on le crée avec des valeurs par défaut
            if (!$artisan) {
                $defaultWilayaId  = 16;
                $defaultCommuneId = Commune::where('wilaya_id', $defaultWilayaId)->value('id') ?? Commune::query()->value('id');
                $defaultCategoryId = CategorieMetier::query()->value('id');

                $artisan = Artisan::create([
                    'user_id'          => $user->id,
                    'categorie_id'     => $defaultCategoryId,
                    'wilaya_id'        => $defaultWilayaId,
                    'commune_id'       => $defaultCommuneId,
                    'statutValidation' => 'en_attente',
                    'disponibilite'    => 'indisponible',
                ]);
            }

            // On ne met à jour que les champs qui ont été envoyés dans la requête
            $artisanUpdates = [];
            foreach ([
                'description',
                'experience_level',
                'anneesExp',
                'disponibilite',
                'photo',
                'lienWhatsApp',
                'phone_visible_to_clients',
                'diploma_url',
                'artisan_card_url',
            ] as $field) {
                if ($request->has($field)) {
                    $artisanUpdates[$field] = $data[$field] ?? null;
                }
            }

            // On vérifie si la colonne existe avant de l'inclure (sécurité migration)
            if (!Schema::hasColumn('artisans', 'phone_visible_to_clients')) {
                unset($artisanUpdates['phone_visible_to_clients']);
            }

            if (!empty($artisanUpdates)) {
                $artisan->update($artisanUpdates);
            }

            // Synchronisation des catégories et génération du slug si nécessaire
            if ($request->has('categorie_ids') && !empty($data['categorie_ids'])) {
                $artisan->categories()->sync($data['categorie_ids']);
                if (!empty($data['categorie_ids'][0])) {
                    $primaryCategoryId = $data['categorie_ids'][0];
                    $category  = CategorieMetier::find($primaryCategoryId);
                    $slugBase  = Str::slug(($user->nomComplet ?? 'artisan') . '-' . ($category?->nom ?? 'expert'));
                    $artisan->update([
                        'categorie_id' => $primaryCategoryId,
                        'slug'         => $slugBase . '-' . Str::lower(Str::random(5)),
                    ]);
                }
            }

            // Synchronisation des wilayas de travail
            if ($request->has('wilaya_ids') && !empty($data['wilaya_ids'])) {
                $artisan->wilayas()->sync($data['wilaya_ids']);
                if (!empty($data['wilaya_ids'][0])) {
                    $artisan->update(['wilaya_id' => $data['wilaya_ids'][0]]);
                }
            }
        });

        $freshUser = $user->fresh()->load(['artisan.categories', 'artisan.wilayas']);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data'    => ['user' => $freshUser]
        ]);
    }

    // Bascule la disponibilité de l'artisan entre disponible et indisponible
    public function toggleAvailability()
    {
        $user    = Auth::user();
        $artisan = $user->artisan;

        $newStatut = $artisan->disponibilite === 'disponible' ? 'indisponible' : 'disponible';
        $artisan->update(['disponibilite' => $newStatut]);

        return response()->json([
            'success' => true,
            'message' => 'Statut mis à jour avec succès',
            'data'    => ['status' => $newStatut]
        ]);
    }

    // Ajoute une photo au portfolio de l'artisan (maximum 10 photos)
    public function storePortfolio(Request $request)
    {
        $user = Auth::user();
        if ($user->type !== 'artisan') return response()->json(['success' => false], 403);

        $validated = $request->validate([
            'image_url' => 'required|url',
            'public_id' => 'nullable|string',
            'caption'   => 'nullable|string|max:255',
        ]);

        $artisan = $user->artisan;

        // On limite le portfolio à 10 photos par artisan
        if ($artisan->portfolio()->count() >= 10) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez pas ajouter plus de 10 photos à votre portfolio.'
            ], 400);
        }

        $portfolio = $artisan->portfolio()->create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Photo ajoutée au portfolio.',
            'data'    => $portfolio
        ]);
    }

    // Supprime une photo du portfolio de l'artisan
    public function destroyPortfolio($id)
    {
        $user = Auth::user();
        if ($user->type !== 'artisan') return response()->json(['success' => false], 403);

        $portfolio = $user->artisan->portfolio()->find($id);

        if (!$portfolio) {
            return response()->json(['success' => false, 'message' => 'Photo introuvable.'], 404);
        }

        $portfolio->delete();

        return response()->json(['success' => true, 'message' => 'Photo supprimée.']);
    }

    // Retourne la liste des périodes d'indisponibilité de l'artisan
    public function getUnavailabilities()
    {
        $user = Auth::user();
        if ($user->type !== 'artisan') return response()->json(['success' => false], 403);

        $unavailabilities = $user->artisan->unavailabilities()
                                ->orderBy('start_date', 'asc')
                                ->get();

        return response()->json([
            'success' => true,
            'data'    => $unavailabilities
        ]);
    }

    // Ajoute une période d'indisponibilité en vérifiant qu'elle ne chevauche pas une période existante
    public function storeUnavailability(Request $request)
    {
        $user = Auth::user();
        if ($user->type !== 'artisan') return response()->json(['success' => false], 403);

        $validated = $request->validate([
            'start_date' => 'required|date|after_or_equal:today',
            'end_date'   => 'required|date|after_or_equal:start_date',
            'reason'     => 'nullable|string|max:255',
        ]);

        // Vérification des chevauchements avec les périodes déjà enregistrées
        $overlaps = $user->artisan->unavailabilities()
            ->where(function ($query) use ($validated) {
                $query->whereBetween('start_date', [$validated['start_date'], $validated['end_date']])
                      ->orWhereBetween('end_date', [$validated['start_date'], $validated['end_date']])
                      ->orWhere(function ($q) use ($validated) {
                          $q->where('start_date', '<=', $validated['start_date'])
                            ->where('end_date', '>=', $validated['end_date']);
                      });
            })->exists();

        if ($overlaps) {
            return response()->json([
                'success' => false,
                'message' => 'Cette période chevauche une indisponibilité existante.'
            ], 400);
        }

        $unavailability = $user->artisan->unavailabilities()->create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Période d\'indisponibilité ajoutée.',
            'data'    => $unavailability
        ]);
    }

    // Supprime une période d'indisponibilité
    public function destroyUnavailability($id)
    {
        $user = Auth::user();
        if ($user->type !== 'artisan') return response()->json(['success' => false], 403);

        $unavailability = $user->artisan->unavailabilities()->find($id);

        if (!$unavailability) {
            return response()->json(['success' => false, 'message' => 'Période introuvable.'], 404);
        }

        $unavailability->delete();

        return response()->json(['success' => true, 'message' => 'Période d\'indisponibilité supprimée.']);
    }
}
