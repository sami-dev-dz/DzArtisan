<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandeProposition extends Model
{
    use HasFactory;

    protected $fillable = [
        'demande_id',
        'artisan_id',
        'message',
        'statut'
    ];

    public function demande()
    {
        return $this->belongsTo(DemandeIntervention::class, 'demande_id');
    }

    public function artisan()
    {
        return $this->belongsTo(Artisan::class);
    }
}
