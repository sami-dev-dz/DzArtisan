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

    public function getWilayas()
    {
        return response()->json(Wilaya::all());
    }

    public function getCommunes($wilayaId)
    {
        $communes = Commune::where('wilaya_id', $wilayaId)->get();
        return response()->json($communes);
    }

    public function getMetiers()
    {
        $categories = CategorieMetier::withCount('artisans')->get();
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
        $artisan = Artisan::with(['user', 'primaryWilaya', 'commune', 'primaryCategorie', 'avis.user', 'wilayas', 'categories'])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($artisan);
    }
}
