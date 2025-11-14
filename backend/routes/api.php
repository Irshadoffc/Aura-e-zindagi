<?php
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\DashboardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes (no authentication required)
Route::middleware(['throttle:5,1'])->group(function () {
    Route::post('/login', [LoginController::class, 'login']);
    Route::post('/google-login', [LoginController::class, 'handleGoogleLogin']);
});

// Public product routes (no authentication required)
Route::middleware(['throttle:60,1'])->group(function () {
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product}', [ProductController::class, 'show']);
});

// Protected routes (authentication required)
Route::middleware('auth:sanctum')->group(function () {
    // User routes
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [LoginController::class, 'logout']);

    // Cart routes
    Route::apiResource('cart', \App\Http\Controllers\Api\CartController::class);

    // Order routes
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/my-orders', [OrderController::class, 'userOrders']);



    // Dashboard routes
    Route::get('/dashboard/analytics', [DashboardController::class, 'getAnalytics']);
    Route::get('/dashboard/realtime', [DashboardController::class, 'getRealtimeStats']);

    // Product management routes (admin only)
    Route::middleware('role:admin')->group(function () {
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::post('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);
        Route::get('/collections', [ProductController::class, 'collections']);
        Route::apiResource('customers', CustomerController::class);
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/statistics', [OrderController::class, 'statistics']);
        Route::get('/orders/{order}', [OrderController::class, 'show']);
        Route::put('/orders/{order}', [OrderController::class, 'update']);
        Route::delete('/orders/{order}', [OrderController::class, 'destroy']);
    });

    // User-specific routes
    Route::get('/profile', function (Request $request) {
        return response()->json(['user' => $request->user()]);
    });
});
