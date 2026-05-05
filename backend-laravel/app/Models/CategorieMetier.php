<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class CategorieMetier extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'nom_ar',
        'slug',
        'icone'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->nom);
            }
        });
    }

    public function artisans()
    {
        return $this->hasMany(Artisan::class, 'categorie_id');
    }
}
