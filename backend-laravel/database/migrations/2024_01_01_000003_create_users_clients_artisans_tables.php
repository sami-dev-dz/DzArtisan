<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wilayas', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->timestamps();
        });

        Schema::create('communes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wilaya_id')->constrained('wilayas')->onDelete('cascade');
            $table->string('nom');
            $table->timestamps();
        });

        Schema::create('categorie_metiers', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('icone')->nullable();
            $table->timestamps();
        });

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nomComplet');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('telephone')->nullable();
            $table->enum('type', ['client', 'artisan', 'admin']);
            $table->enum('statut', ['actif', 'suspendu', 'supprime'])->default('actif');
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('typeAuth', ['email', 'google'])->default('email');
            $table->string('googleId')->nullable();
            $table->string('lienWhatsApp')->nullable();
            $table->foreignId('wilaya_id')->constrained('wilayas')->onDelete('cascade');
            $table->foreignId('commune_id')->constrained('communes')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('artisans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('categorie_id')->constrained('categorie_metiers')->onDelete('cascade');
            $table->string('lienWhatsApp')->nullable();
            $table->string('photo')->nullable();
            $table->text('description')->nullable();
            $table->integer('anneesExp')->default(0);
            $table->enum('disponibilite', ['disponible', 'indisponible'])->default('disponible');
            $table->enum('statutValidation', ['en_attente', 'valide', 'refuse'])->default('en_attente');
            $table->timestamp('dateValidation')->nullable();
            $table->foreignId('wilaya_id')->constrained('wilayas')->onDelete('cascade');
            $table->foreignId('commune_id')->constrained('communes')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('artisans');
        Schema::dropIfExists('clients');
        Schema::dropIfExists('users');
        Schema::dropIfExists('categorie_metiers');
        Schema::dropIfExists('communes');
        Schema::dropIfExists('wilayas');
    }
};
