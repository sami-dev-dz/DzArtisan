<x-mail::message>
# Bonjour {{ $user->nomComplet }},

L'administration de **DzArtisan** vous a envoyé le message suivant :

<x-mail::panel>
{{ $content }}
</x-mail::panel>

Si vous avez des questions, n'hésitez pas à répondre à cet e-mail.

Cordialement,<br>
L'équipe de modération {{ config('app.name') }}
</x-mail::message>
