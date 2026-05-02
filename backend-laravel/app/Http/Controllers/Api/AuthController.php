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
use Illuminate\Auth\Events\Registered;
use Throwable;

// Contrôleur qui gère l'authentification des utilisateurs (inscription, connexion, déconnexion)
class AuthController extends Controller
{

    // Inscription d'un nouvel utilisateur (client ou artisan)
    public function register(RegisterRequest $request)
    {
        try {
            // On vérifie qu'il existe au moins une catégorie de métier avant de créer un artisan
            if ($request->type === 'artisan' && !CategorieMetier::query()->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Aucune catégorie métier n\'est disponible pour créer un compte artisan.',
                    'errors' => [
                        'type' => ['Aucune catégorie métier n\'est disponible pour créer un compte artisan.'],
                    ],
                ], 422);
            }

            // Vérification des doublons avant d'insérer dans la base
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

            // Wilaya et commune par défaut : Alger (id=16)
            $defaultWilayaId = 16;
            $defaultCommuneId = Commune::where('wilaya_id', $defaultWilayaId)->value('id') ?? Commune::query()->value('id');

            // On utilise une transaction pour que l'utilisateur et son profil soient créés ensemble
            $user = DB::transaction(function () use ($request, $defaultWilayaId, $defaultCommuneId) {
                $createdUser = User::create([
                    'nomComplet' => $request->name,
                    'email'      => $request->email,
                    'password'   => Hash::make($request->password),
                    'telephone'  => $request->telephone,
                    'type'       => $request->type ?? 'client',
                    'statut'     => 'actif',
                ]);

                // Création du profil client
                if ($createdUser->type === 'client') {
                    Client::create([
                        'user_id'    => $createdUser->id,
                        'wilaya_id'  => $defaultWilayaId,
                        'commune_id' => $defaultCommuneId,
                    ]);
                }

                // Création du profil artisan (en attente de validation)
                if ($createdUser->type === 'artisan') {
                    $defaultCategoryId = CategorieMetier::query()->value('id');
                    Artisan::create([
                        'user_id'          => $createdUser->id,
                        'categorie_id'     => $defaultCategoryId,
                        'wilaya_id'        => $defaultWilayaId,
                        'commune_id'       => $defaultCommuneId,
                        'statutValidation' => 'en_attente',
                        'disponibilite'    => 'indisponible',
                    ]);
                }

                return $createdUser;
            });

            // Connexion automatique après l'inscription
            Auth::login($user);

            // Déclenche l'événement d'inscription (envoi de l'email de vérification)
            event(new Registered($user));

            $user->load(['client', 'artisan.categories', 'artisan.wilayas', 'artisan.abonnement']);
            $user->needs_artisan_onboarding = $this->needsArtisanOnboarding($user);

            return response()->json([
                'success' => true,
                'message' => 'Compte créé avec succès',
                'data'    => ['user' => $user]
            ], 201);

        } catch (QueryException $e) {
            // Erreur de doublon au niveau de la base de données
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

    // Connexion d'un utilisateur existant
    public function login(LoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        // Vérification du mot de passe
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        // Le rôle demandé doit correspondre au type du compte
        if ($request->filled('role') && $request->role !== $user->type) {
            throw ValidationException::withMessages([
                'role' => ['Le rôle sélectionné ne correspond pas à ce compte.'],
            ]);
        }

        Auth::login($user);
        $user->load(['client', 'artisan.categories', 'artisan.wilayas', 'artisan.abonnement']);
        $user->needs_artisan_onboarding = $this->needsArtisanOnboarding($user);

        return response()->json([
            'success' => true,
            'message' => 'Connecté avec succès',
            'data'    => ['user' => $user]
        ]);
    }

    // Déconnexion et destruction de la session
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

    // Retourne les infos de l'utilisateur connecté
    public function me(Request $request)
    {
        $user = $request->user()->load(['client', 'artisan.categories', 'artisan.wilayas', 'artisan.abonnement']);
        $user->needs_artisan_onboarding = $this->needsArtisanOnboarding($user);

        return response()->json([
            'success' => true,
            'message' => 'Profil récupéré avec succès',
            'data'    => ['user' => $user]
        ]);
    }

    // Vérifie si un artisan doit compléter son profil avant d'utiliser la plateforme
    private function needsArtisanOnboarding(User $user): bool
    {
        if ($user->type !== 'artisan') {
            return false;
        }

        $artisan = $user->artisan;
        if (!$artisan) {
            return true;
        }

        // On s'assure que tous les champs importants sont bien remplis
        $hasCore = !empty($user->nomComplet)
            && !empty($user->telephone)
            && !empty($artisan->lienWhatsApp)
            && !empty($artisan->experience_level)
            && !empty($artisan->description)
            && strlen($artisan->description) >= 20
            && $artisan->categories()->exists()
            && $artisan->wilayas()->exists();

        return !$hasCore;
    }
}
