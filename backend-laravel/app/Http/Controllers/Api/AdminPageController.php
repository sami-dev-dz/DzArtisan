<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminPageController extends Controller
{
    private function guardAdmin()
    {
        if (Auth::user()?->type !== 'admin') {
            abort(403, 'Accès réservé aux administrateurs.');
        }
    }

    /**
     * List all pages (admin view — includes unpublished).
     */
    public function index()
    {
        $this->guardAdmin();
        $pages = Page::orderBy('slug')->get(['id', 'slug', 'title_fr', 'title_ar', 'is_published', 'updated_at']);
        return response()->json($pages);
    }

    /**
     * Show a single page.
     */
    public function show($id)
    {
        $this->guardAdmin();
        $page = Page::findOrFail($id);
        return response()->json($page);
    }

    /**
     * Create a new static page.
     */
    public function store(Request $request)
    {
        $this->guardAdmin();

        $validated = $request->validate([
            'slug'       => 'required|string|max:100|unique:pages,slug|regex:/^[a-z0-9\-]+$/',
            'title_fr'   => 'required|string|max:200',
            'title_ar'   => 'required|string|max:200',
            'content_fr' => 'nullable|string',
            'content_ar' => 'nullable|string',
            'is_published' => 'boolean',
        ]);

        $page = Page::create($validated);
        return response()->json($page, 201);
    }

    /**
     * Update an existing static page.
     */
    public function update(Request $request, $id)
    {
        $this->guardAdmin();
        $page = Page::findOrFail($id);

        $validated = $request->validate([
            'slug'       => 'sometimes|string|max:100|unique:pages,slug,' . $id . '|regex:/^[a-z0-9\-]+$/',
            'title_fr'   => 'sometimes|string|max:200',
            'title_ar'   => 'sometimes|string|max:200',
            'content_fr' => 'nullable|string',
            'content_ar' => 'nullable|string',
            'is_published' => 'boolean',
        ]);

        $page->update($validated);
        return response()->json($page);
    }

    /**
     * Delete a static page.
     */
    public function destroy($id)
    {
        $this->guardAdmin();
        $page = Page::findOrFail($id);
        $page->delete();
        return response()->json(['message' => 'Page supprimée.']);
    }
}
