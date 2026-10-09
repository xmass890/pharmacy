<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicineBatch extends Model
{
    protected $fillable = [
        'medicine_id', 'supplier_id', 'batch_no', 'expiry_date',
        'purchase_price', 'selling_price', 'quantity',
    ];

    protected $casts = ['expiry_date' => 'date'];

    public function medicine() { return $this->belongsTo(Medicine::class); }
    public function supplier() { return $this->belongsTo(Supplier::class); }

    public function isExpired(): bool
    {
        return $this->expiry_date->isPast();
    }
}