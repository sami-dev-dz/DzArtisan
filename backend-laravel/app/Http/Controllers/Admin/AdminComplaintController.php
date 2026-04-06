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
    /**
     * Display a listing of complaints with advanced filtering and search.
     */
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
                $q->where('name', 'like', "%{$search}%");
            })->orWhereHas('accuse', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $complaints = $query->paginate(15);

        // Stats for the dashboard
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

    /**
     * Display the specified complaint with full history.
     */
    public function show(Reclamation $reclamation)
    {
        $reclamation->load(['demandeur', 'accuse', 'photos', 'intervention', 'actions.admin']);

        // Check if the accused (if artisan) has multiple validated complaints
        $accusedStrikes = 0;
        if ($reclamation->accuse->role === 'artisan') {
            $accusedStrikes = Reclamation::where('accuse_id', $reclamation->accuse_id)
                ->where('statut', 'resolu') // We consider resolved = complaint was valid/action taken
                ->count();
        }

        return response()->json([
            'complaint' => $reclamation,
            'accused_strikes' => $accusedStrikes
        ]);
    }

    /**
     * Update the status of a complaint and log the action.
     */
    public function updateStatus(Request $request, Reclamation $reclamation)
    {
        $validated = $request->validate([
            'status' => 'required|in:nouveau,en_cours,resolu,rejete',
            'notes' => 'nullable|string'
        ]);

        $oldStatus = $reclamation->statut;
        $reclamation->statut = $validated['status'];
        $reclamation->save();

        // Create audit log
        ReclamationAction::create([
            'reclamation_id' => $reclamation->id,
            'admin_id' => Auth::id(),
            'action' => "Status changed from {$oldStatus} to {$validated['status']}",
            'notes' => $validated['notes'] ?? null
        ]);

        // Notify User
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

    /**
     * Add an internal note to the complaint audit trail.
     */
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

    /**
     * Send a warning to the accused party.
     */
    public function warn(Request $request, Reclamation $reclamation)
    {
        $validated = $request->validate([
            'message' => 'required|string'
        ]);

        // In a real app, send email:
        // Mail::to($reclamation->accuse->email)->send(new ComplaintWarning($reclamation, $validated['message']));

        // Notify User
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

    /**
     * Suspend the accused user's account.
     */
    public function suspend(Request $request, Reclamation $reclamation)
    {
        $validated = $request->validate([
            'reason' => 'required|string'
        ]);

        $accused = $reclamation->accuse;
        $accused->account_status = 'suspended'; // Assuming this field exists
        $accused->save();

        // Notify User
        $accused->notify(new ComplaintNotification('warning', $reclamation->id)); // Using warning/suspended context

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
