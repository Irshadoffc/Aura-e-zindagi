<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Fix products with numeric brand names
        DB::table('products')
            ->whereRaw('brand_name REGEXP "^[0-9]+$"')
            ->update(['brand_name' => 'Unknown Brand']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Cannot reverse this migration as we don't know the original values
    }
};