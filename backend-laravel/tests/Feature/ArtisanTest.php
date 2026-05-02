<?php

use App\Models\User;
use App\Models\ArtisanProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('public artisans list can be fetched', function () {
    $user = User::factory()->create(['role' => 'artisan']);
    ArtisanProfile::factory()->create([
        'user_id' => $user->id,
        'statutValidation' => 'valide',
        'disponibilite' => 'disponible',
    ]);

    $response = $this->getJson('/api/v1/artisans/public');

    $response->assertStatus(200)
             ->assertJsonStructure([
                 'data' => [
                     '*' => ['id', 'user', 'primary_categorie', 'primary_wilaya']
                 ]
             ]);
});

test('can fetch artisan profile by slug', function () {
    $user = User::factory()->create(['role' => 'artisan']);
    $artisan = ArtisanProfile::factory()->create([
        'user_id' => $user->id,
        'slug' => 'test-artisan-123',
        'statutValidation' => 'valide',
    ]);

    $response = $this->getJson('/api/v1/artisans/slug/test-artisan-123');

    $response->assertStatus(200)
             ->assertJsonPath('slug', 'test-artisan-123');
});
