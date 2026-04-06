<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; }
        .header { background-color: #991b1b; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 20px; }
        .footer { text-align: center; font-size: 12px; color: #777; margin-top: 20px; }
        .reason-box { background-color: #fff1f2; border: 1px solid #fecdd3; padding: 15px; border-radius: 5px; margin: 20px 0; font-weight: bold; color: #be123c; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Notification de suspension</h1>
        </div>
        <div class="content">
            <p>Bonjour {{ $artisan->user->nomComplet }},</p>
            <p>Nous vous informons par la présente que votre compte d'artisan sur DzArtisan a été <strong>suspendu</strong> temporairement.</p>
            <p>Cette décision a été prise pour le(s) motif(s) suivant(s) :</p>
            <div class="reason-box">
                "{{ $reason }}"
            </div>
            <p>Conformément à nos conditions d'utilisation, votre profil n'est plus visible par les clients et vous ne recevrez plus de nouvelles demandes d'intervention pendant la durée de la suspension.</p>
            <p>Si vous souhaitez contester cette décision ou obtenir plus d'informations, veuillez contacter notre équipe de support.</p>
            <p>Cordialement,</p>
            <p>L'administration DzArtisan</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} DzArtisan - Le premier réseau d'artisans en Algérie.
        </div>
    </div>
</body>
</html>
