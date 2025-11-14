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
    public function index(Request $request)
    {
        $showAll = $request->query('show_all', false);
        
        $cacheKey = $showAll ? 'products.all.admin' : 'products.all.public';
        
        $products = Cache::remember($cacheKey, 300, function () use ($showAll) {
            $query = Product::select('id', 'name', 'description', 'brand_name', 'category', 'price', 'discount_percentage', 'sku', 'stock_quantity', 'volumes', 'minimum_stock', 'status', 'image', 'created_at')
                ->orderBy('created_at', 'desc');
                
            // Filter by status for public view
            if (!$showAll) {
                $query->where('status', 'active');
            }
            
            return $query->get()
                ->map(function ($product) {
                    // Calculate stock status
                    if ($product->stock_quantity <= 0) {
                        $product->stock_status = 'out_of_stock';
                    } elseif ($product->stock_quantity <= 10) { // Default minimum stock
                        $product->stock_status = 'low_stock';
                    } else {
                        $product->stock_status = 'in_stock';
                    }
                    
                    // Fix numeric brand names (data cleanup)
                    if (is_numeric($product->brand_name)) {
                        $product->brand_name = 'Unknown Brand';
                    }
                    
                    // Add default status if not present
                    if (!isset($product->status)) {
                        $product->status = 'active';
                    }
                    
                    return $product;
                });
        });
        
        // Debug: Log products with numeric brand names
        $productsWithNumericBrands = $products->filter(function($product) {
            return is_numeric($product->brand_name);
        });
        
        if ($productsWithNumericBrands->isNotEmpty()) {
            \Log::warning('Products with numeric brand names found:', 
                $productsWithNumericBrands->map(function($p) {
                    return [
                        'id' => $p->id,
                        'name' => $p->name,
                        'brand_name' => $p->brand_name,
                        'category' => $p->category
                    ];
                })->toArray()
            );
        }
        
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
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'volumes' => 'nullable|json',
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
            'price' => $request->price,
            'discount_percentage' => $request->discount_percentage ?? 0,
            'sku' => 'SKU-' . strtoupper(Str::random(8)),
            'stock_quantity' => $request->stock_quantity,
            'volumes' => $request->volumes,
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
        \Log::info('Update request data:', $request->all());
        
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'brand_name' => 'sometimes|required|string|max:100',
            'category' => 'sometimes|required|in:mens,womens,unisex,special_offer',
            'price' => 'sometimes|required|numeric|min:0',
            'stock_quantity' => 'sometimes|required|integer|min:0',
            'minimum_stock' => 'sometimes|integer|min:0',
            'discount_percentage' => 'sometimes|integer|min:0|max:100',
            'volumes' => 'nullable|string',
            'status' => 'sometimes|in:active,inactive',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $updateData = [];
        
        // Only update fields that are present in request
        if ($request->filled('name')) $updateData['name'] = $request->name;
        if ($request->filled('description')) $updateData['description'] = $request->description;
        if ($request->filled('brand_name')) $updateData['brand_name'] = $request->brand_name;
        if ($request->filled('category')) $updateData['category'] = $request->category;
        if ($request->filled('price')) $updateData['price'] = $request->price;
        if ($request->has('discount_percentage')) $updateData['discount_percentage'] = $request->discount_percentage;
        if ($request->filled('stock_quantity')) $updateData['stock_quantity'] = $request->stock_quantity;
        if ($request->has('minimum_stock')) $updateData['minimum_stock'] = $request->minimum_stock;
        if ($request->filled('status')) $updateData['status'] = $request->status;

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/products'), $imageName);
            $updateData['image'] = 'uploads/products/' . $imageName;
        }

        // Handle volumes
        if ($request->has('volumes')) {
            $updateData['volumes'] = $request->volumes;
        }

        \Log::info('Update data:', $updateData);
        
        $product->update($updateData);

        Cache::forget('products.all.admin');
        Cache::forget('products.all.public');
        Cache::forget("product.{$product->id}");
        Cache::forget('collections.counts');
        
        return response()->json([
            'status' => true,
            'message' => 'Product updated successfully',
            'product' => $product->fresh()
        ]);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        Cache::forget('products.all.admin');
        Cache::forget('products.all.public');
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