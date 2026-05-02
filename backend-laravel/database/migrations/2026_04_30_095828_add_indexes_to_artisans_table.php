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
        Schema::table('artisans', function (Blueprint $table) {
            $table->index('wilaya_id');
            $table->index('statutValidation');
            $table->index('user_id');
        });
        
        Schema::table('demandes_interventions', function (Blueprint $table) {
            $table->index('wilaya_id');
            $table->index('statut');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('artisans', function (Blueprint $table) {
            $table->dropIndex(['wilaya_id']);
            $table->dropIndex(['statutValidation']);
            $table->dropIndex(['user_id']);
        });
        
        Schema::table('demandes_interventions', function (Blueprint $table) {
            $table->dropIndex(['wilaya_id']);
            $table->dropIndex(['statut']);
        });
    }
};
