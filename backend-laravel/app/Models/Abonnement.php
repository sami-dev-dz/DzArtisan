<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Abonnement extends Model
{
    use HasFactory;

    protected $fillable = [
        'artisan_id',
        'plan',
        'statut',
        'date_debut',
        'date_fin',
        'trial_ends_at'
    ];

    protected $casts = [
        'date_debut' => 'datetime',
        'date_fin' => 'datetime',
        'trial_ends_at' => 'datetime',
    ];

    protected $appends = ['is_active', 'is_expiring', 'is_expired'];

    public function artisan()
    {
        return $this->belongsTo(Artisan::class);
    }

    public function paiements()
    {
        return $this->hasMany(Paiement::class);
    }

    public function getIsActiveAttribute()
    {
        return $this->statut === 'actif' && $this->date_fin && $this->date_fin->isFuture();
    }

    public function getIsExpiringAttribute()
    {
        return $this->statut === 'actif' && $this->date_fin && $this->date_fin->isFuture() && $this->date_fin->diffInDays(now()) <= 7;
    }

    public function getIsExpiredAttribute()
    {
        return $this->date_fin && $this->date_fin->isPast();
    }
}
