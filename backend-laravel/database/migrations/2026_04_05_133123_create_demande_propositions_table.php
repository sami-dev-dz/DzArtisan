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
        Schema::create('demande_propositions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('demande_id')->constrained('demandes_interventions')->onDelete('cascade');
            $table->foreignId('artisan_id')->constrained('artisans')->onDelete('cascade');
            $table->text('message')->nullable();
            $table->string('statut')->default('en_attente'); // en_attente, acceptee, rejetee
            $table->timestamps();

            // Un artisan ne peut postuler qu'une seule fois par demande
            $table->unique(['demande_id', 'artisan_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('demande_propositions');
    }
};
