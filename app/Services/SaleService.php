<?php

namespace App\Services;

use App\Models\Medicine;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SaleService
{
    public function create(array $data, int $userId): Sale
    {
        return DB::transaction(function () use ($data, $userId) {
            $sale = Sale::create([
                'invoice_no'     => 'TMP-' . uniqid(),
                'customer_id'    => $data['customer_id'] ?? null,
                'user_id'        => $userId,
                'payment_method' => $data['payment_method'],
            ]);

            $subtotal = 0;

            foreach ($data['items'] as $row) {
                $medicine = Medicine::findOrFail($row['medicine_id']);

                if ($medicine->requires_prescription && empty($data['prescription_confirmed'])) {
                    throw ValidationException::withMessages([
                        'items' => "{$medicine->name} requires a prescription. Tick the confirmation box.",
                    ]);
                }

                $remaining = (int) $row['quantity'];

                // Non-expired batches with stock, earliest expiry first, locked
                $batches = $medicine->sellableBatches()->lockForUpdate()->get();

                foreach ($batches as $batch) {
                    if ($remaining <= 0) {
                        break;
                    }

                    $take = min($remaining, $batch->quantity);
                    $line = round($take * $batch->selling_price, 2);
                    $subtotal += $line;

                    SaleItem::create([
                        'sale_id'           => $sale->id,
                        'medicine_id'       => $medicine->id,
                        'medicine_batch_id' => $batch->id,
                        'quantity'          => $take,
                        'unit_price'        => $batch->selling_price,
                        'unit_cost'         => $batch->purchase_price,
                        'line_total'        => $line,
                    ]);

                    $batch->decrement('quantity', $take);

                    StockMovement::create([
                        'medicine_batch_id' => $batch->id,
                        'type'              => 'sale',
                        'quantity'          => -$take,
                        'reference_type'    => Sale::class,
                        'reference_id'      => $sale->id,
                        'user_id'           => $userId,
                    ]);

                    $remaining -= $take;
                }

                if ($remaining > 0) {
                    // Throwing rolls back EVERYTHING done so far in this sale
                    throw ValidationException::withMessages([
                        'items' => "Not enough valid stock for {$medicine->name} (short by {$remaining}).",
                    ]);
                }
            }

            $discount = (float) ($data['discount'] ?? 0);
            if ($discount > $subtotal) {
                throw ValidationException::withMessages(['discount' => 'Discount is more than the subtotal.']);
            }

            $total = $subtotal - $discount;

            $sale->update([
                'invoice_no' => 'INV-' . now()->format('Ymd') . '-' . str_pad($sale->id, 5, '0', STR_PAD_LEFT),
                'subtotal'   => $subtotal,
                'discount'   => $discount,
                'total'      => $total,
                'paid'       => $data['paid'] ?? $total,
            ]);

            return $sale;
        });
    }
}