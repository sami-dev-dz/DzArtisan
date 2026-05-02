<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Devis Intervention</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; color: #333; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #3498db; padding-bottom: 20px; }
        .header h1 { margin: 0; color: #2c3e50; }
        .parties { width: 100%; margin-bottom: 40px; }
        .parties td { width: 50%; vertical-align: top; }
        .box { background: #f8f9fa; padding: 15px; border-radius: 5px; }
        .title { font-weight: bold; margin-bottom: 10px; color: #2980b9; }
        .details { margin-bottom: 30px; }
        .details h2 { font-size: 1.2em; color: #34495e; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        .price { text-align: right; font-size: 1.5em; font-weight: bold; color: #27ae60; margin-top: 30px; }
        .footer { text-align: center; font-size: 0.9em; color: #7f8c8d; margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Devis Prestation de Service</h1>
        <p>Réf: INT-{{ str_pad($demande->id, 5, '0', STR_PAD_LEFT) }} | Date: {{ now()->format('d/m/Y') }}</p>
    </div>

    <table class="parties">
        <tr>
            <td>
                <div class="box">
                    <div class="title">Prestataire (Artisan)</div>
                    <strong>{{ $artisan->user->nomComplet }}</strong><br>
                    Téléphone : {{ $artisan->user->telephone }}<br>
                    Catégorie : {{ $artisan->primaryCategorie->nom ?? 'Expert' }}
                </div>
            </td>
            <td>
                <div class="box" style="margin-left: 10px;">
                    <div class="title">Client</div>
                    <strong>{{ $client->user->nomComplet }}</strong><br>
                    Téléphone : {{ $client->user->telephone }}<br>
                    Adresse : {{ $demande->adresse ?? ($demande->commune->nom . ', ' . $demande->wilaya->nom) }}
                </div>
            </td>
        </tr>
    </table>

    <div class="details">
        <h2>Détails de l'intervention</h2>
        <p><strong>Titre :</strong> {{ $demande->titre }}</p>
        <p><strong>Description :</strong></p>
        <p>{{ $demande->description }}</p>
        <p><strong>Statut Actuel :</strong> {{ ucfirst(str_replace('_', ' ', $demande->statut)) }}</p>
    </div>

    <div class="price">
        Prix Convenu : {{ number_format($demande->prix ?? 0, 2, ',', ' ') }} DZD
    </div>

    <div class="footer">
        <p>Ce devis est généré automatiquement par la plateforme DzArtisan.</p>
        <p>En cas de litige, veuillez contacter le support client.</p>
    </div>
</body>
</html>
