<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Artisan;
use App\Models\CategorieMetier;
use Illuminate\Support\Str;

class SlugUpdaterSeeder extends Seeder
{
    public function run(): void
    {
        // Update Categories
        CategorieMetier::all()->each(function ($cat) {
            $cat->update(['slug' => Str::slug($cat->nom)]);
        });

        // Update Artisans
        Artisan::with('user', 'primaryCategorie')->get()->each(function ($artisan) {
            $name = $artisan->user->nomComplet ?? 'artisan';
            $category = $artisan->primary_categorie->nom ?? 'expert';
            $artisan->update([
                'slug' => Str::slug($name . '-' . $category . '-' . Str::random(5)),
                // Add some dummy coordinates for Algiers if missing for map testing
                'latitude' => $artisan->latitude ?? (36.7 + (rand(-100, 100) / 1000)),
                'longitude' => $artisan->longitude ?? (3.0 + (rand(-100, 100) / 1000)),
            ]);
        });
    }
}
