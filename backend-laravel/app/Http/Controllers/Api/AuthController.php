<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Artisan;
use App\Models\Client;
use App\Models\Commune;
use App\Models\CategorieMetier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;

class AuthController extends Controller
{
    /**
     * Inscription
     */
    public function register(RegisterRequest $request)
    {
        if ($request->type === 'artisan' && !CategorieMetier::query()->exists()) {
            throw ValidationException::withMessages([
                'type' => ['Aucune catégorie métier n\'est disponible pour créer un compte artisan.'],
            ]);
        }

        $defaultWilayaId = 16;
        $defaultCommuneId = Commune::where('wilaya_id', $defaultWilayaId)->value('id') ?? Commune::query()->value('id');

        $user = DB::transaction(function () use ($request, $defaultWilayaId, $defaultCommuneId) {
            $createdUser = User::create([
                'nomComplet' => $request->name,
                'email'      => $request->email,
                'password'   => Hash::make($request->password),
                'telephone'  => $request->telephone,
                'type'       => $request->type ?? 'client',
                'statut'     => 'actif',
            ]);

            if ($createdUser->type === 'client') {
                Client::create([
                    'user_id' => $createdUser->id,
                    'wilaya_id' => $defaultWilayaId,
                    'commune_id' => $defaultCommuneId,
                    'telephone' => $request->telephone,
                ]);
            }

            if ($createdUser->type === 'artisan') {
                $defaultCategoryId = CategorieMetier::query()->value('id');
                Artisan::create([
                    'user_id' => $createdUser->id,
                    'categorie_id' => $defaultCategoryId,
                    'wilaya_id' => $defaultWilayaId,
                    'commune_id' => $defaultCommuneId,
                    'telephone' => $request->telephone,
                    'statutValidation' => 'en_attente',
                    'disponibilite' => 'indisponible',
                ]);
            }

            return $createdUser;
        });

        // Connexion automatique après inscription
        Auth::login($user);
        $user->load(['client', 'artisan.categories', 'artisan.wilayas']);
        $user->needs_artisan_onboarding = $this->needsArtisanOnboarding($user);

        return response()->json([
            'success' => true,
            'message' => 'Compte créé avec succès',
            'data'    => ['user' => $user]
        ], 201);
    }

    /**
     * Connexion
     */
    public function login(LoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        if ($request->filled('role') && $request->role !== $user->type) {
            throw ValidationException::withMessages([
                'role' => ['Le rôle sélectionné ne correspond pas à ce compte.'],
            ]);
        }

        Auth::login($user);
        $user->load(['client', 'artisan.categories', 'artisan.wilayas']);
        $user->needs_artisan_onboarding = $this->needsArtisanOnboarding($user);

        return response()->json([
            'success' => true,
            'message' => 'Connecté avec succès',
            'data'    => ['user' => $user]
        ]);
    }

    /**
     * Déconnexion
     */
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Déconnecté avec succès',
            'data'    => null
        ]);
    }

    /**
     * Utilisateur actuel
     */
    public function me(Request $request)
    {
        $user = $request->user()->load(['client', 'artisan.categories', 'artisan.wilayas']);
        $user->needs_artisan_onboarding = $this->needsArtisanOnboarding($user);

        return response()->json([
            'success' => true,
            'message' => 'Profil récupéré avec succès',
            'data'    => ['user' => $user]
        ]);
    }

    private function needsArtisanOnboarding(User $user): bool
    {
        if ($user->type !== 'artisan') {
            return false;
        }

        $artisan = $user->artisan;
        if (!$artisan) {
            return true;
        }

        $hasCore = !empty($user->nomComplet)
            && !empty($user->telephone)
            && !empty($artisan->lienWhatsApp)
            && !empty($artisan->experience_level)
            && !empty($artisan->description)
            && strlen($artisan->description) >= 20
            && $artisan->categories()->exists()
            && $artisan->wilayas()->exists()
            && !empty($artisan->anneesExp);

        return !$hasCore;
    }
}
