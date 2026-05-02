<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use App\Models\User;

class VerifyEmailController extends Controller
{
    public function sendVerificationEmail(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['success' => true, 'message' => 'Email déjà vérifié.']);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json(['success' => true, 'message' => 'Lien de vérification envoyé.']);
    }

    public function verify(Request $request, $id, $hash)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Utilisateur introuvable.'], 404);
        }

        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json(['success' => false, 'message' => 'Lien de vérification invalide.'], 400);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['success' => true, 'message' => 'Email déjà vérifié.']);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return response()->json(['success' => true, 'message' => 'Email vérifié avec succès.']);
    }
}
