<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('artisans', function (Blueprint $table) {
            // New fields for professional profile
            $table->string('experience_level')->nullable(); // Beginner, 1-3, 3-5, 5-10, 10+
            $table->string('diploma_url')->nullable();
            $table->string('artisan_card_url')->nullable();
            
            // Note: We keep categorie_id and wilaya_id for 'primary' location/service,
            // or we could make them nullable if we exclusively use pivot tables.
            $table->foreignId('categorie_id')->nullable()->change();
            $table->foreignId('wilaya_id')->nullable()->change();
            $table->foreignId('commune_id')->nullable()->change();
        });

        // Pivot table for multiple categories
        Schema::create('artisan_categorie', function (Blueprint $table) {
            $table->id();
            $table->foreignId('artisan_id')->constrained('artisans')->onDelete('cascade');
            $table->foreignId('categorie_id')->constrained('categorie_metiers')->onDelete('cascade');
            $table->timestamps();
        });

        // Pivot table for multiple wilayas
        Schema::create('artisan_wilaya', function (Blueprint $table) {
            $table->id();
            $table->foreignId('artisan_id')->constrained('artisans')->onDelete('cascade');
            $table->foreignId('wilaya_id')->constrained('wilayas')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('artisan_wilaya');
        Schema::dropIfExists('artisan_categorie');
        
        Schema::table('artisans', function (Blueprint $table) {
            $table->dropColumn(['experience_level', 'diploma_url', 'artisan_card_url']);
        });
    }
};
