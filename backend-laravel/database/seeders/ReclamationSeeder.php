<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReclamationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clientId = DB::table('users')->where('role', 'client')->first()?->id;
        $artisanId = DB::table('users')->where('role', 'artisan')->first()?->id;
        $adminId = DB::table('users')->where('role', 'admin')->first()?->id;

        if (!$clientId || !$artisanId) return;

        // 1. New Complaint
        $c1 = \App\Models\Reclamation::create([
            'demandeur_id' => $clientId,
            'accuse_id' => $artisanId,
            'categorie' => 'Comportement non professionnel',
            'description' => "L'artisan est arrivé avec 2 heures de retard et a refusé de porter un masque. De plus, il a laissé les lieux dans un état déplorable.",
            'statut' => 'nouveau',
        ]);

        // 2. Investigating Complaint
        $c2 = \App\Models\Reclamation::create([
            'demandeur_id' => $artisanId,
            'accuse_id' => $clientId,
            'categorie' => 'Non-paiement',
            'description' => "Le client refuse de payer le solde restant de 5000 DA malgré la fin des travaux de plomberie validés.",
            'statut' => 'en_cours',
        ]);

        \App\Models\ReclamationAction::create([
            'reclamation_id' => $c2->id,
            'admin_id' => $adminId ?? 1,
            'action' => 'Investigation started',
            'notes' => 'Contacted both parties by phone. Client claims some leaks persist.'
        ]);

        // 3. Resolved Complaint (Strike for Artisan)
        $c3 = \App\Models\Reclamation::create([
            'demandeur_id' => $clientId,
            'accuse_id' => $artisanId,
            'categorie' => 'Travail bâclé',
            'description' => "La peinture de la façade a commencé à s'écailler après seulement deux jours de pluie. L'artisan ne répond plus.",
            'statut' => 'resolu',
        ]);

        \App\Models\ReclamationAction::create([
            'reclamation_id' => $c3->id,
            'admin_id' => $adminId ?? 1,
            'action' => 'Warning sent',
            'notes' => 'Confirmed using photos. Artisan has been warned.'
        ]);
    }
}
