<?php
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes (no authentication required)
Route::post('/login', [LoginController::class, 'login']);
Route::post('/google-login', [LoginController::class, 'handleGoogleLogin']);

// Public product routes (no authentication required)
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Protected routes (authentication required)
Route::middleware('auth:sanctum')->group(function () {
    // User routes
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [LoginController::class, 'logout']);
    
    // Dashboard routes
    Route::get('/dashboard', function () {
        return response()->json(['message' => 'Dashboard data']);
    });
    
    // Product management routes (admin only)
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('products', ProductController::class);
        Route::get('/admin/orders', function () {
            return response()->json(['message' => 'Admin orders']);
        });
        Route::get('/admin/customers', function () {
            return response()->json(['message' => 'Admin customers']);
        });
    });
    

    
    // User-specific routes
    Route::get('/orders', function (Request $request) {
        return response()->json(['message' => 'User orders', 'user' => $request->user()->name]);
    });
    Route::get('/profile', function (Request $request) {
        return response()->json(['user' => $request->user()]);
    });
});
