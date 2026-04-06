<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    // Colonnes réelles dans la migration
    protected $fillable = [
        'nomComplet',
        'email',
        'password',
        'telephone',
        'type',    // 'client', 'artisan', 'admin'
        'statut',  // 'actif', 'suspendu', 'supprime'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    public function artisan()
    {
        return $this->hasOne(Artisan::class);
    }

    public function client()
    {
        return $this->hasOne(Client::class);
    }
}
