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

            if ($user->type !== 'client') {
                return response()->json(['success' => false, 'message' => 'Only clients can log in with Google'], 403);
            }

            Auth::login($user);
            $token = tap($user)->createToken('auth_token')->plainTextToken; // Though we use sanctum session cookie login mostly

            return response()->json([
                'success' => true,
                'message' => 'Logged in with Google successfully',
                'data' => [
                    'user' => $user->load('client'),
                    'token' => $token
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Google Login Failed: ' . $e->getMessage()], 400);
        }
    }
}
