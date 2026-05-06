<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => 'DzArtisan API',
        'status' => 'Connected',
        'url_vercel' => 'https://dzArtisan.vercel.app'
    ]);
});