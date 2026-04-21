<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Reclamation extends Model
{
    use HasFactory;

    protected $fillable = [
        'demandeur_id',
        'accuse_id',
        'categorie',
        'description',
        'statut',
        'intervention_id',
        'notes_admin'
    ];

    public function demandeur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'demandeur_id');
    }

    public function accuse(): BelongsTo
    {
        return $this->belongsTo(User::class, 'accuse_id');
    }

    public function intervention(): BelongsTo
    {
        return $this->belongsTo(DemandeIntervention::class, 'intervention_id');
    }

    public function photos(): HasMany
    {
        return $this->hasMany(ReclamationPhoto::class);
    }

    public function actions(): HasMany
    {
        return $this->hasMany(ReclamationAction::class)->orderBy('created_at', 'desc');
    }

    public function scopeFilterByStatus($query, $status)
    {
        if ($status && $status !== 'tous') {
            return $query->where('statut', $status);
        }
        return $query;
    }
}
