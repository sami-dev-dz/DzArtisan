<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\URL;
use Carbon\Carbon;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function ($notifiable, $token) {
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            return $frontendUrl . '/reset-password?token=' . $token . '&email=' . $notifiable->getEmailForPasswordReset();
        });

        VerifyEmail::createUrlUsing(function ($notifiable) {
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');

            $verifyUrl = URL::temporarySignedRoute(
                'verification.verify',
                Carbon::now()->addMinutes(config('auth.verification.expire', 60)),
                [
                    'id' => $notifiable->getKey(),
                    'hash' => sha1($notifiable->getEmailForVerification()),
                ]
            );

            // On extrait les query params (expires, signature) générés par Laravel
            $parsedUrl = parse_url($verifyUrl);
            $query = $parsedUrl['query'] ?? '';

            return $frontendUrl . '/verify-email?id=' . $notifiable->getKey() . '&hash=' . sha1($notifiable->getEmailForVerification()) . '&' . $query;
        });
    }
}
