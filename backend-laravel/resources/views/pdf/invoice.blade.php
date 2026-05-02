<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Facture Abonnement</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; color: #333; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 40px; }
        .header h1 { margin: 0; color: #2c3e50; }
        .details { margin-bottom: 30px; }
        .details table { width: 100%; }
        .details td { padding: 5px; }
        .items { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items th, .items td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        .items th { background-color: #f8f9fa; }
        .total { text-align: right; font-size: 1.2em; font-weight: bold; }
        .footer { text-align: center; font-size: 0.9em; color: #7f8c8d; margin-top: 50px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Facture Abonnement DzArtisan</h1>
        <p>Facture #{{ str_pad($paiement->id, 5, '0', STR_PAD_LEFT) }}</p>
    </div>

    <div class="details">
        <table>
            <tr>
                <td><strong>Artisan :</strong> {{ $artisan->user->nomComplet }}</td>
                <td style="text-align: right;"><strong>Date :</strong> {{ $paiement->created_at->format('d/m/Y') }}</td>
            </tr>
            <tr>
                <td><strong>Email :</strong> {{ $artisan->user->email }}</td>
                <td style="text-align: right;"><strong>Méthode :</strong> {{ ucfirst($paiement->methode) }}</td>
            </tr>
        </table>
    </div>

    <table class="items">
        <thead>
            <tr>
                <th>Description</th>
                <th>Période</th>
                <th>Montant</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Abonnement Premium (Plan {{ ucfirst($abonnement->plan) }})</td>
                <td>{{ $abonnement->date_debut ? $abonnement->date_debut->format('d/m/Y') : '-' }} au {{ $abonnement->date_fin ? $abonnement->date_fin->format('d/m/Y') : '-' }}</td>
                <td>{{ number_format($paiement->montant, 2, ',', ' ') }} DZD</td>
            </tr>
        </tbody>
    </table>

    <div class="total">
        Total Payé : {{ number_format($paiement->montant, 2, ',', ' ') }} DZD
    </div>

    <div class="footer">
        <p>Merci pour votre confiance.</p>
        <p>DzArtisan - Plateforme de mise en relation client/artisan en Algérie</p>
    </div>
</body>
</html>
