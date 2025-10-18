<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function getAnalytics(Request $request)
    {
        try {
            $month = $request->get('month', date('n'));
            $year = $request->get('year', date('Y'));
            
            // Basic Statistics
            $totalOrders = Order::count();
            $totalRevenue = Order::where('payment_status', 'completed')->sum('total_amount');
            $totalProducts = Product::count();
            $totalCustomers = Customer::count();
            
            // Recent Orders (last 7 days)
            $recentOrders = Order::where('created_at', '>=', Carbon::now()->subDays(7))->count();
            
            // Monthly Revenue (last 12 months)
            $monthlyRevenue = Order::where('payment_status', 'completed')
                ->where('created_at', '>=', Carbon::now()->subMonths(12))
                ->selectRaw('MONTH(created_at) as month, YEAR(created_at) as year, SUM(total_amount) as revenue')
                ->groupBy('year', 'month')
                ->orderBy('year', 'desc')
                ->orderBy('month', 'desc')
                ->get();

            // Daily Sales for selected month - generate all days
            $startDate = Carbon::createFromDate($year, $month, 1)->startOfMonth();
            $endDate = Carbon::createFromDate($year, $month, 1)->endOfMonth();
            
            // Get actual sales data
            $actualSales = Order::whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw('DATE(created_at) as date, COUNT(*) as orders, SUM(total_amount) as revenue')
                ->groupBy('date')
                ->get()
                ->keyBy('date');
            
            // Generate all days of the month with zero values for missing days
            $dailySales = collect();
            $currentDate = $startDate->copy();
            
            while ($currentDate <= $endDate) {
                $dateStr = $currentDate->format('Y-m-d');
                $salesData = $actualSales->get($dateStr);
                
                $dailySales->push([
                    'date' => $dateStr,
                    'orders' => $salesData ? $salesData->orders : 0,
                    'revenue' => $salesData ? $salesData->revenue : 0
                ]);
                
                $currentDate->addDay();
            }

            // Top Selling Products
            $topProducts = DB::table('orders')
                ->join('products', function($join) {
                    $join->on(DB::raw("JSON_UNQUOTE(JSON_EXTRACT(orders.order_items, '$[0].product_id'))"), '=', 'products.id');
                })
                ->select('products.name', 'products.image', DB::raw('COUNT(*) as sales_count'))
                ->groupBy('products.id', 'products.name', 'products.image')
                ->orderBy('sales_count', 'desc')
                ->limit(5)
                ->get();

            // Order Status Distribution
            $orderStatusStats = Order::selectRaw('order_status, COUNT(*) as count')
                ->groupBy('order_status')
                ->get();

            // Category Sales
            $categorySales = DB::table('orders')
                ->join('products', function($join) {
                    $join->on(DB::raw("JSON_UNQUOTE(JSON_EXTRACT(orders.order_items, '$[0].product_id'))"), '=', 'products.id');
                })
                ->select('products.category', DB::raw('COUNT(*) as sales_count, SUM(orders.total_amount) as revenue'))
                ->groupBy('products.category')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'overview' => [
                        'total_orders' => $totalOrders,
                        'total_revenue' => round($totalRevenue, 2),
                        'total_products' => $totalProducts,
                        'total_customers' => $totalCustomers,
                        'recent_orders' => $recentOrders
                    ],
                    'monthly_revenue' => $monthlyRevenue,
                    'daily_sales' => $dailySales->values(),
                    'top_products' => $topProducts,
                    'order_status_stats' => $orderStatusStats,
                    'category_sales' => $categorySales
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch analytics data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getRealtimeStats()
    {
        try {
            // Today's stats
            $today = Carbon::today();
            $todayOrders = Order::whereDate('created_at', $today)->count();
            $todayRevenue = Order::whereDate('created_at', $today)
                ->where('payment_status', 'completed')
                ->sum('total_amount');
            
            // This week's stats
            $weekStart = Carbon::now()->startOfWeek();
            $weekOrders = Order::where('created_at', '>=', $weekStart)->count();
            $weekRevenue = Order::where('created_at', '>=', $weekStart)
                ->where('payment_status', 'completed')
                ->sum('total_amount');

            // Pending orders
            $pendingOrders = Order::where('order_status', 'pending')->count();
            
            // Low stock products
            $lowStockProducts = Product::where('stock_quantity', '<=', DB::raw('minimum_stock'))->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'today' => [
                        'orders' => $todayOrders,
                        'revenue' => round($todayRevenue, 2)
                    ],
                    'week' => [
                        'orders' => $weekOrders,
                        'revenue' => round($weekRevenue, 2)
                    ],
                    'pending_orders' => $pendingOrders,
                    'low_stock_products' => $lowStockProducts,
                    'timestamp' => now()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch realtime stats',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}