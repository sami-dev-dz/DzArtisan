<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArtisanPortfolio extends Model
{
    protected $fillable = [
        'artisan_id',
        'image_url',
        'public_id',
        'caption',
    ];

    public function artisan(): BelongsTo
    {
        return $this->belongsTo(Artisan::class);
    }
}
