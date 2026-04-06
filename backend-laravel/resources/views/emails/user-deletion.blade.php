<x-mail::message>
# Bonjour {{ $userName }},

Nous vous informons par la présente que votre compte sur la plateforme **DzArtisan** a été supprimé par l'administration.

**Motif de la suppression :**
<x-mail::panel>
{{ $reason }}
</x-mail::panel>

Conformément à la **loi n° 18-07** relative à la protection des personnes physiques dans le traitement des données à caractère personnel, vos données identifiables ont été retirées de nos systèmes actifs.

Si vous pensez qu'il s'agit d'une erreur, vous pouvez nous contacter à l'adresse support@dzartisan.dz.

Merci pour votre compréhension,<br>
L'administration de {{ config('app.name') }}
</x-mail::message>
