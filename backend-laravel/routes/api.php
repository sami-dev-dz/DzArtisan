<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\InterventionController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\AvisController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AdminArtisanController;
use App\Http\Controllers\Api\AdminStatsController;
use App\Http\Controllers\Api\ClientRequestController;
use App\Http\Controllers\Api\ArtisanJobController;
use App\Http\Controllers\Api\ArtisanStatsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    
    // Auth Group
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);

        // Google OAuth Routes
        Route::get('/google/redirect', [\App\Http\Controllers\Api\OAuthController::class, 'redirectToGoogle']);
        Route::get('/google/callback', [\App\Http\Controllers\Api\OAuthController::class, 'handleGoogleCallback']);

        Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
        Route::get('/me', function (Request $request) {
            return response()->json([
                'success' => true,
                'data' => $request->user()->load(['artisan', 'client'])
            ]);
        })->middleware('auth:sanctum');
    });

    // Données publiques
    Route::get('/wilayas', [PublicController::class, 'getWilayas']);
    Route::get('/communes/{wilayaId}', [PublicController::class, 'getCommunes']);
    Route::get('/categories', [PublicController::class, 'getMetiers']);
    Route::get('/artisans', [PublicController::class, 'getArtisans']);
    Route::get('/artisans/slug/{slug}', [PublicController::class, 'getArtisanBySlug']);
    Route::post('/artisans/{id}/log-contact', [ArtisanStatsController::class, 'logContact']);
    Route::get('/artisans/{id}/response-rate', [ArtisanStatsController::class, 'getResponseRate']);


    // Routes protégées
    Route::middleware('auth:sanctum')->group(function () {
        // Notifications
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

        // Profile
        Route::get('/profile', [ProfileController::class, 'index']);
        Route::post('/profile', [ProfileController::class, 'update']);
        Route::post('/profile/toggle-availability', [ProfileController::class, 'toggleAvailability']);

        // Dashboard
        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
        Route::get('/dashboard/matching-requests', [DashboardController::class, 'matchingRequests']);
        
        // Subscription & Payments
        Route::get('/subscription/status', [SubscriptionController::class, 'status']);
        Route::get('/subscription/plans', [SubscriptionController::class, 'index']);
        Route::post('/subscribe', [SubscriptionController::class, 'subscribe']);
        Route::post('/payments/proof', [SubscriptionController::class, 'uploadProof']);
        Route::get('/payments/history', [SubscriptionController::class, 'history']);

        Route::get('/interventions', [InterventionController::class, 'index']);
        Route::post('/interventions', [InterventionController::class, 'store']);
        Route::post('/interventions/{id}/cancel', [InterventionController::class, 'cancel']);
        Route::post('/interventions/{id}/avis', [AvisController::class, 'store']);

        // Artisan Dashboard: Jobs
        Route::get('/artisan/jobs', [ArtisanJobController::class, 'index']);
        Route::get('/artisan/jobs/applied', [ArtisanJobController::class, 'applied']);
        Route::post('/artisan/jobs/proposal', [ArtisanJobController::class, 'store']);

        // Artisan Dashboard: Interventions (Active Projects)
        Route::get('/artisan/interventions', [InterventionController::class, 'index']);
        Route::get('/artisan/interventions/{id}', [InterventionController::class, 'show']);
        Route::post('/artisan/interventions/{id}/progress', [InterventionController::class, 'updateProgress']);
        Route::post('/artisan/interventions/{id}/photo', [InterventionController::class, 'uploadPhoto']);
        Route::delete('/artisan/interventions/{id}/photo/{photoId}', [InterventionController::class, 'deletePhoto']);

        // Admin Dashboard
        Route::prefix('admin')->group(function () {
            // Stats Overview (New)
            Route::get('/stats/overview', [AdminStatsController::class, 'index']);
            Route::get('/stats/rankings', [AdminStatsController::class, 'artisanRanking']);
            Route::get('/stats/export', [AdminStatsController::class, 'exportCSV']);

            // Artisan Management (Corrected to use AdminController)
            Route::get('/artisans', [AdminController::class, 'indexArtisans']);
            Route::post('/artisans/{id}/status', [AdminController::class, 'updateArtisanStatus']);
            Route::post('/artisans/{id}/promote', [AdminController::class, 'promoteArtisan']);
            Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);

            // Client Dashboard: Requests
            Route::get('/client/requests', [ClientRequestController::class, 'index']);
            Route::get('/client/requests/{id}', [ClientRequestController::class, 'show']);
            Route::post('/client/requests/{id}/cancel', [ClientRequestController::class, 'cancel']);
            Route::post('/client/requests/{id}/proposals/{proposalId}/accept', [ClientRequestController::class, 'acceptProposal']);
            Route::post('/users/{id}/delete', [AdminController::class, 'deleteUser']);
            Route::post('/users/bulk', [AdminController::class, 'bulkAction']);

            // Subscription Management
            Route::get('/subscriptions', [\App\Http\Controllers\Api\AdminSubscriptionController::class, 'index']);
            Route::get('/subscriptions/pending', [\App\Http\Controllers\Api\AdminSubscriptionController::class, 'pending']);
            Route::post('/subscriptions/confirm/{id}', [\App\Http\Controllers\Api\AdminSubscriptionController::class, 'confirm']);
            Route::post('/subscriptions/reject/{id}', [\App\Http\Controllers\Api\AdminSubscriptionController::class, 'reject']);
            Route::get('/subscriptions/manual', [\App\Http\Controllers\Api\AdminSubscriptionController::class, 'manualActivate']);
            Route::get('/artisans/{id}/subscriptions', [\App\Http\Controllers\Api\AdminSubscriptionController::class, 'artisanHistory']);

            // Complaints Management
            Route::get('/complaints', [\App\Http\Controllers\Admin\AdminComplaintController::class, 'index']);
            Route::get('/complaints/{reclamation}', [\App\Http\Controllers\Admin\AdminComplaintController::class, 'show']);
            Route::post('/complaints/{reclamation}/status', [\App\Http\Controllers\Admin\AdminComplaintController::class, 'updateStatus']);
            Route::post('/complaints/{reclamation}/note', [\App\Http\Controllers\Admin\AdminComplaintController::class, 'addNote']);
            Route::post('/complaints/{reclamation}/warn', [\App\Http\Controllers\Admin\AdminComplaintController::class, 'warn']);
            Route::post('/complaints/{reclamation}/suspend', [\App\Http\Controllers\Admin\AdminComplaintController::class, 'suspend']);
        });

    });
});


