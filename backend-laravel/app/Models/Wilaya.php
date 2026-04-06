<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wilaya extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'nom',
        'code'
    ];

    public $incrementing = false;

    public function communes()
    {
        return $this->hasMany(Commune::class);
    }
}
