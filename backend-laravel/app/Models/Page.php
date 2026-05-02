<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title_fr',
        'title_ar',
        'content_fr',
        'content_ar',
        'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
    ];
}
