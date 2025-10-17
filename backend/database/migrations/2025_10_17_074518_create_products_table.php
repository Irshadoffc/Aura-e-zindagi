<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('brand_name');
            $table->enum('category', ['mens', 'womens', 'unisex']);
            $table->enum('fragrance_type', ['EDP', 'EDT', 'EDC', 'Oil'])->default('EDP');
            $table->string('notes')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('discount_percentage')->default(0);
            $table->string('sku')->unique();
            $table->integer('stock_quantity')->default(0);
            $table->integer('minimum_stock')->default(10);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};