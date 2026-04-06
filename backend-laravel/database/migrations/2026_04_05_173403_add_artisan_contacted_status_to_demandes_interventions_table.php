<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('demandes_interventions', function (Blueprint $table) {
            $table->enum('statut', ['ouvert', 'artisan_contacte', 'en_cours', 'termine', 'annule'])->default('ouvert')->change();
        });
    }

    public function down(): void
    {
        Schema::table('demandes_interventions', function (Blueprint $table) {
            $table->enum('statut', ['ouvert', 'en_cours', 'termine', 'annule'])->default('ouvert')->change();
        });
    }
};
