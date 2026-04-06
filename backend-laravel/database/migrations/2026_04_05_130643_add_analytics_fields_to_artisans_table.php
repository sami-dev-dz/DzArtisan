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
        Schema::table('artisans', function (Blueprint $table) {
            $table->unsignedInteger('profile_views_count')->default(0)->after('is_recommended');
            $table->unsignedInteger('contacts_count')->default(0)->after('profile_views_count');
            $table->unsignedInteger('requests_responded_count')->default(0)->after('contacts_count');
            $table->float('avg_response_time_minutes')->default(0)->after('requests_responded_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('artisans', function (Blueprint $table) {
            $table->dropColumn(['profile_views_count', 'contacts_count', 'requests_responded_count', 'avg_response_time_minutes']);
        });
    }
};
