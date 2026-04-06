<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('artisans', function (Blueprint $table) {
            $table->decimal('latitude', 10, 8)->nullable()->after('wilaya_id');
            $table->decimal('longitude', 11, 8)->nullable()->after('latitude');
            $table->string('slug')->unique()->nullable()->after('description');
        });

        Schema::table('categorie_metiers', function (Blueprint $table) {
            $table->string('slug')->unique()->nullable()->after('nom');
        });
    }

    public function down(): void
    {
        Schema::table('categorie_metiers', function (Blueprint $table) {
            $table->dropColumn('slug');
        });

        Schema::table('artisans', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude', 'slug']);
        });
    }
};
