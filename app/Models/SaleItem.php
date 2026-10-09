<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SaleItem extends Model
{
    protected $fillable = [
        'sale_id', 'medicine_id', 'medicine_batch_id',
        'quantity', 'unit_price', 'unit_cost', 'line_total',
    ];

    public function medicine() { return $this->belongsTo(Medicine::class); }
    public function batch()    { return $this->belongsTo(MedicineBatch::class, 'medicine_batch_id'); }
}