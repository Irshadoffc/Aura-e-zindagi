<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tester extends Model
{
    protected $fillable = [
        'product_id',
        'name',
        'image',
        'price',
        'size'
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}