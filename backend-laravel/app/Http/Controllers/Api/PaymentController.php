<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    /**
     * Start the checkout process with Chargily.
     */
    public function checkout(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'plan_id' => 'required|in:monthly,quarterly,yearly',
        ]);

        // Mocking the Chargily Redirect URL for now
        // In production: Integration with Chargily PHP SDK
        $redirectUrl = "https://checkout.chargily.com/test-payment-link";

        return response()->json([
            'checkout_url' => $redirectUrl,
            'message' => 'Redirection vers Chargily sécurisé...'
        ]);
    }

    /**
     * Webhook to receive payment confirmation from Chargily.
     */
    public function webhook(Request $request)
    {
        // Logic to verify signature and update user subscription status
        // For now: Log the hit
        \Log::info('Payment Webhook received', $request->all());

        return response()->json(['status' => 'ok']);
    }
}

