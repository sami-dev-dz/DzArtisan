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
        Schema::create('reclamations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('demandeur_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('accuse_id')->constrained('users')->onDelete('cascade');
            $table->enum('type', ['client_vers_artisan', 'artisan_vers_client']);
            $table->string('categorie'); // e.g., 'retard', 'mauvaise_prestation', 'impolitesse', 'fraude'
            $table->text('description');
            $table->enum('statut', ['nouveau', 'en_cours', 'resolu', 'rejete'])->default('nouveau');
            $table->foreignId('intervention_id')->nullable()->constrained('demandes_interventions')->onDelete('set null');
            $table->text('notes_admin')->nullable();
            $table->timestamps();
        });

        Schema::create('reclamation_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reclamation_id')->constrained('reclamations')->onDelete('cascade');
            $table->string('url');
            $table->timestamps();
        });

        Schema::create('reclamation_actions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reclamation_id')->constrained('reclamations')->onDelete('cascade');
            $table->foreignId('admin_id')->constrained('users')->onDelete('cascade');
            $table->string('action'); // e.g., 'status_change', 'warning_sent', 'internal_note', 'suspension'
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reclamation_actions');
        Schema::dropIfExists('reclamation_photos');
        Schema::dropIfExists('reclamations');
    }
};
