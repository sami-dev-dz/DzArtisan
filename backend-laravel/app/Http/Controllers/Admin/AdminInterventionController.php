<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DemandeIntervention;
use Illuminate\Http\Request;

class AdminInterventionController extends Controller
{

    public function index(Request $request)
    {
        $stats = [
            'total' => DemandeIntervention::count(),
            'active' => DemandeIntervention::where('statut', 'en_cours')->count(),
            'completed' => DemandeIntervention::where('statut', 'termine')->count(),
        ];
        $query = DemandeIntervention::with([
            'client.user', 
            'artisan.user', 
            'wilaya', 
            'commune', 
            'categorie'
        ]);

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('statut', $request->status);
        }

        if ($request->has('search') && !empty($request->search)) {
            $search = strtolower($request->search);
            $query->where(function($q) use ($search) {
                $q->whereRaw('LOWER(titre) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(description) LIKE ?', ["%{$search}%"]);
            });
        }

        $query->orderBy('created_at', 'desc');

        $interventions = $query->paginate(15);

        return response()->json([
            'success' => true,
            'stats' => $stats,
            'data' => $interventions->items(),
            'current_page' => $interventions->currentPage(),
            'last_page' => $interventions->lastPage(),
            'total' => $interventions->total()
        ]);
    }
}
