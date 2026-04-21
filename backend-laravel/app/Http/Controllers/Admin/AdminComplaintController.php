<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reclamation;
use App\Models\ReclamationAction;
use App\Models\User;
use App\Notifications\ComplaintNotification;
use App\Mail\ComplaintWarning;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class AdminComplaintController extends Controller
{

    public function index(Request $request)
    {
        $status = $request->query('status', 'tous');
        $search = $request->query('search');

        $query = Reclamation::with(['demandeur', 'accuse', 'photos'])
            ->withCount('photos')
            ->orderBy('created_at', 'desc');

        if ($status !== 'tous') {
            $query->where('statut', $status);
        }

        if ($search) {
            $query->whereHas('demandeur', function($q) use ($search) {
                $q->where('nomComplet', 'like', "%{$search}%");
            })->orWhereHas('accuse', function($q) use ($search) {
                $q->where('nomComplet', 'like', "%{$search}%");
            });
        }

        $complaints = $query->paginate(15);

        $stats = [
            'nouveau' => Reclamation::where('statut', 'nouveau')->count(),
            'en_cours' => Reclamation::where('statut', 'en_cours')->count(),
            'resolu' => Reclamation::where('statut', 'resolu')->count(),
            'rejete' => Reclamation::where('statut', 'rejete')->count(),
        ];

        return response()->json([
            'complaints' => $complaints,
            'stats' => $stats
        ]);
    }

    public function show(Reclamation $reclamation)
    {
        $reclamation->load(['demandeur', 'accuse', 'photos', 'intervention', 'actions.admin']);

        $accusedStrikes = 0;
        if ($reclamation->accuse->role === 'artisan') {
            $accusedStrikes = Reclamation::where('accuse_id', $reclamation->accuse_id)
                ->where('statut', 'resolu') 
                ->count();
        }

        return response()->json([
            'complaint' => $reclamation,
            'accused_strikes' => $accusedStrikes
        ]);
    }

    public function updateStatus(Request $request, Reclamation $reclamation)
    {
        $validated = $request->validate([
            'status' => 'required|in:nouveau,en_cours,resolu,rejete',
            'notes' => 'nullable|string'
        ]);

        $oldStatus = $reclamation->statut;
        $reclamation->statut = $validated['status'];
        $reclamation->save();

        ReclamationAction::create([
            'reclamation_id' => $reclamation->id,
            'admin_id' => Auth::id(),
            'action' => "Status changed from {$oldStatus} to {$validated['status']}",
            'notes' => $validated['notes'] ?? null
        ]);

        $statusMap = [
            'en_cours' => 'in_progress',
            'resolu'   => 'resolved',
            'rejete'   => 'rejected'
        ];

        if (isset($statusMap[$reclamation->statut])) {
            $reclamation->demandeur->notify(new ComplaintNotification($statusMap[$reclamation->statut], $reclamation->id));
        }

        return response()->json([
            'message' => 'Status updated successfully',
            'complaint' => $reclamation
        ]);
    }

    public function addNote(Request $request, Reclamation $reclamation)
    {
        $validated = $request->validate([
            'notes' => 'required|string'
        ]);

        ReclamationAction::create([
            'reclamation_id' => $reclamation->id,
            'admin_id' => Auth::id(),
            'action' => 'Note added',
            'notes' => $validated['notes']
        ]);

        return response()->json([
            'message' => 'Internal note added'
        ]);
    }

    public function warn(Request $request, Reclamation $reclamation)
    {
        $validated = $request->validate([
            'message' => 'required|string'
        ]);

        $reclamation->accuse->notify(new ComplaintNotification('warning', $reclamation->id));

        ReclamationAction::create([
            'reclamation_id' => $reclamation->id,
            'admin_id' => Auth::id(),
            'action' => 'Warning sent',
            'notes' => "Message sent to user: " . $validated['message']
        ]);

        return response()->json([
            'message' => 'Warning recorded and sent to user'
        ]);
    }

    public function suspend(Request $request, Reclamation $reclamation)
    {
        $validated = $request->validate([
            'reason' => 'required|string'
        ]);

        $accused = $reclamation->accuse;
        $accused->account_status = 'suspended'; 
        $accused->save();

        $accused->notify(new ComplaintNotification('warning', $reclamation->id)); 

        ReclamationAction::create([
            'reclamation_id' => $reclamation->id,
            'admin_id' => Auth::id(),
            'action' => 'Account suspended',
            'notes' => $validated['reason']
        ]);

        return response()->json([
            'message' => 'User account suspended'
        ]);
    }
}
