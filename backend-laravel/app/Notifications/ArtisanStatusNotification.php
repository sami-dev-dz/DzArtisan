<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ArtisanStatusNotification extends Notification
{
    use Queueable;

    protected $status; // approved, rejected, suspended
    protected $reason;

    public function __construct($status, $reason = null)
    {
        $this->status = $status;
        $this->reason = $reason;
    }

    public function via($notifiable)
    {
        // Only use database for now — mail is not configured in .env
        // Add 'mail' here once MAIL_MAILER is set up in production
        return ['database'];
    }

    public function toMail($notifiable)
    {
        $subjects = [
            'approved'  => 'Votre profil artisan a été approuvé !',
            'rejected'  => 'Mise à jour concernant votre inscription artisan',
            'suspended' => 'Action requise : Votre compte a été suspendu'
        ];

        $lines = [
            'approved'  => "Bonne nouvelle ! Votre profil a été validé par notre équipe. Vous pouvez maintenant recevoir des demandes d'intervention.",
            'rejected'  => "Après examen de vos documents, nous n'avons pas pu valider votre profil pour la raison suivante : " . ($this->reason ?? 'Documents non conformes.'),
            'suspended' => "Votre compte a été suspendu temporairement : " . ($this->reason ?? "Violation des conditions d'utilisation.")
        ];

        $actionText = [
            'approved'  => 'Voir mon tableau de bord',
            'rejected'  => 'Mettre à jour mon profil',
            'suspended' => 'Contacter le support'
        ];

        $actionUrl = [
            'approved'  => url('/dashboard/artisan'),
            'rejected'  => url('/dashboard/artisan/profile'),
            'suspended' => url('/about#contact')
        ];

        return (new MailMessage)
            ->subject($subjects[$this->status])
            ->greeting('Bonjour ' . ($notifiable->nomComplet ?? 'Hervé') . ' !')
            ->line($lines[$this->status])
            ->action($actionText[$this->status], $actionUrl[$this->status])
            ->line('Merci de faire partie de la communauté DzArtisan.')
            ->salutation('L\'équipe DzArtisan');
    }

    public function toArray($notifiable)
    {
        return [
            'type'   => 'artisan_status',
            'status' => $this->status,
            'reason' => $this->reason,
            'icon'   => $this->status === 'approved' ? 'check-circle' : ($this->status === 'rejected' ? 'x-circle' : 'alert-triangle'),
            'text'   => "Votre profil artisan a été " . ($this->status === 'approved' ? 'approuvé' : ($this->status === 'rejected' ? 'refusé' : 'suspendu')) . "."
        ];
    }
}
