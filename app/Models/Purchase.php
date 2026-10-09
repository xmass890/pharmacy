<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    protected $fillable = [
        'invoice_no', 'supplier_id', 'user_id', 'purchase_date',
        'subtotal', 'discount', 'total', 'paid', 'note',
    ];

    protected $casts = ['purchase_date' => 'date'];

    public function supplier() { return $this->belongsTo(Supplier::class); }
    public function user()     { return $this->belongsTo(User::class); }
    public function items()    { return $this->hasMany(PurchaseItem::class); }
}