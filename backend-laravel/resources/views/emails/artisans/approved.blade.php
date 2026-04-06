<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; }
        .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 20px; }
        .footer { text-align: center; font-size: 12px; color: #777; margin-top: 20px; }
        .button { display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Bienvenue sur DzArtisan !</h1>
        </div>
        <div class="content">
            <p>Bonjour {{ $artisan->user->nomComplet }},</p>
            <p>Nous avons le plaisir de vous informer que votre profil d'artisan a été <strong>approuvé</strong> par notre équipe de modération.</p>
            <p>Vous pouvez désormais accéder à votre tableau de bord, compléter votre profil et commencer à recevoir des demandes d'intervention de la part des clients.</p>
            <p style="text-align: center;">
                <a href="{{ config('app.frontend_url') }}/login" class="button">Accéder à mon compte</a>
            </p>
            <p>Merci de nous avoir rejoints et nous vous souhaitons beaucoup de succès sur notre plateforme !</p>
            <p>L'équipe DzArtisan</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} DzArtisan - Le premier réseau d'artisans en Algérie.
        </div>
    </div>
</body>
</html>
