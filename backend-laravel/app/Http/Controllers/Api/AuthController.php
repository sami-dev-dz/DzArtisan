<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Artisan;
use App\Models\Client;
use App\Models\Commune;
use App\Models\Wilaya;
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
        \Illuminate\Support\Facades\Log::info('--- TENTATIVE D\'INSCRIPTION ---', ['email' => $request->email]);
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

            // Wilaya et commune par défaut : Alger (id=16), avec fallback si les tables sont vides
            $defaultWilayaId = Wilaya::query()->value('id') ?? null;
            $defaultCommuneId = $defaultWilayaId
                ? (Commune::where('wilaya_id', $defaultWilayaId)->value('id') ?? Commune::query()->value('id'))
                : null;

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
                    $clientData = ['user_id' => $createdUser->id];
                    if ($defaultWilayaId) $clientData['wilaya_id'] = $defaultWilayaId;
                    if ($defaultCommuneId) $clientData['commune_id'] = $defaultCommuneId;
                    Client::create($clientData);
                }

                // Création du profil artisan (en attente de validation)
                if ($createdUser->type === 'artisan') {
                    $defaultCategoryId = CategorieMetier::query()->value('id');
                    $artisanData = [
                        'user_id'          => $createdUser->id,
                        'statutValidation' => 'en_attente',
                        'disponibilite'    => 'indisponible',
                    ];
                    if ($defaultCategoryId) $artisanData['categorie_id'] = $defaultCategoryId;
                    if ($defaultWilayaId) $artisanData['wilaya_id'] = $defaultWilayaId;
                    if ($defaultCommuneId) $artisanData['commune_id'] = $defaultCommuneId;
                    Artisan::create($artisanData);
                }

                return $createdUser;
            });

            // Connexion automatique après l'inscription
            Auth::login($user);

            // Déclenche l'événement d'inscription (envoi de l'email de vérification)
            // On enveloppe dans un try-catch pour que l'échec d'envoi d'email ne bloque pas l'inscription
            try {
                event(new Registered($user));
            } catch (\Throwable $mailError) {
                \Illuminate\Support\Facades\Log::warning('Email de vérification non envoyé', ['error' => $mailError->getMessage()]);
            }

            $user->load(['client', 'artisan.categories', 'artisan.wilayas', 'artisan.abonnement']);
            $user->needs_artisan_onboarding = $this->needsArtisanOnboarding($user);

            return response()->json([
                'success' => true,
                'message' => 'Compte créé avec succès',
                'data'    => ['user' => $user]
            ], 201);

        } catch (QueryException $e) {
            \Illuminate\Support\Facades\Log::error('Register QueryException', ['code' => $e->getCode(), 'msg' => $e->getMessage()]);

            // Erreur d'intégrité (doublon ou clé étrangère manquante)
            if ((string) $e->getCode() === '23000') {
                // Vérifier si c'est un vrai doublon (code MySQL 1062) ou une clé étrangère (1452)
                $mysqlCode = $e->errorInfo[1] ?? 0;

                if ($mysqlCode === 1062) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Email ou téléphone déjà utilisé.',
                        'errors' => [
                            'duplicate' => ['Cette adresse email ou ce numéro de téléphone est déjà utilisé.'],
                        ],
                    ], 409);
                }

                // Clé étrangère ou autre contrainte
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de configuration serveur. Veuillez contacter le support.',
                    'errors' => [
                        'server' => ['Données de référence manquantes (wilayas/communes). Contactez l\'administrateur.'],
                    ],
                ], 500);
            }

            throw $e;
        } catch (Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Register Throwable', ['class' => get_class($e), 'msg' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur lors de la création du compte.',
                'errors' => [
                    'server' => [$e->getMessage()],
                ],
            ], 500);
        }
    }

    // Connexion d'un utilisateur existant
    public function login(LoginRequest $request)
    {
        \Illuminate\Support\Facades\Log::info('--- TENTATIVE DE CONNEXION ---', [
            'email' => $request->email,
            'role' => $request->role,
            'ip' => $request->ip()
        ]);
        
        $user = User::where('email', $request->email)->first();
        \Illuminate\Support\Facades\Log::info('Utilisateur trouvé ?', ['found' => !!$user]);

        // Vérification du mot de passe
        if (!$user || !Hash::check($request->password, $user->password)) {
            \Illuminate\Support\Facades\Log::info('Échec mot de passe');
            return response()->json([
                'success' => false,
                'message' => 'Les identifiants fournis sont incorrects.',
                'errors' => ['email' => ['Les identifiants fournis sont incorrects.']]
            ], 422);
        }

        // Le rôle demandé doit correspondre au type du compte
        if ($request->filled('role') && $request->role !== $user->type) {
            \Illuminate\Support\Facades\Log::info('Échec rôle', ['expected' => $user->type, 'got' => $request->role]);
            return response()->json([
                'success' => false,
                'message' => 'Le rôle sélectionné ne correspond pas à ce compte.',
                'errors' => ['role' => ['Le rôle sélectionné ne correspond pas à ce compte.']]
            ], 422);
        }

        \Illuminate\Support\Facades\Log::info('Authentification en cours...');
        Auth::login($user);
        
        \Illuminate\Support\Facades\Log::info('Chargement des relations...');
        $user->load(['client', 'artisan.categories', 'artisan.wilayas', 'artisan.abonnement']);
        
        \Illuminate\Support\Facades\Log::info('Calcul onboarding...');
        $user->needs_artisan_onboarding = $this->needsArtisanOnboarding($user);

        \Illuminate\Support\Facades\Log::info('Login terminé avec succès');

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
