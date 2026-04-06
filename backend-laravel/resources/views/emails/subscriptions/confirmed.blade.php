<x-mail::message>
# Félicitations ! Votre abonnement est activé

Bonjour {{ $abonnement->artisan->user->nomComplet }},

Nous avons le plaisir de vous informer que votre paiement a été confirmé par notre équipe. Votre abonnement **{{ ucfirst($abonnement->plan) }}** est désormais actif.

**Détails de l'abonnement :**
- **Plan :** {{ ucfirst($abonnement->plan) }}
- **Date de début :** {{ $abonnement->date_debut->format('d/m/Y') }}
- **Date de fin :** {{ $abonnement->date_fin->format('d/m/Y') }}

Vous bénéficiez dès maintenant de tous les avantages liés à votre plan sur la plateforme DzArtisan.

<x-mail::button :url="config('app.frontend_url') . '/dashboard'">
Accéder à mon tableau de bord
</x-mail::button>

Merci de votre confiance,<br>
L'équipe {{ config('app.name') }}
</x-mail::message>
