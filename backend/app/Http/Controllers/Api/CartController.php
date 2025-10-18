<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cartItems = Cart::with(['product', 'tester'])
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json([
            'status' => true,
            'cart_items' => $cartItems
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'tester_id' => 'nullable|exists:testers,id',
            'size' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0'
        ]);

        $existingItem = Cart::where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->where('tester_id', $request->tester_id)
            ->where('size', $request->size)
            ->first();

        if ($existingItem) {
            $existingItem->quantity += $request->quantity;
            $existingItem->save();
            $cartItem = $existingItem;
        } else {
            $cartItem = Cart::create([
                'user_id' => $request->user()->id,
                'product_id' => $request->product_id,
                'tester_id' => $request->tester_id,
                'size' => $request->size,
                'quantity' => $request->quantity,
                'price' => $request->price
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Item added to cart',
            'cart_item' => $cartItem->load(['product', 'tester'])
        ]);
    }

    public function update(Request $request, Cart $cart)
    {
        if ($cart->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cart->update(['quantity' => $request->quantity]);

        return response()->json([
            'status' => true,
            'message' => 'Cart updated',
            'cart_item' => $cart->load('product')
        ]);
    }

    public function destroy(Request $request, Cart $cart)
    {
        if ($cart->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $cart->delete();

        return response()->json([
            'status' => true,
            'message' => 'Item removed from cart'
        ]);
    }
}