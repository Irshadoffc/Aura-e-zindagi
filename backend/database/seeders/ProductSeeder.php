<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Mafioso Eau de Parfum for Men',
                'description' => 'A sophisticated and bold fragrance for the modern man',
                'brand_name' => 'Mafioso',
                'category' => 'mens',
                'fragrance_type' => 'EDP',
                'notes' => 'Bergamot, Lavender, Sandalwood',
                'price' => 89.99,
                'discount_percentage' => 0,
                'sku' => 'SKU-MAFIOSO01',
                'stock_quantity' => 50,
                'minimum_stock' => 10,
                'status' => 'active',
                'image' => 'Images/Card-1.webp'
            ],
            [
                'name' => 'Ashbourne Eau de Parfum for Men',
                'description' => 'Fresh and invigorating scent with woody undertones',
                'brand_name' => 'Ashbourne',
                'category' => 'mens',
                'fragrance_type' => 'EDP',
                'notes' => 'Citrus, Cedar, Musk',
                'price' => 79.99,
                'discount_percentage' => 10,
                'sku' => 'SKU-ASHBOURNE01',
                'stock_quantity' => 35,
                'minimum_stock' => 10,
                'status' => 'active',
                'image' => 'Images/Card-2.webp'
            ],
            [
                'name' => 'Bella Mia for Women',
                'description' => 'Elegant floral fragrance with romantic appeal',
                'brand_name' => 'Bella Mia',
                'category' => 'womens',
                'fragrance_type' => 'EDP',
                'notes' => 'Rose, Jasmine, Vanilla',
                'price' => 95.99,
                'discount_percentage' => 15,
                'sku' => 'SKU-BELLAMIA01',
                'stock_quantity' => 42,
                'minimum_stock' => 10,
                'status' => 'active',
                'image' => 'Images/Card-1.webp'
            ],
            [
                'name' => 'Rhea Touched by Bombshell',
                'description' => 'Luxurious and captivating fragrance for special occasions',
                'brand_name' => 'Rhea',
                'category' => 'womens',
                'fragrance_type' => 'EDP',
                'notes' => 'Peony, Passion Fruit, Vanilla',
                'price' => 100.00,
                'discount_percentage' => 20,
                'sku' => 'SKU-RHEA01',
                'stock_quantity' => 25,
                'minimum_stock' => 5,
                'status' => 'active',
                'image' => 'Images/Card-2.webp'
            ],
            [
                'name' => 'Bella Mia Perfume for Women',
                'description' => 'Delicate and feminine fragrance with lasting appeal',
                'brand_name' => 'Bella Mia',
                'category' => 'womens',
                'fragrance_type' => 'EDP',
                'notes' => 'Lily, Peach, Amber',
                'price' => 85.99,
                'discount_percentage' => 5,
                'sku' => 'SKU-BELLAMIA02',
                'stock_quantity' => 38,
                'minimum_stock' => 10,
                'status' => 'active',
                'image' => 'Images/card-3.webp'
            ],
            [
                'name' => 'Tycoon Eau de Parfum for Men',
                'description' => 'Powerful and commanding fragrance for successful men',
                'brand_name' => 'Tycoon',
                'category' => 'mens',
                'fragrance_type' => 'EDP',
                'notes' => 'Black Pepper, Leather, Oud',
                'price' => 120.00,
                'discount_percentage' => 0,
                'sku' => 'SKU-TYCOON01',
                'stock_quantity' => 30,
                'minimum_stock' => 8,
                'status' => 'active',
                'image' => 'Images/card-3.webp'
            ]
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}