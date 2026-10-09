<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Medicine;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicineController extends Controller
{
    private function rules(?int $id = null): array
    {
        return [
            'name'                  => 'required|string|max:255',
            'generic_name'          => 'nullable|string|max:255',
            'barcode'               => 'nullable|string|max:100|unique:medicines,barcode,' . $id,
            'category_id'           => 'nullable|exists:categories,id',
            'unit_id'               => 'nullable|exists:units,id',
            'reorder_level'         => 'required|integer|min:0',
            'requires_prescription' => 'boolean',
            'is_controlled'         => 'boolean',
            'is_active'             => 'boolean',
        ];
    }

    public function index(Request $request)
    {
        $medicines = Medicine::with(['category', 'unit'])
            ->withSum('batches as stock', 'quantity')
            ->search($request->search)
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Medicines/Index', [
            'medicines' => $medicines,
            'filters'   => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Medicines/Form', [
            'categories' => Category::orderBy('name')->get(),
            'units'      => Unit::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        Medicine::create($request->validate($this->rules()));
        return redirect()->route('medicines.index')->with('success', 'Medicine added.');
    }

    public function edit(Medicine $medicine)
    {
        return Inertia::render('Medicines/Form', [
            'medicine'   => $medicine,
            'categories' => Category::orderBy('name')->get(),
            'units'      => Unit::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Medicine $medicine)
    {
        $medicine->update($request->validate($this->rules($medicine->id)));
        return redirect()->route('medicines.index')->with('success', 'Medicine updated.');
    }

    public function destroy(Medicine $medicine)
    {
        $medicine->delete(); // soft delete
        return back()->with('success', 'Medicine deleted.');
    }
}