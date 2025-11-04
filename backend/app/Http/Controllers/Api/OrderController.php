<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Cart;
use App\Models\Customer;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('user')->orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'status' => true,
            'orders' => $orders
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_email' => 'required|email|max:255',
            'customer_city' => 'required|string|max:100',
            'customer_address' => 'required|string|max:255',
            'customer_postal_code' => 'required|string|max:20',
            'payment_method' => 'required|string|in:COD'
        ]);

        // Get specific cart items if provided, otherwise get all
        $cartQuery = Cart::with(['product', 'tester'])
            ->where('user_id', $request->user()->id);
            
        if ($request->has('cart_item_ids') && !empty($request->cart_item_ids)) {
            $cartQuery->whereIn('id', $request->cart_item_ids);
        }
        
        $cartItems = $cartQuery->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Cart is empty'
            ], 400);
        }

        // Calculate total
        $totalAmount = $cartItems->sum(function($item) {
            return $item->price * $item->quantity;
        });

        // Add shipping and payment method charges
        $shipping = 500 / 280; // Convert PKR to USD
        $codCharges = $request->payment_method === 'COD' ? 250 / 280 : 0;
        $finalTotal = $totalAmount + $shipping + $codCharges;

        // Prepare order items
        $orderItems = $cartItems->map(function($item) {
            return [
                'product_id' => $item->product_id,
                'tester_id' => $item->tester_id,
                'product_name' => $item->product->name,
                'tester_name' => $item->tester ? $item->tester->name : null,
                'size' => $item->size,
                'quantity' => $item->quantity,
                'price' => $item->price
            ];
        });

        // Create order
        $order = Order::create([
            'user_id' => $request->user()->id,
            'customer_name' => $request->customer_name,
            'customer_phone' => $request->customer_phone,
            'customer_email' => $request->customer_email,
            'customer_city' => $request->customer_city,
            'customer_address' => $request->customer_address,
            'customer_postal_code' => $request->customer_postal_code,
            'total_amount' => $finalTotal,
            'payment_method' => $request->payment_method,
            'payment_status' => 'pending',
            'order_status' => 'pending',
            'order_items' => $orderItems
        ]);

        // Create or update customer record
        $existingCustomer = Customer::where('user_id', $request->user()->id)->first();
        
        Customer::updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                'name' => $request->customer_name,
                'phone' => $request->customer_phone,
                'email' => $request->customer_email,
                'city' => $request->customer_city,
                'street_address' => $request->customer_address,
                'postal_code' => $request->customer_postal_code,
                'total_spent' => ($existingCustomer->total_spent ?? 0) + $finalTotal,
                'total_orders' => ($existingCustomer->total_orders ?? 0) + 1
            ]
        );

        // Clear only the specific cart items that were ordered
        if ($request->has('cart_item_ids') && !empty($request->cart_item_ids)) {
            $deletedCount = Cart::where('user_id', $request->user()->id)
                ->whereIn('id', $request->cart_item_ids)
                ->delete();
            \Log::info('Deleted cart items', ['count' => $deletedCount, 'ids' => $request->cart_item_ids]);
        } else {
            // If no specific items provided, clear all cart (backward compatibility)
            $deletedCount = Cart::where('user_id', $request->user()->id)->delete();
            \Log::info('Deleted all cart items', ['count' => $deletedCount]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Order placed successfully',
            'order' => $order
        ], 201);
    }

    public function show(Order $order)
    {
        return response()->json([
            'status' => true,
            'order' => $order->load('user')
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $request->validate([
            'order_status' => 'sometimes|in:pending,processing,shipped,delivered,cancelled',
            'payment_status' => 'sometimes|in:pending,paid,failed'
        ]);

        $order->update($request->only(['order_status', 'payment_status']));

        return response()->json([
            'status' => true,
            'message' => 'Order updated successfully',
            'order' => $order
        ]);
    }

    public function destroy(Order $order)
    {
        $order->delete();

        return response()->json([
            'status' => true,
            'message' => 'Order deleted successfully'
        ]);
    }

    public function userOrders(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'orders' => $orders
        ]);
    }

    public function statistics()
    {
        $totalOrders = Order::count();
        $pendingOrders = Order::where('order_status', 'pending')->count();
        $completedOrders = Order::where('order_status', 'delivered')->count();
        $totalRevenue = Order::where('payment_status', 'paid')->sum('total_amount');

        return response()->json([
            'status' => true,
            'statistics' => [
                'total_orders' => $totalOrders,
                'pending_orders' => $pendingOrders,
                'completed_orders' => $completedOrders,
                'total_revenue' => $totalRevenue
            ]
        ]);
    }
}