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
    Schema::create('categories', function (Blueprint $table) {
        $table->id();                          // auto-increment primary key
        $table->string('name')->unique();      // no duplicate names
        $table->timestamps();                  // created_at, updated_at
    });
}

public function down(): void
{
    Schema::dropIfExists('categories');
}
};
