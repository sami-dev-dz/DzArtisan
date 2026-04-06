<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminDirectMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $subjectLine;
    public $content;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, string $subjectLine, string $content)
    {
        $this->user = $user;
        $this->subjectLine = $subjectLine;
        $this->content = $content;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subjectLine,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.admin-direct',
        );
    }
}
