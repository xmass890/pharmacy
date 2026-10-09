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
    Schema::create('medicine_batches', function (Blueprint $table) {
        $table->id();
        $table->foreignId('medicine_id')->constrained()->cascadeOnDelete();
        $table->foreignId('supplier_id')->nullable()->constrained()->nullOnDelete();
        $table->string('batch_no');
        $table->date('expiry_date')->index();
        $table->decimal('purchase_price', 12, 2);   // what you paid
        $table->decimal('selling_price', 12, 2);    // what customer pays
        $table->unsignedInteger('quantity')->default(0);
        $table->timestamps();

        $table->unique(['medicine_id', 'batch_no']); // same batch number can't repeat per medicine
    });
}

public function down(): void
{
    Schema::dropIfExists('medicine_batches');
}
};
