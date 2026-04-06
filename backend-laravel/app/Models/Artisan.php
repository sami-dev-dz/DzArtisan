<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class Artisan extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'wilaya_id',
        'commune_id',
        'categorie_id',
        'telephone',
        'description',
        'anneesExp',
        'experience_level',
        'diploma_url',
        'artisan_card_url',
        'disponibilite',
        'statutValidation',
        'lienWhatsApp',
        'photo',
        'latitude',
        'longitude',
        'slug',
        'rejection_reason',
        'suspension_reason',
        'is_featured',
        'is_recommended'
    ];

    protected $appends = ['average_rating', 'reviews_count', 'completeness', 'documents_count'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function categories()
    {
        return $this->belongsToMany(CategorieMetier::class, 'artisan_categorie', 'artisan_id', 'categorie_id');
    }

    public function wilayas()
    {
        return $this->belongsToMany(Wilaya::class, 'artisan_wilaya', 'artisan_id', 'wilaya_id');
    }

    /**
     * Get requests that match the artisan's category and wilayas
     */
    public function matchingRequests()
    {
        return DemandeIntervention::where('categorie_id', $this->categorie_id)
            ->whereIn('wilaya_id', $this->wilayas()->pluck('wilayas.id'));
    }

    public function primaryWilaya()
    {
        return $this->belongsTo(Wilaya::class, 'wilaya_id');
    }

    public function commune()
    {
        return $this->belongsTo(Commune::class);
    }

    public function primaryCategorie()
    {
        return $this->belongsTo(CategorieMetier::class, 'categorie_id');
    }

    public function avis()
    {
        return $this->hasMany(Avis::class);
    }

    public function abonnement()
    {
        return $this->hasOne(Abonnement::class);
    }

    /**
     * Average Rating Accessor
     */
    public function getAverageRatingAttribute()
    {
        return round($this->avis()->avg('note') ?? 0, 1);
    }

    /**
     * Reviews Count Accessor
     */
    public function getReviewsCountAttribute()
    {
        return $this->avis()->count();
    }

    /**
     * Slug logic
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($artisan) {
            if (empty($artisan->slug)) {
                $name = $artisan->user->nomComplet ?? 'artisan';
                $category = $artisan->primaryCategorie->nom ?? 'expert';
                $artisan->slug = Str::slug($name . '-' . $category . '-' . Str::random(5));
            }
        });
    }

    /**
     * Advanced Search Filter Scope
     */
    public function scopeFilter($query, array $filters)
    {
        // Search Name or Category (q)
        $query->when($filters['q'] ?? null, function ($query, $search) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('nomComplet', 'like', '%' . $search . '%');
            })->orWhereHas('primaryCategorie', function ($q) use ($search) {
                $q->where('nom', 'like', '%' . $search . '%');
            });
        });

        // Categories (array)
        $query->when($filters['categories'] ?? null, function ($query, $categories) {
            $query->whereIn('categorie_id', $categories);
        });

        // Wilaya
        $query->when($filters['wilaya_id'] ?? null, function ($query, $wilayaId) {
            $query->where('wilaya_id', $wilayaId);
        });

        // Availability
        $query->when($filters['available_only'] ?? null, function ($query) {
            $query->where('disponibilite', 'disponible');
        });

        // Min Rating
        $query->when($filters['min_rating'] ?? null, function ($query, $rating) {
            $query->where(function($q) use ($rating) {
                $q->selectRaw('avg(note)')
                  ->from('avis')
                  ->whereColumn('artisan_id', 'artisans.id');
            }, '>=', $rating);
        });

        // Experience Ranges
        $query->when($filters['experience'] ?? null, function ($query, $exp) {
            match($exp) {
                'beginner' => $query->where('anneesExp', '<', 1),
                '1-3' => $query->whereBetween('anneesExp', [1, 3]),
                '3-5' => $query->whereBetween('anneesExp', [3, 5]),
                '5-10' => $query->whereBetween('anneesExp', [5, 10]),
                '10+' => $query->where('anneesExp', '>', 10),
                default => null
            };
        });

        return $query;
    }

    /**
     * Distance Scope (Haversine)
     */
    public function scopeOrderByDistance($query, $lat, $lng)
    {
        $haversine = "(6371 * acos(cos(radians($lat)) * cos(radians(latitude)) * cos(radians(longitude) - radians($lng)) + sin(radians($lat)) * sin(radians(latitude))))";
        
        return $query->select('artisans.*')
            ->selectRaw("$haversine AS distance")
            ->orderBy('distance');
    }

    /**
     * Logic for profile completeness %
     */
    public function getCompletenessAttribute()
    {
        $score = 0;

        // 1. Photo (20%)
        if ($this->photo) $score += 20;

        // 2. WhatsApp (10%)
        if ($this->lienWhatsApp) $score += 10;

        // 3. Description > 150 chars (20%)
        if ($this->description && strlen($this->description) >= 150) {
            $score += 20;
        }

        // 4. At least one document (20%)
        if ($this->diploma_url || $this->artisan_card_url) {
            $score += 20;
        }

        // 5. Multiple Wilayas (20%)
        if ($this->wilayas()->count() > 1) {
            $score += 20;
        }

        // 6. Experience Level (10%)
        if ($this->experience_level) $score += 10;
        
        return min(100, $score);
    }

    public function scopeMatchingRequests($query)
    {
        $categoryIds = $this->categories()->pluck('categorie_metiers.id')->toArray();
        $wilayaIds = $this->wilayas()->pluck('wilayas.id')->toArray();

        return DemandeIntervention::whereIn('categorie_id', $categoryIds)
            ->whereIn('wilaya_id', $wilayaIds)
            ->where('statut', 'pending')
            ->latest();
    }

    /**
     * Admin status filtering scope
     */
    public function scopeWithAdminStatus($query, $status)
    {
        return match($status) {
            'pending'   => $query->where('statutValidation', 'en_attente'),
            'approved'  => $query->where('statutValidation', 'valide')
                                ->whereHas('user', fn($q) => $q->where('statut', 'actif')),
            'rejected'  => $query->where('statutValidation', 'refuse'),
            'suspended' => $query->whereHas('user', fn($q) => $q->where('statut', 'suspendu')),
            default     => $query
        };
    }

    /**
     * Document count accessor
     */
    public function getDocumentsCountAttribute()
    {
        $count = 0;
        if ($this->diploma_url) $count++;
        if ($this->artisan_card_url) $count++;
        return $count;
    }
}
