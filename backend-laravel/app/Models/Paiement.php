<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    use HasFactory;

    protected $fillable = [
        'abonnement_id',
        'montant',
        'transaction_id',
        'methode',
        'preuve_paiement',
        'statut',
        'notes'
    ];

    public function abonnement()
    {
        return $this->belongsTo(Abonnement::class);
    }
}
