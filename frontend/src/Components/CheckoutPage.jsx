import React, { useState, useRef, useEffect } from "react";
import api from "../api/Axios";
import { toast } from 'react-toastify';

// --------------------- CARD PAYMENT FORM ---------------------
function CheckoutForm({ total, discount, onPlaceOrder, loading }) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const sanitizeInput = (value) => {
    return value.replace(/<script[^>]*>.*?<\/script>/gi, '').replace(/[<>"']/g, '');
  };

  const handleCardNumberChange = (e) => {
    const sanitized = sanitizeInput(e.target.value);
    const formatted = formatCardNumber(sanitized);
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e) => {
    const sanitized = sanitizeInput(e.target.value);
    const formatted = formatExpiry(sanitized);
    if (formatted.length <= 5) {
      setExpiry(formatted);
    }
  };

  const handleCvvChange = (e) => {
    const sanitized = sanitizeInput(e.target.value);
    const value = sanitized.replace(/[^0-9]/gi, '');
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const handleCardholderNameChange = (e) => {
    const sanitized = sanitizeInput(e.target.value);
    const value = sanitized.replace(/[^a-zA-Z\s]/g, '');
    if (value.length <= 50) {
      setCardholderName(value);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
      <div className="border-b border-gray-200 mb-6 pb-3">
        <button className="py-2 px-6 text-sm font-medium border-b-2 border-blue-600 text-blue-600">
          Pay by Card
        </button>
      </div>

      <div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card number
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="1234 1234 1234 1234"
            value={cardNumber}
            onChange={handleCardNumberChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiration date
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="MM/YY"
              value={expiry}
              onChange={handleExpiryChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVV
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="123"
              value={cvv}
              onChange={handleCvvChange}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cardholder name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
            value={cardholderName}
            onChange={handleCardholderNameChange}
          />
        </div>

        <div className="flex justify-between mb-6 font-bold text-lg">
          <span className="text-gray-900">Total (after 5% discount)</span>
          <span className="text-blue-600">PKR {total.toLocaleString()}</span>
        </div>

        <button 
          onClick={() => onPlaceOrder('Bank Transfer', { cardNumber, expiry, cvv, cardholderName })}
          disabled={loading || !cardNumber || !expiry || !cvv || !cardholderName}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing Payment...' : `Pay PKR ${total.toLocaleString()}`}
        </button>
      </div>

      <div className="text-center mt-6 text-gray-500 text-xs">
        Powered by Secure Payment Gateway
      </div>
    </div>
  );
}

// --------------------- COD PAYMENT FORM ---------------------
function CODForm({ subtotal, shipping, codCharges, discount, onPlaceOrder, loading }) {
  const total = subtotal + shipping + codCharges - discount;

  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
      <h3 className="text-xl font-bold mb-6 text-center">Cash on Delivery</h3>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-700">Subtotal</span>
          <strong className="text-gray-900">PKR {subtotal.toLocaleString()}</strong>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700">Shipping (Fixed)</span>
          <strong className="text-gray-900">PKR {shipping.toLocaleString()}</strong>
        </div>
        <div className="flex justify-between text-red-600">
          <span>COD Charges</span>
          <strong>+PKR {codCharges}</strong>
        </div>
        <div className="flex justify-between text-green-600">
          <span>Discount (5%)</span>
          <strong>-PKR {discount.toLocaleString()}</strong>
        </div>
        <hr className="border-gray-300 my-3" />
        <div className="flex justify-between font-bold text-lg">
          <span className="text-gray-900">Total</span>
          <span className="text-blue-600">PKR {total.toLocaleString()}</span>
        </div>
      </div>

      <button 
        onClick={onPlaceOrder}
        disabled={loading}
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50"
      >
        {loading ? 'Placing Order...' : 'Place Order (COD)'}
      </button>
    </div>
  );
}

// --------------------- MAIN CHECKOUT PAGE ---------------------
export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [streetname, setStreetname] = useState("");
  const [postalcode, setPostalcode] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const formRef = useRef(null);

  // Load cart items from backend API
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartItems();
    loadUserData();
  }, []);

  const loadUserData = () => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setName(userData.name || '');
      setEmail(userData.email || '');
    }
  };

  const fetchCartItems = async () => {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const response = await api.get('/cart');
        const backendItems = response.data.cart_items.map(item => ({
          id: item.product.id,
          name: item.product.name,
          image: item.product.image ? 
            (item.product.image.startsWith('uploads/') ? `http://127.0.0.1:8000/${item.product.image}` : `/${item.product.image}`) 
            : '/Images/Card-1.webp',
          selectedSize: item.size,
          quantity: item.quantity,
          basePrice: parseFloat(item.price),
          totalPrice: parseFloat(item.price) * item.quantity
        }));
        setCartItems(backendItems);
      } else {
        // Fallback to localStorage
        const saved = localStorage.getItem("cartItems");
        setCartItems(saved ? JSON.parse(saved) : []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Fallback to localStorage
      const saved = localStorage.getItem("cartItems");
      setCartItems(saved ? JSON.parse(saved) : []);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const subtotalPKR = subtotal * 280;
  const discount = subtotalPKR * 0.05;
  const shipping = 500;
  const codCharges = 250;

  const total = paymentMethod === "COD"
    ? subtotalPKR + shipping + codCharges - discount
    : subtotalPKR + shipping - discount;

  const handlePlaceOrder = async (method = 'COD', cardData = null) => {
    if (!name || !phone || !email || !city || !streetname || !postalcode) {
      toast.error('Please fill all customer information fields');
      return;
    }

    setOrderLoading(true);
    try {
      // First create the order
      const orderResponse = await api.post('/orders', {
        customer_name: name,
        customer_phone: phone,
        customer_email: email,
        customer_city: city,
        customer_address: streetname,
        customer_postal_code: postalcode,
        payment_method: method
      });
      
      const orderId = orderResponse.data.order.id;
      
      // Show success message based on method
      if (method === 'Bank Transfer' && cardData) {
        const paymentResponse = await api.post('/payment/process', {
          order_id: orderId,
          card_number: cardData.cardNumber,
          expiry: cardData.expiry,
          cvv: cardData.cvv,
          cardholder_name: cardData.cardholderName,
          gateway: 'hbl'
        });
        
        if (paymentResponse.data.status) {
          toast.success('Payment successful! Order ID: ' + orderId);
        } else {
          toast.error('Payment failed. Please try again.');
          return;
        }
      } else {
        toast.success('Order placed successfully! Order ID: ' + orderId);
      }
      
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setOrderLoading(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setPaymentMethod("");
      }
    }
    if (paymentMethod) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [paymentMethod]);

  if (loading) {
    return (
      <div className="py-12 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-center">
          <div className="w-full max-w-5xl">
            <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-2xl overflow-hidden">
              
              {/* LEFT FORM */}
              <div className="w-full md:w-7/12 p-6 md:p-8 bg-white order-2 md:order-1">
                <h5 className="font-bold text-lg mb-6">Checkout</h5>

                {/* CUSTOMER INFO */}
                <label className="block text-sm font-medium text-gray-600 mb-3">
                  Customer Information
                </label>
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <input className="w-full border-b border-gray-200 px-4 py-3 text-sm outline-none" type="text" placeholder="Enter your name" value={name} onChange={(e)=>setName(e.target.value)} />
                  <input className="w-full border-b border-gray-200 px-4 py-3 text-sm outline-none" type="text" placeholder="Enter phone number" value={phone} onChange={(e)=>setPhone(e.target.value)} />
                  <input className="w-full border-b border-gray-200 px-4 py-3 text-sm outline-none" type="email" placeholder="Enter your email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                  <input className="w-full border-b border-gray-200 px-4 py-3 text-sm outline-none" type="text" placeholder="Enter your city" value={city} onChange={(e)=>setCity(e.target.value)} />
                  <input className="w-full border-b border-gray-200 px-4 py-3 text-sm outline-none" type="text" placeholder="Enter your street name or number" value={streetname} onChange={(e)=>setStreetname(e.target.value)} />
                  <input className="w-full px-4 py-3 text-sm outline-none" type="text" placeholder="Enter postal code" value={postalcode} onChange={(e)=>setPostalcode(e.target.value)} />
                </div>

                {/* PAYMENT OPTIONS */}
                <label className="block text-sm font-medium text-gray-600 mt-6 mb-3">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className={`h-16 border-2 font-medium flex items-center justify-center ${paymentMethod === "e-Transfer" ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-100 bg-white text-gray-600"}`}
                    onClick={() => setPaymentMethod("e-Transfer")}
                  >
                    Bank Transfer
                  </button>
                  <button
                    className={`h-16 border-2 font-medium flex items-center justify-center ${paymentMethod === "COD" ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-100 bg-white text-gray-600"}`}
                    onClick={() => setPaymentMethod("COD")}
                  >
                    Cash on Delivery
                  </button>
                </div>

                {paymentMethod && (
                  <div ref={formRef} className="mt-6">
                    {paymentMethod === "e-Transfer" && <CheckoutForm total={total} discount={discount} onPlaceOrder={handlePlaceOrder} loading={orderLoading} />}
                    {paymentMethod === "COD" && <CODForm subtotal={subtotalPKR} shipping={shipping} codCharges={codCharges} discount={discount} onPlaceOrder={() => handlePlaceOrder('COD')} loading={orderLoading} />}
                  </div>
                )}
              </div>

              {/* RIGHT SUMMARY */}
              <div className="w-full md:w-5/12 p-6 md:p-8 bg-gray-50">
                <div className="bg-blue-50 p-6 h-full border border-blue-50">
                  <div className="text-center mt-4">
                    <p className="font-bold text-gray-800 mb-2 text-lg">Order Summary</p>
                  </div>

                  <div className="space-y-4">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                          <div className="text-left">
                            <p className="text-gray-700 text-sm">{item.name}</p>
                            <p className="text-gray-500 text-xs">{item.selectedSize} x {item.quantity}</p>
                          </div>
                        </div>
                        <p className="text-gray-800 text-sm">PKR {(item.totalPrice * 280).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <hr className="border-gray-200 my-4" />

                  <div className="flex justify-between text-sm mb-1">
                    <span>Subtotal</span>
                    <span>PKR {subtotalPKR.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Shipping</span>
                    <span>PKR {shipping.toLocaleString()}</span>
                  </div>
                  {paymentMethod === "COD" && (
                    <div className="flex justify-between text-sm mb-1 text-red-600">
                      <span>COD Charges</span>
                      <span>PKR {codCharges.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm mb-1 text-green-600">
                    <span>Discount (5%)</span>
                    <span>-PKR {discount.toLocaleString()}</span>
                  </div>

                  <hr className="border-gray-200 my-4" />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">PKR {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}
