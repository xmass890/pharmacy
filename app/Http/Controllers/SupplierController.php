<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    private array $rules = [
        'name'    => 'required|string|max:255',
        'phone'   => 'nullable|string|max:50',
        'email'   => 'nullable|email|max:255',
        'address' => 'nullable|string',
    ];

    public function index(Request $request)
    {
        $suppliers = Supplier::when($request->search, fn ($q, $s) => $q->where('name', 'like', "%$s%"))
            ->orderBy('name')->paginate(10)->withQueryString();

        return Inertia::render('Suppliers/Index', [
            'suppliers' => $suppliers,
            'filters'   => $request->only('search'),
        ]);
    }

    public function store(Request $request)
    {
        Supplier::create($request->validate($this->rules));
        return back()->with('success', 'Supplier added.');
    }

    public function update(Request $request, Supplier $supplier)
    {
        $supplier->update($request->validate($this->rules));
        return back()->with('success', 'Supplier updated.');
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();
        return back()->with('success', 'Supplier deleted.');
    }
}