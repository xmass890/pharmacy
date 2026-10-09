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
    Schema::create('stock_movements', function (Blueprint $table) {
        $table->id();
        $table->foreignId('medicine_batch_id')->constrained();
        $table->enum('type', ['purchase', 'sale', 'return_in', 'return_out', 'adjustment', 'expired']);
        $table->integer('quantity');            // positive = stock in, negative = stock out
        $table->nullableMorphs('reference');    // adds reference_type + reference_id (points to a sale or purchase)
        $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
        $table->string('note')->nullable();
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('stock_movements');
}
};
