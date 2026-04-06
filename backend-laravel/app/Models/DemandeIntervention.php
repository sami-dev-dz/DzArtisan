<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandeIntervention extends Model
{
    use HasFactory;

    protected $table = 'demandes_interventions';

    protected $fillable = [
        'client_id',
        'artisan_id',
        'categorie_id',
        'titre',
        'description',
        'statut',
        'budget_estime',
        'date_souhaitee',
        'latitude',
        'longitude',
        'adresse',
        'wilaya_id',
        'commune_id'
    ];

    protected $casts = [
        'date_souhaitee' => 'datetime',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function artisan()
    {
        return $this->belongsTo(Artisan::class);
    }

    public function categorie()
    {
        return $this->belongsTo(CategorieMetier::class, 'categorie_id');
    }

    public function wilaya()
    {
        return $this->belongsTo(Wilaya::class);
    }

    public function commune()
    {
        return $this->belongsTo(Commune::class);
    }

    public function photos()
    {
        return $this->hasMany(InterventionPhoto::class, 'demande_id');
    }

    public function avis()
    {
        return $this->hasOne(Avis::class, 'demande_id');
    }

    public function propositions()
    {
        return $this->hasMany(DemandeProposition::class, 'demande_id');
    }
}
