<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $user = User::create([
            'nomComplet' => $request->name,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'telephone'  => $request->telephone,
            'type'       => $request->type ?? 'client',
            'statut'     => 'actif',
        ]);

        // Connexion automatique après inscription
        Auth::login($user);

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

        Auth::login($user);

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
        return response()->json([
            'success' => true,
            'message' => 'Profil récupéré avec succès',
            'data'    => ['user' => $request->user()]
        ]);
    }
}
