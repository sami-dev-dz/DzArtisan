<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('user can login with valid credentials', function () {
    $user = User::factory()->create([
        'email' => 'test@dzartisan.dz',
        'password' => bcrypt('password123'),
        'role' => 'client',
    ]);

    $response = $this->postJson('/api/v1/login', [
        'email' => 'test@dzartisan.dz',
        'password' => 'password123',
    ]);

    $response->assertStatus(200)
             ->assertJsonStructure([
                 'access_token',
                 'token_type',
                 'user' => ['id', 'email', 'role']
             ]);
});

test('user cannot login with invalid password', function () {
    $user = User::factory()->create([
        'email' => 'test@dzartisan.dz',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->postJson('/api/v1/login', [
        'email' => 'test@dzartisan.dz',
        'password' => 'wrongpassword',
    ]);

    $response->assertStatus(401);
});
