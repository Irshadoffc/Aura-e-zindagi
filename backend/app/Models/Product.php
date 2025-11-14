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
        'price',
        'discount_percentage',
        'sku',
        'stock_quantity',
        'volumes',
        'minimum_stock',
        'status',
        'image'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_percentage' => 'integer',
        'stock_quantity' => 'integer',
        'minimum_stock' => 'integer',
        'volumes' => 'json',
    ];

    public function testers()
    {
        return $this->hasMany(Tester::class);
    }

    public function getVolumesAttribute($value)
    {
        if (is_string($value)) {
            // Handle double JSON encoding
            $decoded = json_decode($value, true);
            if (is_string($decoded)) {
                $decoded = json_decode($decoded, true);
            }
            return is_array($decoded) ? $decoded : [];
        }
        return is_array($value) ? $value : [];
    }
}