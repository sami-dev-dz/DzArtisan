<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Artisan;
use App\Models\Wilaya;
use App\Models\DemandeIntervention;
use App\Models\CategorieMetier;
use App\Models\Avis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;

class AdminStatsController extends Controller
{
    /**
     * Ensure caller is admin
     */
    private function guardAdmin()
    {
        if (Auth::user()?->type !== 'admin') {
            abort(403, 'Accès réservé aux administrateurs.');
        }
    }

    /**
     * Get all aggregated data for the statistics dashboard
     */
    public function index()
    {
        $this->guardAdmin();

        $now = now();
        $last12Months = [];
        for ($i = 11; $i >= 0; $i--) {
            $month = $now->copy()->subMonths($i);
            $last12Months[] = [
                'month' => $month->format('Y-m'),
                'label' => $month->translatedFormat('M Y'),
            ];
        }

        // 1. Wilaya Activity (Map Data)
        $wilayaActivity = Wilaya::select('id', 'nom')
            ->withCount('communes')
            ->get()
            ->map(function($w) {
                $requestCount = DemandeIntervention::where('wilaya_id', $w->id)->count();
                $artisanCount = Artisan::where('wilaya_id', $w->id)->count();

                // Get most requested category in this wilaya
                $topCategory = DemandeIntervention::where('wilaya_id', $w->id)
                    ->select('categorie_id', DB::raw('count(*) as total'))
                    ->groupBy('categorie_id')
                    ->orderByDesc('total')
                    ->with('categorie:id,nom')
                    ->first();

                return [
                    'id' => $w->id,
                    'nom' => $w->nom,
                    'requests_count' => $requestCount,
                    'artisans_count' => $artisanCount,
                    'top_category' => $topCategory?->categorie?->nom ?? 'N/A',
                    'activity_level' => $this->calculateActivityLevel($requestCount)
                ];
            });

        // 2. Top 10 Wilayas (Bar Chart)
        $topWilayas = DemandeIntervention::select('wilaya_id', DB::raw('count(*) as total'))
            ->groupBy('wilaya_id')
            ->orderByDesc('total')
            ->limit(10)
            ->with('wilaya:id,nom')
            ->get()
            ->map(fn($r) => [
                'name' => $r->wilaya?->nom ?? 'Inconnu',
                'requests' => $r->total
            ]);

        // 3. Category Distribution (Donut Chart)
        $categoryDistribution = DemandeIntervention::select('categorie_id', DB::raw('count(*) as total'))
            ->groupBy('categorie_id')
            ->orderByDesc('total')
            ->limit(8) // Top 8 + others
            ->with('categorie:id,nom')
            ->get()
            ->map(fn($r) => [
                'name' => $r->categorie?->nom ?? 'Autre',
                'value' => $r->total
            ]);

        // 4. Satisfaction Trends (Line Chart)
        $satisfactionTrends = [];
        foreach($last12Months as $m) {
            $avg = Avis::whereRaw("DATE_FORMAT(created_at, '%Y-%m') = ?", [$m['month']])->avg('note');
            $satisfactionTrends[] = [
                'month' => $m['label'],
                'rating' => round($avg ?? 0, 1)
            ];
        }

        // 5. Conversion Metrics
        $globalViews = Artisan::sum('profile_views_count');
        $globalContacts = Artisan::sum('contacts_count');
        $globalRequests = DemandeIntervention::count();
        $globalResponses = Artisan::sum('requests_responded_count');

        $conversionMetrics = [
            'view_to_contact' => $globalViews > 0 ? round(($globalContacts / $globalViews) * 100, 1) : 0,
            'request_to_response' => $globalRequests > 0 ? round(($globalResponses / $globalRequests) * 100, 1) : 0,
        ];

        return response()->json([
            'wilaya_activity' => $wilayaActivity,
            'top_wilayas' => $topWilayas,
            'category_distribution' => $categoryDistribution,
            'satisfaction_trends' => $satisfactionTrends,
            'conversion_metrics' => $conversionMetrics,
        ]);
    }

    /**
     * Get artisan ranking by response rate
     */
    public function artisanRanking(Request $request)
    {
        $this->guardAdmin();

        $artisans = Artisan::with(['user:id,nomComplet', 'primaryCategorie:id,nom'])
            ->orderBy('avg_response_time_minutes', 'asc') // Faster is better
            ->paginate(20);

        return response()->json($artisans);
    }

    /**
     * Export all artisan performance data as CSV
     */
    public function exportCSV()
    {
        $this->guardAdmin();

        $filename = "artisans_performance_" . now()->format('Y-m-d_H-i') . ".csv";
        $headers = [
            "Content-type"        => "text/csv; charset=UTF-8",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['ID', 'Artisan', 'Catégorie', 'Vues Profil', 'Contacts', 'Taux Conv (%)', 'Temps Réponse (min)', 'Demandes Répondues'];

        $callback = function() use ($columns) {
            $file = fopen('php://output', 'w');
            // Fix for Excel UTF-8
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            fputcsv($file, $columns, ';');

            Artisan::with(['user:id,nomComplet', 'primaryCategorie:id,nom'])
                ->chunk(100, function($artisans) use ($file) {
                    foreach ($artisans as $a) {
                        $convRate = $a->profile_views_count > 0 
                            ? round(($a->contacts_count / $a->profile_views_count) * 100, 2) 
                            : 0;

                        fputcsv($file, [
                            $a->id,
                            $a->user?->nomComplet,
                            $a->primaryCategorie?->nom,
                            $a->profile_views_count,
                            $a->contacts_count,
                            $convRate,
                            round($a->avg_response_time_minutes, 1),
                            $a->requests_responded_count
                        ], ';');
                    }
                });

            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }

    /**
     * Simple activity level calculation for choropleth colors
     */
    private function calculateActivityLevel($count)
    {
        if ($count > 100) return 4; // High
        if ($count > 50)  return 3;
        if ($count > 10)  return 2;
        if ($count > 0)   return 1;
        return 0; // None
    }
}
