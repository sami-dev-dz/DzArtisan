<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReclamationPhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'reclamation_id',
        'url'
    ];

    /**
     * Parent complaint.
     */
    public function reclamation(): BelongsTo
    {
        return $this->belongsTo(Reclamation::class);
    }
}
