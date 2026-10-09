<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Medicine extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'generic_name', 'barcode', 'category_id', 'unit_id',
        'reorder_level', 'requires_prescription', 'is_controlled', 'is_active',
    ];

    protected $casts = [
        'requires_prescription' => 'boolean',
        'is_controlled' => 'boolean',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function category() { return $this->belongsTo(Category::class); }
    public function unit()     { return $this->belongsTo(Unit::class); }
    public function batches()  { return $this->hasMany(MedicineBatch::class); }

    // Batches we are allowed to sell: has stock AND not expired.
    // Ordered by earliest expiry first (FEFO = First Expiry, First Out).
    public function sellableBatches()
    {
        return $this->batches()
            ->where('quantity', '>', 0)
            ->whereDate('expiry_date', '>=', now()->toDateString())
            ->orderBy('expiry_date');
    }

    // Reusable search filter: Medicine::search('para')->get()
    public function scopeSearch($query, ?string $term)
    {
        return $query->when($term, function ($q) use ($term) {
            $q->where(function ($q) use ($term) {
                $q->where('name', 'like', "%{$term}%")
                  ->orWhere('generic_name', 'like', "%{$term}%")
                  ->orWhere('barcode', $term);
            });
        });
    }
}