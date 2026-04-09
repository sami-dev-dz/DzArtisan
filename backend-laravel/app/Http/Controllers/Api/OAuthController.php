<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Client;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class OAuthController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::where('email', $googleUser->getEmail())->first();

            if (!$user) {
                // Registering Client via Google
                $user = User::create([
                    'nomComplet' => $googleUser->getName(),
                    'email'      => $googleUser->getEmail(),
                    'password'   => bcrypt(Str::random(16)), // Dummy password
                    'type'       => 'client',
                    'statut'     => 'actif',
                ]);

                // Create client profile using default wilaya and commune for now
                // In a real scenario, they would complete their profile later
                Client::create([
                    'user_id' => $user->id,
                    'typeAuth' => 'google',
                    'googleId' => $googleUser->getId(),
                    'wilaya_id' => 16, // Default to Alger
                    'commune_id' => 1601, // Default Alger centre
                ]);
            }

            Auth::login($user);
            $token = urlencode($user->createToken('google_token')->plainTextToken);

            // Redirect to the dedicated callback page on the frontend
            return redirect(env('FRONTEND_URL') . '/google/callback?token=' . $token);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Google OAuth Error: ' . $e->getMessage());
            return redirect(env('FRONTEND_URL') . '/login?error=google_failed');
        }
    }

    public function syncSession(Request $request)
    {
        $tokenRaw = $request->query('token');
        \Illuminate\Support\Facades\Log::info('Tentative de sync session avec le token: ' . substr($tokenRaw, 0, 10) . '...');
        
        // On cherche le token dans la DB
        $token = \Laravel\Sanctum\PersonalAccessToken::findToken($tokenRaw);
        
        if (!$token || !$token->tokenable) {
            return response()->json(['success' => false], 401);
        }

        $user = $token->tokenable;
        Auth::guard('web')->login($user);
        
        // On supprime ce token temporaire
        $token->delete();

        return response()->json([
            'success' => true,
            'user' => $user->load(['client', 'artisan.categories', 'artisan.wilayas'])
        ]);
    }
}
