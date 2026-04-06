<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Intervention extends Model
{
    use HasFactory;

    protected $fillable = [
        'artisan_id',
        'client_id',
        'description',
        'date_intervention',
        'statut', // 'programmee', 'terminee', 'annulee'
        'prix_estime'
    ];

    public function artisan()
    {
        return $this->belongsTo(Artisan::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
