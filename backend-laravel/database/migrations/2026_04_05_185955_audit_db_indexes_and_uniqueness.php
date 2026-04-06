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
        Schema::table('avis', function (Blueprint $table) {
            $table->unique('demande_id');
        });

        Schema::table('artisan_categorie', function (Blueprint $table) {
            $table->unique(['artisan_id', 'categorie_id']);
        });

        Schema::table('artisan_wilaya', function (Blueprint $table) {
            $table->unique(['artisan_id', 'wilaya_id']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->index('nomComplet');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['nomComplet']);
        });

        Schema::table('artisan_wilaya', function (Blueprint $table) {
            $table->dropUnique(['artisan_id', 'wilaya_id']);
        });

        Schema::table('artisan_categorie', function (Blueprint $table) {
            $table->dropUnique(['artisan_id', 'categorie_id']);
        });

        Schema::table('avis', function (Blueprint $table) {
            $table->dropUnique(['demande_id']);
        });
    }
};
