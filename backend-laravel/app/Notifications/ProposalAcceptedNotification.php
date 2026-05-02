<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class ProposalAcceptedNotification extends Notification
{
    use Queueable;

    protected $demande;
    protected $clientName;

    public function __construct($demande, $clientName)
    {
        $this->demande = $demande;
        $this->clientName = $clientName;
    }

    public function via($notifiable)
    {
        return ['database', 'mail', 'broadcast'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Félicitations ! Votre proposition a été acceptée.')
            ->greeting('Bonjour ' . ($notifiable->nomComplet ?? '') . ' !')
            ->line('Excellente nouvelle ! ' . $this->clientName . ' a accepté votre proposition pour l\'intervention :')
            ->line('Titre : ' . $this->demande->titre)
            ->line('Catégorie : ' . $this->demande->categorie->nom)
            ->action('Voir les détails de l\'intervention', config('app.frontend_url', 'http://localhost:3000') . '/dashboard/artisan/interventions')
            ->line('Vous pouvez maintenant contacter le client pour planifier l\'intervention.')
            ->salutation('L\'équipe DzArtisan');
    }

    public function toArray($notifiable)
    {
        return [
            'type'       => 'artisan_status',
            'demande_id' => $this->demande->id,
            'title'      => 'Proposition acceptée',
            'icon'       => 'check-circle',
            'text'       => $this->clientName . " a accepté votre proposition."
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'type'       => 'artisan_status',
            'demande_id' => $this->demande->id,
            'title'      => 'Proposition acceptée',
            'icon'       => 'check-circle',
            'text'       => $this->clientName . " a accepté votre proposition."
        ]);
    }
}
