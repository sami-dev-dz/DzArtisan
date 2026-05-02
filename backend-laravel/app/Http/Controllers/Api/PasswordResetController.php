<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;

// Contrôleur qui gère la réinitialisation du mot de passe par email
class PasswordResetController extends Controller
{
    // Envoie un lien de réinitialisation à l'adresse email fournie
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        // Laravel gère l'envoi de l'email via le broker de mot de passe
        $status = Password::broker()->sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
                    ? response()->json(['success' => true, 'message' => __($status)])
                    : response()->json(['success' => false, 'message' => __($status)], 400);
    }

    // Réinitialise le mot de passe à partir du token reçu par email
    public function reset(Request $request)
    {
        $request->validate([
            'token'    => 'required',
            'email'    => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::broker()->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                // On met à jour le mot de passe et on régénère le token de session
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        return $status === Password::PASSWORD_RESET
                    ? response()->json(['success' => true, 'message' => __($status)])
                    : response()->json(['success' => false, 'message' => __($status)], 400);
    }
}
