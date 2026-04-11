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
        Schema::table('demandes_interventions', function (Blueprint $table) {
            $table->string('telephone')->nullable()->after('longitude');
            $table->string('whatsapp')->nullable()->after('telephone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('demandes_interventions', function (Blueprint $table) {
            $table->dropColumn(['telephone', 'whatsapp']);
        });
    }
};
