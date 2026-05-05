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
            ['nom' => 'Plomberie',            'nom_ar' => 'سباكة',            'icone' => '🔧'],
            ['nom' => 'Électricité',          'nom_ar' => 'كهرباء',           'icone' => '⚡'],
            ['nom' => 'Peinture',             'nom_ar' => 'دهان',             'icone' => '🎨'],
            ['nom' => 'Maçonnerie',           'nom_ar' => 'بناء',             'icone' => '🧱'],
            ['nom' => 'Menuiserie',           'nom_ar' => 'نجارة',            'icone' => '🪵'],
            ['nom' => 'Climatisation',        'nom_ar' => 'تبريد وتكييف',      'icone' => '❄️'],
            ['nom' => 'Soudure',              'nom_ar' => 'تلحيم',            'icone' => '👨‍🏭'],
            ['nom' => 'Mécanique',            'nom_ar' => 'ميكانيك',          'icone' => '🚗'],
            ['nom' => 'Jardinage',            'nom_ar' => 'بستنة',            'icone' => '🌿'],
            ['nom' => 'Nettoyage',            'nom_ar' => 'تنظيف',            'icone' => '🧹'],
            ['nom' => 'Froid & Frigo',        'nom_ar' => 'تبريد',            'icone' => '🍦'],
            ['nom' => 'Plâtrerie & PVC',      'nom_ar' => 'جبس و PVC',        'icone' => '🏗️'],
            ['nom' => 'Électroménager',       'nom_ar' => 'كهرومنزلية',       'icone' => '📺'],
            ['nom' => 'Aluminium & Vitrage',  'nom_ar' => 'ألمنيوم وزجاج',      'icone' => '🪟'],
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
