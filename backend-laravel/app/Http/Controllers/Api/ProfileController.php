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
use App\Http\Requests\Profile\UpdateProfileRequest;

class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $user->load(['client', 'artisan.categories', 'artisan.wilayas', 'artisan.commune']);
        
        return response()->json([
            'success' => true,
            'message' => 'Profil récupéré avec succès',
            'data' => $user
        ]);
    }


    public function update(UpdateProfileRequest $request)
    {
        $user = Auth::user();
        $data = $request->validated();

        Log::info('profile.update.received', [
            'user_id' => $user->id,
            'user_type' => $user->type,
            'payload_keys' => array_keys($data),
        ]);

        DB::transaction(function () use ($request, $user, $data) {
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

            if ($user->type !== 'artisan') {
                return;
            }

            $artisan = $user->artisan;
            if (!$artisan) {
                $defaultWilayaId = 16;
                $defaultCommuneId = Commune::where('wilaya_id', $defaultWilayaId)->value('id') ?? Commune::query()->value('id');
                $defaultCategoryId = CategorieMetier::query()->value('id');

                $artisan = Artisan::create([
                    'user_id' => $user->id,
                    'categorie_id' => $defaultCategoryId,
                    'wilaya_id' => $defaultWilayaId,
                    'commune_id' => $defaultCommuneId,
                    'statutValidation' => 'en_attente',
                    'disponibilite' => 'indisponible',
                ]);
            }

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

            if (!Schema::hasColumn('artisans', 'phone_visible_to_clients')) {
                unset($artisanUpdates['phone_visible_to_clients']);
            }

            if (!empty($artisanUpdates)) {
                $artisan->update($artisanUpdates);
            }

            if ($request->has('categorie_ids') && !empty($data['categorie_ids'])) {
                $artisan->categories()->sync($data['categorie_ids']);
                if (!empty($data['categorie_ids'][0])) {
                    $primaryCategoryId = $data['categorie_ids'][0];
                    $category = CategorieMetier::find($primaryCategoryId);
                    $slugBase = Str::slug(($user->nomComplet ?? 'artisan') . '-' . ($category?->nom ?? 'expert'));
                    $artisan->update([
                        'categorie_id' => $primaryCategoryId,
                        'slug' => $slugBase . '-' . Str::lower(Str::random(5)),
                    ]);
                }
            }
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
            'data' => ['user' => $freshUser]
        ]);
    }

    public function toggleAvailability()
    {
        $user = Auth::user();
        $artisan = $user->artisan;
        
        $newStatut = $artisan->disponibilite === 'disponible' ? 'indisponible' : 'disponible';
        $artisan->update(['disponibilite' => $newStatut]);
        
        return response()->json([
            'success' => true,
            'message' => 'Statut mis à jour avec succès',
            'data' => ['status' => $newStatut]
        ]);
    }
}
