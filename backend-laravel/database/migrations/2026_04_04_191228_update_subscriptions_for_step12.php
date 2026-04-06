<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Update 'plan' enum in abonnements
        // Note: Changing enums in MySQL via change() requires doctrine/dbal or raw SQL.
        // We'll use raw SQL for speed and reliability in this environment.
        DB::statement("ALTER TABLE abonnements MODIFY COLUMN plan ENUM('gratuit', 'mensuel', 'trimestriel', 'annuel') NOT NULL");

        Schema::table('paiements', function (Blueprint $table) {
            $table->string('preuve_paiement')->nullable()->after('methode');
            $table->text('notes')->nullable()->after('statut');
        });
    }

    public function down(): void
    {
        Schema::table('paiements', function (Blueprint $table) {
            $table->dropColumn(['preuve_paiement', 'notes']);
        });

        DB::statement("ALTER TABLE abonnements MODIFY COLUMN plan ENUM('gratuit', 'premium', 'gold') NOT NULL");
    }
};
