<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; }
        .header { background-color: #ef4444; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 20px; }
        .footer { text-align: center; font-size: 12px; color: #777; margin-top: 20px; }
        .reason-box { background-color: #fef2f2; border: 1px solid #fee2e2; padding: 15px; border-radius: 5px; margin: 20px 0; font-style: italic; color: #b91c1c; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Inscription DzArtisan : Information</h1>
        </div>
        <div class="content">
            <p>Bonjour {{ $artisan->user->nomComplet }},</p>
            <p>Nous avons bien reçu votre demande d'inscription comme artisan sur DzArtisan.</p>
            <p>Après examen de votre dossier par notre équipe de modération, nous regrettons de vous informer que votre profil n'a pas pu être approuvé pour le moment.</p>
            <p><strong>Motif du rejet :</strong></p>
            <div class="reason-box">
                "{{ $reason }}"
            </div>
            <p>Vous pouvez modifier votre profil et soumettre à nouveau votre candidature en suivant les recommandations ci-dessus.</p>
            <p>L'équipe DzArtisan</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} DzArtisan - Le premier réseau d'artisans en Algérie.
        </div>
    </div>
</body>
</html>
