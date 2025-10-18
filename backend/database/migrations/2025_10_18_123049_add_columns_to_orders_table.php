<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->after('id');
            $table->string('customer_name')->after('user_id');
            $table->string('customer_phone')->after('customer_name');
            $table->string('customer_email')->after('customer_phone');
            $table->string('customer_city')->after('customer_email');
            $table->string('customer_address')->after('customer_city');
            $table->string('customer_postal_code')->after('customer_address');
            $table->decimal('total_amount', 10, 2)->after('customer_postal_code');
            $table->enum('payment_method', ['COD', 'Bank Transfer'])->after('total_amount');
            $table->enum('payment_status', ['pending', 'paid', 'failed'])->default('pending')->after('payment_method');
            $table->enum('order_status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])->default('pending')->after('payment_status');
            $table->json('order_items')->after('order_status');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn([
                'user_id', 'customer_name', 'customer_phone', 'customer_email',
                'customer_city', 'customer_address', 'customer_postal_code',
                'total_amount', 'payment_method', 'payment_status', 'order_status', 'order_items'
            ]);
        });
    }
};