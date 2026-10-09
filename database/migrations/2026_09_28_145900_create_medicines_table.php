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
    Schema::create('medicines', function (Blueprint $table) {
        $table->id();
        $table->string('name')->index();
        $table->string('generic_name')->nullable()->index();
        $table->string('barcode')->nullable()->unique();
        $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
        $table->foreignId('unit_id')->nullable()->constrained()->nullOnDelete();
        $table->unsignedInteger('reorder_level')->default(10);  // low-stock warning point
        $table->boolean('requires_prescription')->default(false);
        $table->boolean('is_controlled')->default(false);
        $table->boolean('is_active')->default(true);
        $table->timestamps();
        $table->softDeletes();
    });
}

public function down(): void
{
    Schema::dropIfExists('medicines');
}
};
