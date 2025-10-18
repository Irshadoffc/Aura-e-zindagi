<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Tester;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;

class ProductController extends Controller
{
    public function index()
    {
        $products = Cache::remember('products.all', 300, function () {
            return Product::select('id', 'name', 'brand_name', 'category', 'price', 'stock_quantity', 'status', 'image', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get();
        });
        
        return response()->json([
            'status' => true,
            'products' => $products
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'brand_name' => 'required|string|max:100',
            'category' => 'required|in:mens,womens,unisex,special_offer',
            'fragrance_type' => 'required|in:EDP,EDT,EDC,Oil',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/products'), $imageName);
            $imagePath = 'uploads/products/' . $imageName;
        }

        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'brand_name' => $request->brand_name,
            'category' => $request->category,
            'fragrance_type' => $request->fragrance_type,
            'notes' => $request->notes,
            'price' => $request->price,
            'discount_percentage' => $request->discount_percentage ?? 0,
            'sku' => 'SKU-' . strtoupper(Str::random(8)),
            'stock_quantity' => $request->stock_quantity,
            'minimum_stock' => $request->minimum_stock ?? 10,
            'status' => 'active',
            'image' => $imagePath,
        ]);

        // Handle testers
        if ($request->has('testers')) {
            foreach ($request->testers as $index => $testerData) {
                if (!empty($testerData['name']) && !empty($testerData['price'])) {
                    $testerImagePath = null;
                    if ($request->hasFile("testers.{$index}.image")) {
                        $testerImage = $request->file("testers.{$index}.image");
                        $testerImageName = time() . '_tester_' . $testerImage->getClientOriginalName();
                        $testerImage->move(public_path('uploads/products'), $testerImageName);
                        $testerImagePath = 'uploads/products/' . $testerImageName;
                    }

                    Tester::create([
                        'product_id' => $product->id,
                        'name' => $testerData['name'],
                        'price' => $testerData['price'],
                        'image' => $testerImagePath,
                        'size' => '5 ml'
                    ]);
                }
            }
        }

        Cache::forget('products.all');
        Cache::forget('collections.counts');
        
        return response()->json([
            'status' => true,
            'message' => 'Product created successfully',
            'product' => $product
        ], 201);
    }

    public function show(Product $product)
    {
        $cachedProduct = Cache::remember("product.{$product->id}", 300, function () use ($product) {
            return $product->load('testers');
        });
        
        return response()->json([
            'status' => true,
            'product' => $cachedProduct
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'brand_name' => 'required|string|max:100',
            'category' => 'required|in:mens,womens,unisex,special_offer',
            'fragrance_type' => 'required|in:EDP,EDT,EDC,Oil',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
        ]);

        $product->update($request->all());

        Cache::forget('products.all');
        Cache::forget("product.{$product->id}");
        Cache::forget('collections.counts');
        
        return response()->json([
            'status' => true,
            'message' => 'Product updated successfully',
            'product' => $product
        ]);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        Cache::forget('products.all');
        Cache::forget("product.{$product->id}");
        Cache::forget('collections.counts');
        
        return response()->json([
            'status' => true,
            'message' => 'Product deleted successfully'
        ]);
    }

    public function collections()
    {
        $collections = Cache::remember('collections.counts', 300, function () {
            return [
                [
                    'id' => 1,
                    'title' => 'All Products',
                    'products' => Product::count(),
                    'img' => '/Images/Card-1.webp'
                ],
                [
                    'id' => 2,
                    'title' => 'Men Perfumes',
                    'products' => Product::where('category', 'mens')->count(),
                    'img' => '/Images/WhatsApp Image 2025-07-08 at 11.12.23 PM.webp'
                ],
                [
                    'id' => 3,
                    'title' => 'Women Perfumes',
                    'products' => Product::where('category', 'womens')->count(),
                    'img' => '/Images/card-3.webp'
                ],
                [
                    'id' => 4,
                    'title' => 'Unisex Perfumes',
                    'products' => Product::where('category', 'unisex')->count(),
                    'img' => '/Images/Card-2.webp'
                ],
                [
                    'id' => 5,
                    'title' => 'Special Offer',
                    'products' => Product::where('category', 'special_offer')->count(),
                    'img' => '/Images/Card-1.webp'
                ]
            ];
        });

        return response()->json([
            'status' => true,
            'collections' => $collections
        ]);
    }
}