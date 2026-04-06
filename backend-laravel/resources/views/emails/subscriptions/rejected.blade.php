<x-mail::message>
# Information concernant votre paiement

Bonjour {{ $paiement->abonnement->artisan->user->nomComplet }},

Nous avons examiné votre preuve de paiement pour l'abonnement **{{ ucfirst($paiement->abonnement->plan) }}**, mais nous n'avons pas pu la valider pour la raison suivante :

> {{ $reason }}

Votre compte reste sur son plan actuel. Nous vous invitons à soumettre une nouvelle preuve de paiement valide ou à nous contacter si vous pensez qu'il s'agit d'une erreur.

<x-mail::button :url="config('app.frontend_url') . '/subscription'">
Réessayer le paiement
</x-mail::button>

Si vous avez des questions, n'hésitez pas à répondre à cet e-mail.

Cordialement,<br>
L'équipe {{ config('app.name') }}
</x-mail::message>
