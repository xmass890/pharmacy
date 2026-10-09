<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SupplierController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/dashboard');

Route::middleware('auth')->group(function () {

    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    // Profile (from Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Medicines
    Route::get('medicines', [MedicineController::class, 'index'])
        ->middleware('permission:medicines.view')->name('medicines.index');
    Route::middleware('permission:medicines.manage')->group(function () {
        Route::resource('medicines', MedicineController::class)->except(['index', 'show']);
    });

    // Suppliers
    Route::get('suppliers', [SupplierController::class, 'index'])
        ->middleware('permission:suppliers.view')->name('suppliers.index');
    Route::middleware('permission:suppliers.manage')->group(function () {
        Route::post('suppliers', [SupplierController::class, 'store'])->name('suppliers.store');
        Route::put('suppliers/{supplier}', [SupplierController::class, 'update'])->name('suppliers.update');
        Route::delete('suppliers/{supplier}', [SupplierController::class, 'destroy'])->name('suppliers.destroy');
    });

    // Purchases
    Route::get('purchases', [PurchaseController::class, 'index'])
        ->middleware('permission:purchases.view')->name('purchases.index');
    Route::middleware('permission:purchases.create')->group(function () {
        Route::get('purchases/create', [PurchaseController::class, 'create'])->name('purchases.create');
        Route::post('purchases', [PurchaseController::class, 'store'])->name('purchases.store');
    });

    // Sales / POS
    Route::middleware('permission:sales.create')->group(function () {
        Route::get('sales/create', [SaleController::class, 'create'])->name('sales.create');
        Route::get('sales/search', [SaleController::class, 'search'])->name('sales.search');
        Route::post('sales', [SaleController::class, 'store'])->name('sales.store');
    });
    Route::middleware('permission:sales.view')->group(function () {
        Route::get('sales', [SaleController::class, 'index'])->name('sales.index');
        Route::get('sales/{sale}', [SaleController::class, 'show'])->name('sales.show');
    });

    // Inventory
    Route::get('inventory', [InventoryController::class, 'index'])
        ->middleware('permission:inventory.view')->name('inventory.index');
    Route::post('inventory/batches/{batch}/write-off', [InventoryController::class, 'writeOff'])
        ->middleware('permission:inventory.adjust')->name('inventory.writeoff');

    // Reports
    Route::get('reports', [ReportController::class, 'index'])
        ->middleware('permission:reports.view')->name('reports.index');
});

require __DIR__ . '/auth.php';