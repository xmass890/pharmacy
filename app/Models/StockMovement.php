<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    protected $fillable = [
        'medicine_batch_id', 'type', 'quantity',
        'reference_type', 'reference_id', 'user_id', 'note',
    ];

    public function batch()     { return $this->belongsTo(MedicineBatch::class, 'medicine_batch_id'); }
    public function reference() { return $this->morphTo(); }
}