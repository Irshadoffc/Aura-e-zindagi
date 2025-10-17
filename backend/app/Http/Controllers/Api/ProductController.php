<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::orderBy('created_at', 'desc')->get();
        
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

        return response()->json([
            'status' => true,
            'message' => 'Product created successfully',
            'product' => $product
        ], 201);
    }

    public function show(Product $product)
    {
        return response()->json([
            'status' => true,
            'product' => $product
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

        return response()->json([
            'status' => true,
            'message' => 'Product updated successfully',
            'product' => $product
        ]);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'status' => true,
            'message' => 'Product deleted successfully'
        ]);
    }
}