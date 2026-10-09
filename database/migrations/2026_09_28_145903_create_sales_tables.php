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
    Schema::create('sales', function (Blueprint $table) {
        $table->id();
        $table->string('invoice_no')->unique();
        $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
        $table->foreignId('user_id')->constrained();       // cashier
        $table->decimal('subtotal', 12, 2)->default(0);
        $table->decimal('discount', 12, 2)->default(0);
        $table->decimal('tax', 12, 2)->default(0);
        $table->decimal('total', 12, 2)->default(0);
        $table->decimal('paid', 12, 2)->default(0);
        $table->string('payment_method')->default('cash');
        $table->timestamps();
        $table->softDeletes();
    });

    Schema::create('sale_items', function (Blueprint $table) {
        $table->id();
        $table->foreignId('sale_id')->constrained()->cascadeOnDelete();
        $table->foreignId('medicine_id')->constrained();
        $table->foreignId('medicine_batch_id')->constrained();
        $table->unsignedInteger('quantity');
        $table->decimal('unit_price', 12, 2);
        $table->decimal('unit_cost', 12, 2);     // saved so profit reports stay correct later
        $table->decimal('line_total', 12, 2);
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('sale_items');
    Schema::dropIfExists('sales');
}
};
