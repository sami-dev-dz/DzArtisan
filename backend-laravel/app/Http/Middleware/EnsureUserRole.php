<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Authentification requise.',
            ], 401);
        }

        if (empty($roles) || in_array($user->type, $roles, true)) {
            return $next($request);
        }

        return response()->json([
            'success' => false,
            'message' => 'Accès refusé: rôle incompatible pour cette ressource.',
            'errors' => [
                'role' => ['Le rôle sélectionné ne permet pas cet accès.'],
            ],
        ], 403);
    }
}
