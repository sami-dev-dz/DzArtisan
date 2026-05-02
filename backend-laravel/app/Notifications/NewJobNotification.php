<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewJobNotification extends Notification
{
    use Queueable;

    protected $demande;

    public function __construct($demande)
    {
        $this->demande = $demande;
    }

    public function via($notifiable)
    {
        return ['database', 'mail', 'broadcast'];
    }

    public function toMail($notifiable)
    {
        $location = $this->demande->wilaya ? $this->demande->wilaya->nom : 'votre secteur';
        return (new MailMessage)
            ->subject("Nouvelle demande d'intervention à {$location} !")
            ->greeting('Bonjour ' . ($notifiable->nomComplet ?? '') . ' !')
            ->line("Une nouvelle demande d'intervention correspond à vos compétences dans {$location}.")
            ->line('Titre : ' . $this->demande->titre)
            ->line('Catégorie : ' . $this->demande->categorie->nom)
            ->action('Voir la demande et postuler', config('app.frontend_url', 'http://localhost:3000') . '/dashboard/artisan/jobs')
            ->line('Répondez rapidement pour maximiser vos chances de décrocher le projet !')
            ->salutation('L\'équipe DzArtisan');
    }

    public function toArray($notifiable)
    {
        return [
            'type'       => 'new_job',
            'demande_id' => $this->demande->id,
            'title'      => $this->demande->titre,
            'category'   => $this->demande->categorie->nom,
            'icon'       => 'briefcase',
            'text'       => "Nouvelle demande : " . $this->demande->titre
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new \Illuminate\Notifications\Messages\BroadcastMessage([
            'type'       => 'new_job',
            'demande_id' => $this->demande->id,
            'title'      => $this->demande->titre,
            'category'   => $this->demande->categorie->nom,
            'icon'       => 'briefcase',
            'text'       => "Nouvelle demande : " . $this->demande->titre
        ]);
    }
}
