<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Wilaya;
use App\Models\CategorieMetier;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Wilayas (69)
        $this->call(WilayaSeeder::class);

        // 2. Catégories (Métiers)
        $categories = [
            ['nom' => 'Plomberie',            'icone' => '🔧'],
            ['nom' => 'Électricité',          'icone' => '⚡'],
            ['nom' => 'Peinture',             'icone' => '🎨'],
            ['nom' => 'Maçonnerie',           'icone' => '🧱'],
            ['nom' => 'Menuiserie',           'icone' => '🪵'],
            ['nom' => 'Climatisation',        'icone' => '❄️'],
            ['nom' => 'Soudure',              'icone' => '👨‍🏭'],
            ['nom' => 'Mécanique',            'icone' => '🚗'],
            ['nom' => 'Jardinage',            'icone' => '🌿'],
            ['nom' => 'Nettoyage',            'icone' => '🧹'],
            ['nom' => 'Froid & Frigo',        'icone' => '🍦'],
            ['nom' => 'Plâtrerie & PVC',      'icone' => '🏗️'],
            ['nom' => 'Électroménager',       'icone' => '📺'],
            ['nom' => 'Aluminium & Vitrage',  'icone' => '🪟'],
        ];
        foreach ($categories as $c) {
            CategorieMetier::updateOrCreate(['nom' => $c['nom']], $c);
        }

        // 3. Compte TEST Client
        User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'nomComplet' => 'Sami Dev',
                'password'   => Hash::make('password'),
                'type'       => 'client',
                'statut'     => 'actif',
            ]
        );

        // 4. Compte TEST Admin
        User::updateOrCreate(
            ['email' => 'admin@dzartisan.dz'],
            [
                'nomComplet' => 'Administrateur',
                'password'   => Hash::make('admin123'),
                'type'       => 'admin',
                'statut'     => 'actif',
            ]
        );

        $this->command->info('✅ Données de test créées : test@example.com / password');
    }
}
