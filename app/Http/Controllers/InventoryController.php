<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use App\Models\MedicineBatch;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $filter = $request->get('filter', 'all');

        $batches = MedicineBatch::with('medicine')
            ->where('quantity', '>', 0)
            ->when($filter === 'expiring', fn ($q) => $q->whereBetween('expiry_date', [today(), today()->addDays(90)]))
            ->when($filter === 'expired', fn ($q) => $q->whereDate('expiry_date', '<', today()))
            ->orderBy('expiry_date')
            ->paginate(15)->withQueryString();

        $lowStock = Medicine::withSum('batches as stock', 'quantity')->get()
            ->filter(fn ($m) => ($m->stock ?? 0) <= $m->reorder_level)
            ->map(fn ($m) => ['id' => $m->id, 'name' => $m->name, 'stock' => (int) ($m->stock ?? 0), 'reorder_level' => $m->reorder_level])
            ->values()->take(50);

        return Inertia::render('Inventory/Index', [
            'batches'  => $batches,
            'lowStock' => $lowStock,
            'filter'   => $filter,
        ]);
    }

    // Remove expired stock from the shelf, keeping a record
    public function writeOff(Request $request, MedicineBatch $batch)
    {
        abort_unless($batch->expiry_date->isPast(), 422, 'Batch has not expired.');

        DB::transaction(function () use ($batch, $request) {
            $batch = MedicineBatch::lockForUpdate()->find($batch->id);
            if ($batch->quantity > 0) {
                StockMovement::create([
                    'medicine_batch_id' => $batch->id,
                    'type'              => 'expired',
                    'quantity'          => -$batch->quantity,
                    'user_id'           => $request->user()->id,
                    'note'              => 'Expired write-off',
                ]);
                $batch->update(['quantity' => 0]);
            }
        });

        return back()->with('success', 'Expired stock written off.');
    }
}