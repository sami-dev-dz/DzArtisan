<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{

    public function index(Request $request)
    {
        $user = Auth::user();

        $limit = $request->query('limit', 10);
        $paginated = $request->query('paginated', false);

        if ($paginated) {
            $notifications = $user->notifications()->paginate(20);
        } else {
            $notifications = $user->notifications()->limit($limit)->get();
        }

        return response()->json([
            'notifications' => $notifications,
            'unread_count'  => $user->unreadNotifications()->count()
        ]);
    }

    public function markAsRead($id)
    {
        $notification = Auth::user()
            ->notifications()
            ->where('id', $id)
            ->firstOrFail();

        $notification->markAsRead();

        return response()->json(['message' => 'Notification marked as read']);
    }

    public function markAllAsRead()
    {
        Auth::user()->unreadNotifications->markAsRead();

        return response()->json(['message' => 'All notifications marked as read']);
    }
}
