<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('abonnements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('artisan_id')->constrained('artisans')->onDelete('cascade');
            $table->enum('plan', ['gratuit', 'premium', 'gold']);
            $table->enum('statut', ['actif', 'expire', 'en_attente'])->default('en_attente');
            $table->timestamp('date_debut')->nullable();
            $table->timestamp('date_fin')->nullable();
            $table->timestamps();
        });

        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('abonnement_id')->constrained('abonnements')->onDelete('cascade');
            $table->decimal('montant', 10, 2);
            $table->string('transaction_id')->unique()->nullable();
            $table->enum('methode', ['chargily', 'satim', 'virement'])->default('chargily');
            $table->enum('statut', ['succes', 'echec', 'en_attente'])->default('en_attente');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paiements');
        Schema::dropIfExists('abonnements');
    }
};
