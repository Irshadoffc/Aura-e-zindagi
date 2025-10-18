<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'customer_name',
        'customer_phone', 
        'customer_email',
        'customer_city',
        'customer_address',
        'customer_postal_code',
        'total_amount',
        'payment_method',
        'payment_status',
        'order_status',
        'order_items'
    ];

    protected $casts = [
        'order_items' => 'array'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
