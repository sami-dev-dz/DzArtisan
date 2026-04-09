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
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use Throwable;

class AuthController extends Controller
{
    /**
     * Inscription
     */
    public function register(RegisterRequest $request)
    {
        try {
            if ($request->type === 'artisan' && !CategorieMetier::query()->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Aucune catégorie métier n\'est disponible pour créer un compte artisan.',
                    'errors' => [
                        'type' => ['Aucune catégorie métier n\'est disponible pour créer un compte artisan.'],
                    ],
                ], 422);
            }

            $duplicateErrors = [];
            if (User::query()->where('email', $request->email)->exists()) {
                $duplicateErrors['email'] = ['Cette adresse email est déjà enregistrée.'];
            }
            if (User::query()->where('telephone', $request->telephone)->exists()) {
                $duplicateErrors['telephone'] = ['Ce numéro de téléphone est déjà associé à un compte.'];
            }

            if (!empty($duplicateErrors)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email ou téléphone déjà utilisé.',
                    'errors' => $duplicateErrors,
                ], 409);
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
                    ]);
                }

                if ($createdUser->type === 'artisan') {
                    $defaultCategoryId = CategorieMetier::query()->value('id');
                    Artisan::create([
                        'user_id' => $createdUser->id,
                        'categorie_id' => $defaultCategoryId,
                        'wilaya_id' => $defaultWilayaId,
                        'commune_id' => $defaultCommuneId,
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
        } catch (QueryException $e) {
            // Race condition safe-guard on DB unique constraints.
            if ((string) $e->getCode() === '23000') {
                return response()->json([
                    'success' => false,
                    'message' => 'Email ou téléphone déjà utilisé.',
                    'errors' => [
                        'duplicate' => ['Cette adresse email ou ce numéro de téléphone est déjà utilisé.'],
                    ],
                ], 409);
            }

            throw $e;
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur lors de la création du compte.',
                'errors' => [
                    'server' => ['Veuillez réessayer dans quelques instants.'],
                ],
            ], 500);
        }
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
