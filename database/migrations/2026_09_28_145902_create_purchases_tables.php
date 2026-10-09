<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::create('purchases', function (Blueprint $table) {
        $table->id();
        $table->string('invoice_no')->nullable();          // supplier's invoice number
        $table->foreignId('supplier_id')->constrained();
        $table->foreignId('user_id')->constrained();       // who entered it
        $table->date('purchase_date');
        $table->decimal('subtotal', 12, 2)->default(0);
        $table->decimal('discount', 12, 2)->default(0);
        $table->decimal('total', 12, 2)->default(0);
        $table->decimal('paid', 12, 2)->default(0);
        $table->text('note')->nullable();
        $table->timestamps();
    });

    Schema::create('purchase_items', function (Blueprint $table) {
        $table->id();
        $table->foreignId('purchase_id')->constrained()->cascadeOnDelete();
        $table->foreignId('medicine_id')->constrained();
        $table->foreignId('medicine_batch_id')->constrained();
        $table->unsignedInteger('quantity');
        $table->decimal('unit_cost', 12, 2);
        $table->decimal('line_total', 12, 2);
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('purchase_items');
    Schema::dropIfExists('purchases');
}
};
