<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('artisans', function (Blueprint $table) {
            $table->boolean('phone_visible_to_clients')->default(true)->after('id');
        });
    }

    public function down(): void
    {
        Schema::table('artisans', function (Blueprint $table) {
            $table->dropColumn('phone_visible_to_clients');
        });
    }
};
