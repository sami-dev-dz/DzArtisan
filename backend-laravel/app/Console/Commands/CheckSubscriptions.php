<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Abonnement;
use App\Notifications\SubscriptionAlertNotification;
use Carbon\Carbon;

class CheckSubscriptions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscriptions:check';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $signature_description = 'Check for expiring or expired subscriptions and notify artisans.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking subscriptions...');

        // 1. Expiring in exactly 7 days
        $expiringSoon = Abonnement::where('statut', 'actif')
            ->whereDate('date_fin', Carbon::today()->addDays(7))
            ->with('artisan.user')
            ->get();

        foreach ($expiringSoon as $sub) {
            $sub->artisan->user->notify(new SubscriptionAlertNotification($sub, 'expiring_soon'));
            $this->line("Notified {$sub->artisan->user->email} about 7-day expiry.");
        }

        // 2. Expiring in exactly 1 day (Bonus)
        $expiringTomorrow = Abonnement::where('statut', 'actif')
            ->whereDate('date_fin', Carbon::today()->addDay())
            ->with('artisan.user')
            ->get();

        foreach ($expiringTomorrow as $sub) {
            $sub->artisan->user->notify(new SubscriptionAlertNotification($sub, 'expiring_soon'));
            $this->line("Notified {$sub->artisan->user->email} about 1-day expiry.");
        }

        // 3. Expired today (Mark as expired and notify)
        $expired = Abonnement::where('statut', 'actif')
            ->whereDate('date_fin', '<=', Carbon::today())
            ->with('artisan.user')
            ->get();

        foreach ($expired as $sub) {
            $sub->update(['statut' => 'expire']);
            $sub->artisan->user->notify(new SubscriptionAlertNotification($sub, 'expired'));
            $this->warn("Notified {$sub->artisan->user->email} about expiration.");
        }

        $this->info('Subscription check completed.');
    }
}
