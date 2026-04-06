<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commune extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'wilaya_id',
        'nom',
        'code_postal'
    ];

    public $incrementing = false;

    public function wilaya()
    {
        return $this->belongsTo(Wilaya::class);
    }
}
