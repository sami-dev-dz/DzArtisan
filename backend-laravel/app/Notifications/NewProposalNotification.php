<?php

namespace App\Notifications;

use App\Models\Artisan;
use App\Models\DemandeIntervention;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewProposalNotification extends Notification
{
    use Queueable;

    protected DemandeIntervention $demande;
    protected Artisan $artisan;

    public function __construct(DemandeIntervention $demande, Artisan $artisan)
    {
        $this->demande = $demande;
        $this->artisan = $artisan;
    }

    public function via($notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $artisanName = $this->artisan->user->nomComplet ?? 'Un artisan';
        $titre       = $this->demande->titre ?? 'votre demande';

        return (new MailMessage)
            ->subject('Nouvelle proposition reçue pour : ' . $titre)
            ->greeting('Bonjour ' . ($notifiable->nomComplet ?? '') . ' !')
            ->line("{$artisanName} a soumis une proposition pour votre demande « {$titre} ».")
            ->action('Voir les propositions', url('/dashboard/client/requests/' . $this->demande->id))
            ->line('Connectez-vous pour examiner la proposition et contacter l\'artisan.')
            ->salutation('L\'équipe DzArtisan');
    }

    public function toArray($notifiable): array
    {
        return [
            'type'       => 'new_proposal',
            'demande_id' => $this->demande->id,
            'artisan_id' => $this->artisan->id,
            'icon'       => 'file-text',
            'text'       => ($this->artisan->user->nomComplet ?? 'Un artisan')
                          . ' a soumis une proposition pour « '
                          . ($this->demande->titre ?? 'votre demande') . ' ».',
            'link'       => '/dashboard/client/requests/' . $this->demande->id,
        ];
    }
}
