<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sale extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'invoice_no', 'customer_id', 'user_id', 'subtotal', 'discount',
        'tax', 'total', 'paid', 'payment_method',
    ];

    public function customer() { return $this->belongsTo(Customer::class); }
    public function user()     { return $this->belongsTo(User::class); }
    public function items()    { return $this->hasMany(SaleItem::class); }
}