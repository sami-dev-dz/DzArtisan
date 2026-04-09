<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CloudinaryController extends Controller
{
    public function signUpload(Request $request)
    {
        $validated = $request->validate([
            'resource_type' => 'nullable|in:image,raw,video,auto',
            'folder' => 'nullable|string|max:255',
        ]);

        $cloudName = (string) env('CLOUDINARY_CLOUD_NAME');
        $apiKey = (string) env('CLOUDINARY_API_KEY');
        $apiSecret = (string) env('CLOUDINARY_API_SECRET');

        if (!$cloudName || !$apiKey || !$apiSecret) {
            return response()->json([
                'success' => false,
                'message' => 'Cloudinary n\'est pas configuré côté serveur.',
            ], 500);
        }

        $timestamp = time();
        $folder = $validated['folder'] ?? 'dzartisan/profiles';

        $signaturePayload = "folder={$folder}&timestamp={$timestamp}{$apiSecret}";
        $signature = sha1($signaturePayload);

        return response()->json([
            'success' => true,
            'data' => [
                'cloud_name' => $cloudName,
                'api_key' => $apiKey,
                'timestamp' => $timestamp,
                'folder' => $folder,
                'signature' => $signature,
                'resource_type' => $validated['resource_type'] ?? 'image',
            ],
        ]);
    }
}
