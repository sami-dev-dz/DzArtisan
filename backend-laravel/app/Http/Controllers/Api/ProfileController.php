<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        if ($request->has('nomComplet')) $user->update(['nomComplet' => $data['nomComplet']]);
        if ($request->has('telephone')) $user->update(['telephone' => $data['telephone']]);

        if ($user->type === 'artisan') {
            $artisan = $user->artisan;
            $artisan->update($request->only([
                'description', 'experience_level', 'anneesExp', 
                'disponibilite', 'photo', 'lienWhatsApp', 'phone_visible_to_clients'
            ]));

            if ($request->has('categorie_ids')) {
                $artisan->categories()->sync($data['categorie_ids']);
            }
            if ($request->has('wilaya_ids')) {
                $artisan->wilayas()->sync($data['wilaya_ids']);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully', 
            'data' => ['user' => $user->load(['artisan.categories', 'artisan.wilayas'])]
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
