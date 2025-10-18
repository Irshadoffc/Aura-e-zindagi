<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'brand_name',
        'category',
        'fragrance_type',
        'notes',
        'price',
        'discount_percentage',
        'sku',
        'stock_quantity',
        'minimum_stock',
        'status',
        'image'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_percentage' => 'integer',
        'stock_quantity' => 'integer',
        'minimum_stock' => 'integer',
    ];

    public function testers()
    {
        return $this->hasMany(Tester::class);
    }
}