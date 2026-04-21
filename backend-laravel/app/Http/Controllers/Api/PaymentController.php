<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{

    public function checkout(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'plan_id' => 'required|in:monthly,quarterly,yearly',
        ]);

        $redirectUrl = "https://checkout.chargily.com/test-payment-link";

        return response()->json([
            'checkout_url' => $redirectUrl,
            'message' => 'Redirection vers Chargily sécurisé...'
        ]);
    }

    public function webhook(Request $request)
    {

        \Log::info('Payment Webhook received', $request->all());

        return response()->json(['status' => 'ok']);
    }
}

