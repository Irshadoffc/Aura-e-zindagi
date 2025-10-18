<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::with('user')
            ->whereHas('user')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($customer) {
                return [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'email' => $customer->email,
                    'phone' => $customer->phone,
                    'city' => $customer->city,
                    'total_orders' => $customer->total_orders ?? 0,
                    'total_spent' => round(($customer->total_spent ?? 0) * 280, 2),
                    'last_order' => $customer->updated_at->format('Y-m-d'),
                    'status' => 'Customer',
                    'created_at' => $customer->created_at->format('Y-m-d')
                ];
            });
        
        return response()->json([
            'status' => true,
            'customers' => $customers
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'city' => 'required|string|max:100',
            'street_address' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20'
        ]);

        $customer = Customer::create($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Customer created successfully',
            'customer' => $customer
        ], 201);
    }

    public function show(Customer $customer)
    {
        return response()->json([
            'status' => true,
            'customer' => $customer
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'city' => 'required|string|max:100',
            'street_address' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20'
        ]);

        $customer->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Customer updated successfully',
            'customer' => $customer
        ]);
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();

        return response()->json([
            'status' => true,
            'message' => 'Customer deleted successfully'
        ]);
    }
}