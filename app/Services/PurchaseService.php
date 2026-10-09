<?php

namespace App\Services;

use App\Models\MedicineBatch;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;

class PurchaseService
{
    public function create(array $data, int $userId): Purchase
    {
        return DB::transaction(function () use ($data, $userId) {
            $purchase = Purchase::create([
                'invoice_no'    => $data['invoice_no'] ?? null,
                'supplier_id'   => $data['supplier_id'],
                'user_id'       => $userId,
                'purchase_date' => $data['purchase_date'],
                'paid'          => $data['paid'] ?? 0,
                'note'          => $data['note'] ?? null,
            ]);

            $subtotal = 0;

            foreach ($data['items'] as $row) {
                // Same medicine + same batch number = add to the existing batch
                $batch = MedicineBatch::where('medicine_id', $row['medicine_id'])
                    ->where('batch_no', $row['batch_no'])
                    ->lockForUpdate()
                    ->first();

                if ($batch) {
                    $batch->update([
                        'quantity'       => $batch->quantity + $row['quantity'],
                        'purchase_price' => $row['purchase_price'],
                        'selling_price'  => $row['selling_price'],
                        'supplier_id'    => $data['supplier_id'],
                    ]);
                } else {
                    $batch = MedicineBatch::create([
                        'medicine_id'    => $row['medicine_id'],
                        'supplier_id'    => $data['supplier_id'],
                        'batch_no'       => $row['batch_no'],
                        'expiry_date'    => $row['expiry_date'],
                        'purchase_price' => $row['purchase_price'],
                        'selling_price'  => $row['selling_price'],
                        'quantity'       => $row['quantity'],
                    ]);
                }

                $line = round($row['quantity'] * $row['purchase_price'], 2);
                $subtotal += $line;

                PurchaseItem::create([
                    'purchase_id'       => $purchase->id,
                    'medicine_id'       => $row['medicine_id'],
                    'medicine_batch_id' => $batch->id,
                    'quantity'          => $row['quantity'],
                    'unit_cost'         => $row['purchase_price'],
                    'line_total'        => $line,
                ]);

                StockMovement::create([
                    'medicine_batch_id' => $batch->id,
                    'type'              => 'purchase',
                    'quantity'          => $row['quantity'],
                    'reference_type'    => Purchase::class,
                    'reference_id'      => $purchase->id,
                    'user_id'           => $userId,
                ]);
            }

            $discount = min((float) ($data['discount'] ?? 0), $subtotal);
            $purchase->update([
                'subtotal' => $subtotal,
                'discount' => $discount,
                'total'    => $subtotal - $discount,
            ]);

            return $purchase;
        });
    }
}