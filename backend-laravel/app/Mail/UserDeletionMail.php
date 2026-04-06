<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class UserDeletionMail extends Mailable
{
    use Queueable, SerializesModels;

    public $userName;
    public $reason;

    /**
     * Create a new message instance.
     */
    public function __construct(string $userName, string $reason)
    {
        $this->userName = $userName;
        $this->reason = $reason;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Avis de suppression de votre compte - DzArtisan',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.user-deletion',
        );
    }
}
