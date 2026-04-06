<?php

namespace Database\Seeders;

use App\Models\Wilaya;
use Illuminate\Database\Seeder;

class WilayaSeeder extends Seeder
{
    public function run(): void
    {
        $wilayas = [
            ['id' => 1, 'nom' => 'Adrar'],
            ['id' => 2, 'nom' => 'Chlef'],
            ['id' => 3, 'nom' => 'Laghouat'],
            ['id' => 4, 'nom' => 'Oum El Bouaghi'],
            ['id' => 5, 'nom' => 'Batna'],
            ['id' => 6, 'nom' => 'Béjaïa'],
            ['id' => 7, 'nom' => 'Biskra'],
            ['id' => 8, 'nom' => 'Béchar'],
            ['id' => 9, 'nom' => 'Blida'],
            ['id' => 10, 'nom' => 'Bouira'],
            ['id' => 11, 'nom' => 'Tamanrasset'],
            ['id' => 12, 'nom' => 'Tébessa'],
            ['id' => 13, 'nom' => 'Tlemcen'],
            ['id' => 14, 'nom' => 'Tiaret'],
            ['id' => 15, 'nom' => 'Tizi Ouzou'],
            ['id' => 16, 'nom' => 'Alger'],
            ['id' => 17, 'nom' => 'Djelfa'],
            ['id' => 18, 'nom' => 'Jijel'],
            ['id' => 19, 'nom' => 'Sétif'],
            ['id' => 20, 'nom' => 'Saïda'],
            ['id' => 21, 'nom' => 'Skikda'],
            ['id' => 22, 'nom' => 'Sidi Bel Abbès'],
            ['id' => 23, 'nom' => 'Annaba'],
            ['id' => 24, 'nom' => 'Guelma'],
            ['id' => 25, 'nom' => 'Constantine'],
            ['id' => 26, 'nom' => 'Médéa'],
            ['id' => 27, 'nom' => 'Mostaganem'],
            ['id' => 28, 'nom' => "M'Sila"],
            ['id' => 29, 'nom' => 'Mascara'],
            ['id' => 30, 'nom' => 'Ouargla'],
            ['id' => 31, 'nom' => 'Oran'],
            ['id' => 32, 'nom' => 'El Bayadh'],
            ['id' => 33, 'nom' => 'Illizi'],
            ['id' => 34, 'nom' => 'Bordj Bou Arreridj'],
            ['id' => 35, 'nom' => 'Boumerdès'],
            ['id' => 36, 'nom' => 'El Tarf'],
            ['id' => 37, 'nom' => 'Tindouf'],
            ['id' => 38, 'nom' => 'Tissemsilt'],
            ['id' => 39, 'nom' => 'El Oued'],
            ['id' => 40, 'nom' => 'Khenchela'],
            ['id' => 41, 'nom' => 'Souk Ahras'],
            ['id' => 42, 'nom' => 'Tipaza'],
            ['id' => 43, 'nom' => 'Mila'],
            ['id' => 44, 'nom' => 'Aïn Defla'],
            ['id' => 45, 'nom' => 'Naâma'],
            ['id' => 46, 'nom' => 'Aïn Témouchent'],
            ['id' => 47, 'nom' => 'Ghardaïa'],
            ['id' => 48, 'nom' => 'Relizane'],
            ['id' => 49, 'nom' => "El M'Ghair"],
            ['id' => 50, 'nom' => 'El Meniaa'],
            ['id' => 51, 'nom' => 'Ouled Djellal'],
            ['id' => 52, 'nom' => 'Bordj Badji Mokhtar'],
            ['id' => 53, 'nom' => 'Béni Abbès'],
            ['id' => 54, 'nom' => 'Timimoun'],
            ['id' => 55, 'nom' => 'Touggourt'],
            ['id' => 56, 'nom' => 'Djanet'],
            ['id' => 57, 'nom' => 'In Salah'],
            ['id' => 58, 'nom' => 'In Guezzam'],
            // New 11 Wilayas (Ref: 2024/2025 Reform)
            ['id' => 59, 'nom' => 'Aflou'],
            ['id' => 60, 'nom' => 'El Abiodh Sidi Cheikh'],
            ['id' => 61, 'nom' => 'El Aricha'],
            ['id' => 62, 'nom' => 'El Kantara'],
            ['id' => 63, 'nom' => 'Barika'],
            ['id' => 64, 'nom' => 'Bou Saâda'],
            ['id' => 65, 'nom' => 'Bir El Ater'],
            ['id' => 66, 'nom' => 'Ksar El Boukhari'],
            ['id' => 67, 'nom' => 'Ksar Chellala'],
            ['id' => 68, 'nom' => 'Aïn Oussara'],
            ['id' => 69, 'nom' => 'Messaad'],
        ];

        foreach ($wilayas as $w) {
            Wilaya::updateOrCreate(['id' => $w['id']], $w);
        }
    }
}
