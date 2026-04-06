<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('demandes_interventions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->foreignId('artisan_id')->nullable()->constrained('artisans')->onDelete('set null');
            $table->foreignId('categorie_id')->constrained('categorie_metiers')->onDelete('cascade');
            $table->string('titre');
            $table->text('description');
            $table->enum('statut', ['ouvert', 'en_cours', 'termine', 'annule'])->default('ouvert');
            $table->decimal('budget_estime', 10, 2)->nullable();
            $table->timestamp('date_souhaitee')->nullable();
            $table->foreignId('wilaya_id')->constrained('wilayas')->onDelete('cascade');
            $table->foreignId('commune_id')->constrained('communes')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('intervention_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('demande_id')->constrained('demandes_interventions')->onDelete('cascade');
            $table->string('url');
            $table->enum('type', ['avant', 'apres'])->default('avant');
            $table->timestamps();
        });

        Schema::create('avis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('demande_id')->constrained('demandes_interventions')->onDelete('cascade');
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->foreignId('artisan_id')->constrained('artisans')->onDelete('cascade');
            $table->unsignedTinyInteger('note');
            $table->text('commentaire')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('avis');
        Schema::dropIfExists('intervention_photos');
        Schema::dropIfExists('demandes_interventions');
    }
};
