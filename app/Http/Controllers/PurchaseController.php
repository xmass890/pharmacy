<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use App\Models\Purchase;
use App\Models\Supplier;
use App\Services\PurchaseService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    public function index()
    {
        return Inertia::render('Purchases/Index', [
            'purchases' => Purchase::with('supplier')->latest()->paginate(10),
        ]);
    }

    public function create()
    {
        return Inertia::render('Purchases/Create', [
            'suppliers' => Supplier::orderBy('name')->get(['id', 'name']),
            'medicines' => Medicine::where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request, PurchaseService $service)
    {
        $data = $request->validate([
            'supplier_id'             => 'required|exists:suppliers,id',
            'purchase_date'           => 'required|date',
            'invoice_no'              => 'nullable|string|max:100',
            'discount'                => 'nullable|numeric|min:0',
            'paid'                    => 'nullable|numeric|min:0',
            'note'                    => 'nullable|string',
            'items'                   => 'required|array|min:1',
            'items.*.medicine_id'     => 'required|exists:medicines,id',
            'items.*.batch_no'        => 'required|string|max:100',
            'items.*.expiry_date'     => 'required|date|after:today',
            'items.*.quantity'        => 'required|integer|min:1',
            'items.*.purchase_price'  => 'required|numeric|min:0',
            'items.*.selling_price'   => 'required|numeric|min:0',
        ]);

        $service->create($data, $request->user()->id);

        return redirect()->route('purchases.index')->with('success', 'Purchase saved and stock updated.');
    }
}