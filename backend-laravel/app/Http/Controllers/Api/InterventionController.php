<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DemandeIntervention;
use App\Models\InterventionPhoto;
use App\Models\Artisan;
use App\Notifications\NewJobNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Notification;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Http\Requests\Intervention\StoreInterventionRequest;
use App\Http\Requests\Intervention\UpdateProgressRequest;
use App\Http\Requests\Intervention\UploadPhotoRequest;

class InterventionController extends Controller
{

    public function store(StoreInterventionRequest $request)
    {
        $user = Auth::user();
        $validated = $request->validated();

        $demande = DB::transaction(function () use ($validated, $user, $request) {
            $demande = DemandeIntervention::create([
                'client_id'    => $user->client->id,
                'categorie_id' => $validated['categorie_id'],
                'wilaya_id'    => $validated['wilaya_id'],
                'commune_id'   => $validated['commune_id'],
                'titre'        => $validated['titre'],
                'description'  => $validated['description'],
                'adresse'      => $validated['adresse'],
                'statut'       => 'en_attente'
            ]);

            if ($request->hasFile('photos')) {
                foreach ($request->file('photos') as $file) {
                    $path = $file->store('demandes', 'public');
                    InterventionPhoto::create([
                        'demande_id' => $demande->id,
                        'url'        => Storage::url($path),
                        'type'       => 'avant'
                    ]);
                }
            }

            return $demande;
        });

        $artisans = Artisan::with('user')
            ->where('categorie_id', $demande->categorie_id)
            ->where('wilaya_id', $demande->wilaya_id)
            ->where('statutValidation', 'valide')
            ->whereHas('user', fn($q) => $q->where('statut', 'actif'))
            ->get();

        if ($artisans->isNotEmpty()) {
            Notification::send($artisans->pluck('user'), new NewJobNotification($demande));
        }

        return response()->json([
            'success' => true,
            'message' => 'Request posted successfully',
            'data' => ['id' => $demande->id]
        ], 201);
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        $artisan = $user->artisan;

        if (!$artisan) {
            return response()->json(['message' => 'Artisan profile not found'], 404);
        }

        $query = DemandeIntervention::where('artisan_id', $artisan->id)
            ->with(['categorie', 'wilaya', 'commune', 'photos', 'client.user']);

        $status = $request->query('status');

        if ($status === 'active') {
            $query->whereIn('statut', ['acceptee', 'en_cours']);
        } elseif ($status === 'history') {
            $query->whereIn('statut', ['terminee', 'annulee']);
        }

        $interventions = $query->orderBy('updated_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $interventions
        ]);
    }

    public function show($id)
    {
        $user = Auth::user();
        $artisan = $user->artisan;

        $intervention = DemandeIntervention::where('id', $id)
            ->where('artisan_id', $artisan->id)
            ->with(['categorie', 'wilaya', 'commune', 'photos', 'client.user'])
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $intervention
        ]);
    }

    public function updateProgress(UpdateProgressRequest $request, $id)
    {
        $user = Auth::user();
        $artisan = $user->artisan;
        $validated = $request->validated();

        $intervention = DemandeIntervention::where('id', $id)
            ->where('artisan_id', $artisan->id)
            ->firstOrFail();

        if ($intervention->statut === 'terminee' || $intervention->statut === 'annulee') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot update a finished or cancelled project'
            ], 422);
        }

        $intervention->update(['statut' => $validated['statut']]);

        return response()->json([
            'success' => true,
            'message' => 'Progress updated successfully',
            'data' => ['statut' => $intervention->statut]
        ]);
    }

    public function uploadPhoto(UploadPhotoRequest $request, $id)
    {
        $user = Auth::user();
        $artisan = $user->artisan;
        $validated = $request->validated();

        $intervention = DemandeIntervention::where('id', $id)
            ->where('artisan_id', $artisan->id)
            ->firstOrFail();

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('interventions', 'public');
            $url = Storage::url($path);

            $photo = InterventionPhoto::create([
                'demande_id' => $intervention->id,
                'url' => $url,
                'type' => $validated['type']
            ]);

            return response()->json([
                'success' => true,
                'data' => $photo
            ], 201);
        }

        return response()->json(['success' => false, 'message' => 'No photo provided'], 400);
    }

    public function deletePhoto($id, $photoId)
    {
        $user = Auth::user();
        $artisan = $user->artisan;

        $intervention = DemandeIntervention::where('id', $id)
            ->where('artisan_id', $artisan->id)
            ->firstOrFail();

        $photo = InterventionPhoto::where('id', $photoId)
            ->where('demande_id', $intervention->id)
            ->firstOrFail();

        if (str_contains($photo->url, '/storage/')) {
            $path = str_replace('/storage/', 'public/', $photo->url);
            Storage::delete($path);
        }

        $photo->delete();

        return response()->json([
            'success' => true,
            'message' => 'Photo deleted successfully'
        ]);
    }

    public function downloadQuote($id)
    {
        $user = Auth::user();
        
        $demande = DemandeIntervention::with(['artisan.user', 'artisan.primaryCategorie', 'client.user', 'wilaya', 'commune'])
            ->findOrFail($id);

        // Verification of access (client who made request or artisan who owns it)
        if ($user->type === 'client' && $demande->client_id !== $user->client->id) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }
        
        if ($user->type === 'artisan' && $demande->artisan_id !== $user->artisan->id) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $pdf = Pdf::loadView('pdf.quote', [
            'demande' => $demande,
            'client' => $demande->client,
            'artisan' => $demande->artisan
        ]);

        return $pdf->download('devis-INT' . $demande->id . '.pdf');
    }
}
