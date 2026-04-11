<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Change enum to string to avoid strict data truncation errors and support
        // all custom statuses (en_attente, acceptee, terminee, annulee, etc)
        DB::statement("ALTER TABLE demandes_interventions MODIFY statut VARCHAR(50) DEFAULT 'en_attente'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // We leave it as a string to preserve the new states
    }
};
