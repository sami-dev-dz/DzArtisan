<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArtisanUnavailability extends Model
{
    protected $fillable = [
        'artisan_id',
        'start_date',
        'end_date',
        'reason',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function artisan(): BelongsTo
    {
        return $this->belongsTo(Artisan::class);
    }
}
