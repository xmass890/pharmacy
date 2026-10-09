<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Medicine;
use App\Models\Sale;
use App\Services\SaleService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SaleController extends Controller
{
    public function index()
    {
        return Inertia::render('Sales/Index', [
            'sales' => Sale::with(['customer', 'user'])->latest()->paginate(10),
        ]);
    }

    public function create()
    {
        return Inertia::render('Sales/Create', [
            'customers' => Customer::orderBy('name')->get(['id', 'name']),
        ]);
    }

    // JSON used by the POS search box (name, generic name, or exact barcode)
    public function search(Request $request)
    {
        $medicines = Medicine::where('is_active', true)
            ->search($request->q)
            ->with('sellableBatches')
            ->limit(10)->get()
            ->map(fn ($m) => [
                'id'                    => $m->id,
                'name'                  => $m->name,
                'generic_name'          => $m->generic_name,
                'requires_prescription' => $m->requires_prescription,
                'stock'                 => (int) $m->sellableBatches->sum('quantity'),
                'price'                 => (float) ($m->sellableBatches->first()?->selling_price ?? 0),
            ])
            ->filter(fn ($m) => $m['stock'] > 0)->values();

        return response()->json($medicines);
    }

    public function store(Request $request, SaleService $service)
    {
        $data = $request->validate([
            'customer_id'            => 'nullable|exists:customers,id',
            'payment_method'         => 'required|in:cash,card,mobile',
            'discount'               => 'nullable|numeric|min:0',
            'paid'                   => 'nullable|numeric|min:0',
            'prescription_confirmed' => 'boolean',
            'items'                  => 'required|array|min:1',
            'items.*.medicine_id'    => 'required|exists:medicines,id',
            'items.*.quantity'       => 'required|integer|min:1',
        ]);

        $sale = $service->create($data, $request->user()->id);

        return redirect()->route('sales.show', $sale)->with('success', 'Sale completed.');
    }

    public function show(Sale $sale)
    {
        $sale->load(['items.medicine', 'items.batch', 'user', 'customer']);
        return Inertia::render('Sales/Show', ['sale' => $sale]);
    }
}