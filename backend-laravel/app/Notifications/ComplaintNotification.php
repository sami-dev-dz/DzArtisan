<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ComplaintNotification extends Notification
{
    use Queueable;

    protected $status; // new, in_progress, resolved, rejected, warning
    protected $complaintId;

    public function __construct($status, $complaintId)
    {
        $this->status = $status;
        $this->complaintId = $complaintId;
    }

    public function via($notifiable)
    {
        return ['database', 'mail', 'broadcast'];
    }

    public function toMail($notifiable)
    {
        $subjects = [
            'new'         => 'Nouvelle plainte déposée',
            'in_progress' => 'Plainte en cours d\'examen',
            'resolved'    => 'Plainte résolue',
            'rejected'    => 'Plainte rejetée',
            'warning'     => 'Avertissement concernant votre compte'
        ];

        $lines = [
            'new'         => "Une nouvelle plainte a été déposée vous concernant. Notre équipe va examiner le dossier.",
            'in_progress' => "Votre plainte est actuellement en cours d'examen par nos modérateurs.",
            'resolved'    => "L'incident a été marqué comme résolu après médiation.",
            'rejected'    => "Après examen, votre plainte n'a pas été retenue.",
            'warning'     => "Vous avez reçu un avertissement officiel suite à un comportement inapproprié ou un manquement à nos règles."
        ];

        return (new MailMessage)
            ->subject($subjects[$this->status])
            ->greeting('Bonjour ' . ($notifiable->nom ?? 'Cher utilisateur') . ' !')
            ->line($lines[$this->status])
            ->action('Voir les détails', config('app.frontend_url', 'http://localhost:3000') . '/dashboard/complaints/' . $this->complaintId)
            ->line('DzArtisan s\'engage à maintenir un haut niveau de service pour tous.')
            ->salutation('L\'équipe DzArtisan');
    }

    public function toArray($notifiable)
    {
        $textMap = [
            'new'         => "Une nouvelle plainte a été déposée.",
            'in_progress' => "Votre réclamation est en cours d'examen.",
            'resolved'    => "Une plainte a été résolue.",
            'rejected'    => "Votre plainte a été rejetée.",
            'warning'     => "Vous avez reçu un avertissement de l'administration."
        ];

        return [
            'type'         => 'complaint_alert',
            'status'       => $this->status,
            'complaint_id' => $this->complaintId,
            'icon'         => 'alert-octagon',
            'text'         => $textMap[$this->status] ?? "Mise à jour de votre réclamation."
        ];
    }

    public function toBroadcast($notifiable)
    {
        $textMap = [
            'new'         => "Une nouvelle plainte a été déposée.",
            'in_progress' => "Votre réclamation est en cours d'examen.",
            'resolved'    => "Une plainte a été résolue.",
            'rejected'    => "Votre plainte a été rejetée.",
            'warning'     => "Vous avez reçu un avertissement de l'administration."
        ];

        return new \Illuminate\Notifications\Messages\BroadcastMessage([
            'type'         => 'complaint_alert',
            'status'       => $this->status,
            'complaint_id' => $this->complaintId,
            'icon'         => 'alert-octagon',
            'title'        => 'Alerte Réclamation',
            'text'         => $textMap[$this->status] ?? "Mise à jour de votre réclamation."
        ]);
    }
}
