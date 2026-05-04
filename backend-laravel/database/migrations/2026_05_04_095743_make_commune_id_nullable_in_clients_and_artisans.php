<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Rendre commune_id et wilaya_id nullable pour permettre l'inscription même sans données de référence
        Schema::table('clients', function (Blueprint $table) {
            $table->unsignedBigInteger('commune_id')->nullable()->change();
            $table->unsignedBigInteger('wilaya_id')->nullable()->change();
        });

        Schema::table('artisans', function (Blueprint $table) {
            $table->unsignedBigInteger('commune_id')->nullable()->change();
            $table->unsignedBigInteger('wilaya_id')->nullable()->change();
            $table->unsignedBigInteger('categorie_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->unsignedBigInteger('commune_id')->nullable(false)->change();
            $table->unsignedBigInteger('wilaya_id')->nullable(false)->change();
        });

        Schema::table('artisans', function (Blueprint $table) {
            $table->unsignedBigInteger('commune_id')->nullable(false)->change();
            $table->unsignedBigInteger('wilaya_id')->nullable(false)->change();
            $table->unsignedBigInteger('categorie_id')->nullable(false)->change();
        });
    }
};
