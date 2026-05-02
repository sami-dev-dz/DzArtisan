<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wilaya;
use App\Models\Commune;
use App\Models\CategorieMetier;
use App\Models\Artisan;
use App\Models\Page;
use Illuminate\Http\Request;

class PublicController extends Controller
{

    public function getWilayas()
    {
        $wilayas = \Illuminate\Support\Facades\Cache::remember('wilayas_all', 86400, function () {
            return Wilaya::all();
        });
        return response()->json($wilayas);
    }

    public function getCommunes($wilayaId)
    {
        $communes = \Illuminate\Support\Facades\Cache::remember("communes_wilaya_{$wilayaId}", 86400, function () use ($wilayaId) {
            return Commune::where('wilaya_id', $wilayaId)->get();
        });
        return response()->json($communes);
    }

    public function getMetiers()
    {
        $categories = \Illuminate\Support\Facades\Cache::remember('categories_with_count', 3600, function () {
            return CategorieMetier::withCount('artisans')->get();
        });
        return response()->json($categories);
    }

    public function getArtisans(Request $request)
    {
        $query = Artisan::select('artisans.*')
            ->with(['user', 'primaryWilaya', 'commune', 'primaryCategorie'])
            ->where('statutValidation', 'valide'); 

        $query->filter($request->all());

        if ($request->has(['lat', 'lng'])) {
            $query->orderByDistance($request->lat, $request->lng);
        } else {

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

        $artisans = $query->paginate(12);

        return response()->json($artisans);
    }

    public function getArtisanBySlug($slug)
    {
        $artisan = Artisan::with(['user', 'primaryWilaya', 'commune', 'primaryCategorie', 'avis.user', 'wilayas', 'categories', 'portfolio', 'unavailabilities'])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($artisan);
    }

    /**
     * Return all published pages (for navigation menus, etc.).
     */
    public function getPages()
    {
        $pages = Page::where('is_published', true)
            ->orderBy('slug')
            ->get(['id', 'slug', 'title_fr', 'title_ar']);
        return response()->json($pages);
    }

    /**
     * Return a single published page by slug.
     */
    public function getPage($slug)
    {
        $page = Page::where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();
        return response()->json($page);
    }

    /**
     * Return lightweight data for Next.js sitemap generation.
     */
    public function getSitemapData()
    {
        $artisans = Artisan::where('statutValidation', 'valide')
            ->select('slug', 'updated_at')
            ->get();
            
        $pages = Page::where('is_published', true)
            ->select('slug', 'updated_at')
            ->get();

        return response()->json([
            'artisans' => $artisans,
            'pages' => $pages
        ]);
    }
}
