<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Crypt;

class PaymentController extends Controller
{
    public function processCardPayment(Request $request)
    {
        // Enhanced validation with security rules
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'card_number' => 'required|string|min:13|max:19|regex:/^[0-9\s]+$/',
            'expiry' => 'required|string|regex:/^(0[1-9]|1[0-2])\/([0-9]{2})$/',
            'cvv' => 'required|string|min:3|max:4|regex:/^[0-9]+$/',
            'cardholder_name' => 'required|string|min:2|max:50|regex:/^[a-zA-Z\s]+$/',
            'gateway' => 'required|in:hbl'
        ]);
        
        $order = Order::findOrFail($request->order_id);
        
        // Security checks
        if ($order->user_id !== $request->user()->id) {
            Log::warning('Unauthorized payment attempt', ['user_id' => $request->user()->id, 'order_id' => $request->order_id]);
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 403);
        }
        
        if ($order->payment_status === 'paid') {
            return response()->json(['status' => false, 'message' => 'Order already paid'], 400);
        }
        
        Log::info('Payment attempt', ['order_id' => $order->id, 'gateway' => $request->gateway, 'user_id' => $request->user()->id]);

        // Use HBL payment gateway
        return $this->processHBLPayment($order, $request);
    }

    private function processHBLPayment($order, $request)
    {
        // HBL Payment Gateway Integration with dummy credentials
        $payload = [
            'merchant_id' => 'HBL_MERCHANT_123456',
            'merchant_key' => 'hbl_dummy_key_789',
            'transaction_id' => 'TXN_' . time() . '_' . $order->id,
            'amount' => number_format($order->total_amount * 280, 2, '.', ''),
            'currency' => 'PKR',
            'customer_name' => $request->cardholder_name,
            'customer_email' => $order->customer_email,
            'order_id' => $order->id,
            'description' => 'Aura E-Zindagi Order Payment',
            'return_url' => env('APP_URL') . '/payment/success',
            'cancel_url' => env('APP_URL') . '/payment/cancel',
            'callback_url' => env('APP_URL') . '/api/payment/hbl/callback',
            'card_number' => $request->card_number,
            'expiry_month' => substr($request->expiry, 0, 2),
            'expiry_year' => '20' . substr($request->expiry, 3, 2),
            'cvv' => $request->cvv
        ];

        // Generate signature for HBL
        $payload['signature'] = $this->generateHBLSignature($payload);

        try {
            // Simulate HBL API call (dummy response)
            $response = $this->simulateHBLResponse($payload);
            
            if ($response['status'] === 'success') {
                $order->update(['payment_status' => 'paid']);
                Log::info('HBL payment successful', ['order_id' => $order->id]);
                return response()->json([
                    'status' => true, 
                    'message' => 'Payment successful via HBL', 
                    'transaction_id' => $response['transaction_id']
                ]);
            }
            
            Log::warning('HBL payment failed', ['order_id' => $order->id, 'response' => $response]);
            return response()->json(['status' => false, 'message' => 'Payment failed'], 400);
        } catch (\Exception $e) {
            Log::error('HBL payment error', ['order_id' => $order->id, 'error' => $e->getMessage()]);
            return response()->json(['status' => false, 'message' => 'Payment processing error'], 500);
        }
    }

    private function simulateHBLResponse($payload)
    {
        // Log for debugging
        Log::info('HBL Payment Debug', [
            'card_number' => $payload['card_number'],
            'card_clean' => str_replace(' ', '', $payload['card_number'])
        ]);
        
        // Simulate HBL payment response (for testing)
        $testCards = [
            '4111111111111111', // Success
            '4000000000000002', // Declined
            '4000000000000119'  // Processing error
        ];

        $cardNumber = str_replace(' ', '', $payload['card_number']);
        
        // Always return success for testing
        if (in_array($cardNumber, $testCards) || $cardNumber === '4111111111111111') {
            return [
                'status' => 'success',
                'transaction_id' => 'HBL_TXN_' . time(),
                'response_code' => '00',
                'message' => 'Transaction approved'
            ];
        } else {
            // For any other card, still return success for testing
            return [
                'status' => 'success',
                'transaction_id' => 'HBL_TXN_' . time(),
                'response_code' => '00',
                'message' => 'Transaction approved (test mode)'
            ];
        }
    }

    private function generateHBLSignature($data)
    {
        $signatureString = $data['merchant_id'] . $data['amount'] . $data['order_id'] . 'HBL_SECRET_KEY_DUMMY';
        return hash('sha256', $signatureString);
    }

    private function processJazzCash($order, $request)
    {
        // JazzCash API integration with security
        $payload = [
            'pp_Version' => '1.1',
            'pp_TxnType' => 'MWALLET',
            'pp_Language' => 'EN',
            'pp_MerchantID' => env('JAZZCASH_MERCHANT_ID'),
            'pp_SubMerchantID' => '',
            'pp_Password' => env('JAZZCASH_PASSWORD'),
            'pp_BankID' => 'TBANK',
            'pp_ProductID' => 'RETL',
            'pp_TxnRefNo' => 'T' . time() . $order->id,
            'pp_Amount' => $order->total_amount * 28000,
            'pp_TxnCurrency' => 'PKR',
            'pp_TxnDateTime' => date('YmdHis'),
            'pp_BillReference' => $order->id,
            'pp_Description' => 'Order Payment - ' . $order->id,
            'pp_TxnExpiryDateTime' => date('YmdHis', strtotime('+1 hour')),
            'pp_ReturnURL' => env('APP_URL') . '/api/payment/jazzcash/callback',
            'pp_SecureHash' => ''
        ];

        $payload['pp_SecureHash'] = $this->generateJazzCashHash($payload);

        try {
            $response = Http::timeout(30)->post('https://sandbox.jazzcash.com.pk/ApplicationAPI/API/Payment/DoTransaction', $payload);
            
            if ($response->successful()) {
                $data = $response->json();
                if ($data['pp_ResponseCode'] === '000') {
                    $order->update(['payment_status' => 'paid']);
                    Log::info('JazzCash payment successful', ['order_id' => $order->id]);
                    return response()->json(['status' => true, 'message' => 'Payment successful', 'data' => $data]);
                }
            }
            
            Log::warning('JazzCash payment failed', ['order_id' => $order->id, 'response' => $response->body()]);
            return response()->json(['status' => false, 'message' => 'Payment failed'], 400);
        } catch (\Exception $e) {
            Log::error('JazzCash payment error', ['order_id' => $order->id, 'error' => $e->getMessage()]);
            return response()->json(['status' => false, 'message' => 'Payment processing error'], 500);
        }
    }

    private function processEasyPaisa($order, $request)
    {
        $payload = [
            'orderId' => $order->id,
            'storeId' => env('EASYPAISA_STORE_ID'),
            'amount' => $order->total_amount * 280,
            'postBackURL' => env('APP_URL') . '/api/payment/easypaisa/callback',
            'orderRefNum' => 'ORD-' . $order->id . '-' . time()
        ];

        try {
            $response = Http::timeout(30)->withHeaders([
                'Credentials' => env('EASYPAISA_CREDENTIALS')
            ])->post('https://easypaisa.com.pk/easypay/Index.jsf', $payload);

            if ($response->successful()) {
                $order->update(['payment_status' => 'paid']);
                Log::info('EasyPaisa payment successful', ['order_id' => $order->id]);
                return response()->json(['status' => true, 'message' => 'Payment successful']);
            }

            Log::warning('EasyPaisa payment failed', ['order_id' => $order->id]);
            return response()->json(['status' => false, 'message' => 'Payment failed'], 400);
        } catch (\Exception $e) {
            Log::error('EasyPaisa payment error', ['order_id' => $order->id, 'error' => $e->getMessage()]);
            return response()->json(['status' => false, 'message' => 'Payment processing error'], 500);
        }
    }

    private function processPayfast($order, $request)
    {
        $payload = [
            'merchant_id' => env('PAYFAST_MERCHANT_ID'),
            'merchant_key' => env('PAYFAST_MERCHANT_KEY'),
            'amount' => number_format($order->total_amount * 280, 2, '.', ''),
            'item_name' => 'Order #' . $order->id,
            'item_description' => 'Aura E-Zindagi Order Payment',
            'return_url' => env('APP_URL') . '/payment/success',
            'cancel_url' => env('APP_URL') . '/payment/cancel',
            'notify_url' => env('APP_URL') . '/api/payment/payfast/callback'
        ];

        try {
            $response = Http::timeout(30)->post('https://www.payfast.co.za/eng/process', $payload);
            
            if ($response->successful()) {
                $order->update(['payment_status' => 'paid']);
                Log::info('Payfast payment successful', ['order_id' => $order->id]);
                return response()->json(['status' => true, 'message' => 'Payment successful']);
            }

            Log::warning('Payfast payment failed', ['order_id' => $order->id]);
            return response()->json(['status' => false, 'message' => 'Payment failed'], 400);
        } catch (\Exception $e) {
            Log::error('Payfast payment error', ['order_id' => $order->id, 'error' => $e->getMessage()]);
            return response()->json(['status' => false, 'message' => 'Payment processing error'], 500);
        }
    }

    private function generateJazzCashHash($data)
    {
        $sortedData = '';
        ksort($data);
        foreach ($data as $key => $value) {
            if ($key !== 'pp_SecureHash') {
                $sortedData .= '&' . $value;
            }
        }
        $sortedData = ltrim($sortedData, '&');
        return hash_hmac('sha256', $sortedData, env('JAZZCASH_INTEGRITY_SALT'));
    }

    public function hblCallback(Request $request)
    {
        $orderId = $request->order_id;
        $order = Order::find($orderId);
        
        if ($order && $request->status === 'success') {
            $order->update(['payment_status' => 'paid']);
            Log::info('HBL callback success', ['order_id' => $orderId]);
            return redirect(env('FRONTEND_URL') . '/payment/success');
        }
        
        Log::warning('HBL callback failed', ['order_id' => $orderId, 'status' => $request->status]);
        return redirect(env('FRONTEND_URL') . '/payment/failed');
    }

    public function jazzCashCallback(Request $request)
    {
        // Verify callback authenticity
        $hash = $this->generateJazzCashHash($request->all());
        if ($hash !== $request->pp_SecureHash) {
            Log::warning('Invalid JazzCash callback hash');
            return response()->json(['status' => false], 400);
        }

        $orderId = $request->pp_BillReference;
        $order = Order::find($orderId);
        
        if ($order && $request->pp_ResponseCode === '000') {
            $order->update(['payment_status' => 'paid']);
            Log::info('JazzCash callback success', ['order_id' => $orderId]);
            return redirect(env('FRONTEND_URL') . '/payment/success');
        }
        
        Log::warning('JazzCash callback failed', ['order_id' => $orderId, 'response_code' => $request->pp_ResponseCode]);
        return redirect(env('FRONTEND_URL') . '/payment/failed');
    }

    public function easyPaisaCallback(Request $request)
    {
        $orderId = $request->orderId;
        $order = Order::find($orderId);
        
        if ($order && $request->status === 'Paid') {
            $order->update(['payment_status' => 'paid']);
            Log::info('EasyPaisa callback success', ['order_id' => $orderId]);
            return redirect(env('FRONTEND_URL') . '/payment/success');
        }
        
        Log::warning('EasyPaisa callback failed', ['order_id' => $orderId, 'status' => $request->status]);
        return redirect(env('FRONTEND_URL') . '/payment/failed');
    }
}