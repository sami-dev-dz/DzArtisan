<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Client;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
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

                $user = User::create([
                    'nomComplet' => $googleUser->getName(),
                    'email'      => $googleUser->getEmail(),
                    'password'   => bcrypt(Str::random(16)), 
                    'type'       => 'client',
                    'statut'     => 'actif',
                ]);

                Client::create([
                    'user_id' => $user->id,
                    'typeAuth' => 'google',
                    'googleId' => $googleUser->getId(),
                    'wilaya_id' => 16,
                    'commune_id' => 1601,
                ]);
            }

            $token = $user->createToken('google_token')->plainTextToken;

            Log::info('Google OAuth success for user: ' . $user->email . ', token prefix: ' . substr($token, 0, 10));

            return redirect(env('FRONTEND_URL') . '/google/callback?token=' . urlencode($token));
        } catch (\Exception $e) {
            Log::error('Google OAuth Error: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return redirect(env('FRONTEND_URL') . '/login?error=google_failed');
        }
    }

    public function syncSession(Request $request)
    {
        try {
            $tokenRaw = $request->query('token');
            Log::info('sync-session called, token prefix: ' . substr($tokenRaw ?? '', 0, 10) . '...');

            $token = \Laravel\Sanctum\PersonalAccessToken::findToken($tokenRaw);

            if (!$token || !$token->tokenable) {
                Log::warning('Token invalide ou déjà consommé');
                return response()->json(['success' => false, 'message' => 'Token invalid or expired'], 401);
            }

            $user = $token->tokenable;

            Auth::guard('web')->login($user);
            $request->session()->regenerate();

            Log::info('sync-session success for user: ' . $user->email);

            $token->delete();

            $user->load(['client', 'artisan.categories', 'artisan.wilayas']);

            return response()->json([
                'success' => true,
                'user' => $user
            ]);
        } catch (\Exception $e) {
            Log::error('Sync session error: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json(['success' => false, 'message' => 'Internal error: ' . $e->getMessage()], 500);
        }
    }
}

