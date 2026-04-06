<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubscriptionAlertNotification extends Notification
{
    use Queueable;

    protected $status; // expiring_soon, expired
    protected $days;

    public function __construct($status, $days = 0)
    {
        $this->status = $status;
        $this->days = $days;
    }

    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    public function toMail($notifiable)
    {
        $subjects = [
            'expiring_soon' => 'Votre abonnement DzArtisan expire bientôt',
            'expired'       => 'Votre abonnement DzArtisan a expiré'
        ];

        $lines = [
            'expiring_soon' => "Attention ! Votre abonnement artisan arrive à échéance dans {$this->days} jours. Pour éviter toute interruption de service, renouvelez-le dès maintenant.",
            'expired'       => "Votre abonnement a expiré. Votre profil n'est plus visible dans les résultats de recherche. Renouvelez-le vite pour recommencer à recevoir des demandes."
        ];

        return (new MailMessage)
            ->subject($subjects[$this->status])
            ->greeting('Bonjour ' . ($notifiable->nomComplet ?? 'Hervé') . ' !')
            ->line($lines[$this->status])
            ->action('Gérer mon abonnement', url('/dashboard/artisan/subscription'))
            ->line('Merci de continuer à grandir avec DzArtisan.')
            ->salutation('L\'équipe DzArtisan');
    }

    public function toArray($notifiable)
    {
        return [
            'type'   => 'subscription_alert',
            'status' => $this->status,
            'days'   => $this->days,
            'icon'   => 'credit-card',
            'text'   => $this->status === 'expiring_soon' 
                       ? "Votre abonnement expire dans {$this->days} jours." 
                       : "Votre abonnement a expiré."
        ];
    }
}
