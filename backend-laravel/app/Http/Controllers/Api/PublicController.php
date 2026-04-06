<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wilaya;
use App\Models\Commune;
use App\Models\CategorieMetier;
use App\Models\Artisan;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    /**
     * Liste des Wilayas
     */
    public function getWilayas()
    {
        return response()->json(Wilaya::all());
    }

    /**
     * Communes d'une Wilaya
     */
    public function getCommunes($wilayaId)
    {
        $communes = Commune::where('wilaya_id', $wilayaId)->get();
        return response()->json($communes);
    }

    /**
     * Liste des métiers / catégories avec counts
     */
    public function getMetiers()
    {
        $categories = CategorieMetier::withCount('artisans')->get();
        return response()->json($categories);
    }

    /**
     * Liste avancée des artisans (Recherche & Filtres)
     */
    public function getArtisans(Request $request)
    {
        $query = Artisan::select('artisans.*')
            ->with(['user', 'primaryWilaya', 'commune', 'primaryCategorie'])
            ->where('statutValidation', 'valide'); // Only show approved artisans


        // Filters from Model Scope
        $query->filter($request->all());

        // Sort by Location
        if ($request->has(['lat', 'lng'])) {
            $query->orderByDistance($request->lat, $request->lng);
        } else {
            // Default sorting
            match($request->sort) {
                'rating' => $query->orderByDesc(function($q) {
                    $q->selectRaw('avg(note)')
                      ->from('avis')
                      ->whereColumn('artisan_id', 'artisans.id');
                }),
                'experience' => $query->orderByDesc('anneesExp'),
                'name' => $query->join('users', 'artisans.user_id', '=', 'users.id')->orderBy('users.nomComplet'),
                default => $query->latest()
            };
        }

        // Pagination (Step 13 requirement: 12 per page)
        $artisans = $query->paginate(12);

        return response()->json($artisans);
    }

    /**
     * Profil public d'un artisan (via Slug)
     */
    public function getArtisanBySlug($slug)
    {
        $artisan = Artisan::with(['user', 'primaryWilaya', 'commune', 'primaryCategorie', 'avis.user', 'wilayas', 'categories'])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($artisan);
    }
}
