<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Avis extends Model
{
    use HasFactory;

    protected $table = 'avis';

    protected $fillable = [
        'demande_id',
        'client_id',
        'artisan_id',
        'note',
        'commentaire'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function artisan()
    {
        return $this->belongsTo(Artisan::class);
    }

    public function demande()
    {
        return $this->belongsTo(DemandeIntervention::class, 'demande_id');
    }

    /**
     * Helper to get direct user through client
     */
    public function user()
    {
        return $this->hasOneThrough(User::class, Client::class, 'id', 'id', 'client_id', 'user_id');
    }
}
