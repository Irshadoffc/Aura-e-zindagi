import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/Axios";
import { toast } from 'react-toastify';



// --------------------- COD PAYMENT FORM ---------------------
function CODForm({ subtotal, shipping, codCharges, onPlaceOrder, loading }) {
  const total = subtotal + shipping + codCharges;

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
  const location = useLocation();
  const navigate = useNavigate();

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
      // Check if we have selected items from cart drawer
      if (location.state && location.state.cartItems) {
        console.log('Selected items:', location.state.cartItems);
        setCartItems(location.state.cartItems);
        setLoading(false);
        return;
      }
      
      const user = localStorage.getItem('user');
      console.log('User from localStorage:', user);
      
      if (user) {
        const response = await api.get('/cart');
        console.log('Cart API response:', response.data);
        
        if (response.data.cart_items && response.data.cart_items.length > 0) {
          const backendItems = response.data.cart_items.map(item => ({
            cartId: item.id, // Store cart ID for deletion
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
          console.log('Processed cart items:', backendItems);
          setCartItems(backendItems);
        } else {
          console.log('No cart items found in API response');
          setCartItems([]);
        }
      } else {
        console.log('No user found, checking localStorage');
        // Fallback to localStorage
        const saved = localStorage.getItem("cartItems");
        const localItems = saved ? JSON.parse(saved) : [];
        console.log('LocalStorage cart items:', localItems);
        setCartItems(localItems);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart items');
      // Fallback to localStorage
      const saved = localStorage.getItem("cartItems");
      const localItems = saved ? JSON.parse(saved) : [];
      console.log('Fallback to localStorage:', localItems);
      setCartItems(localItems);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const shipping = 500;
  const codCharges = 250;

  const total = subtotal + shipping + codCharges;

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validatePostalCode = (code) => {
    const postalRegex = /^[0-9]{5}$/;
    return postalRegex.test(code);
  };

  const handlePlaceOrder = async () => {
    // Basic field validation
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    if (!city.trim()) {
      toast.error('Please enter your city');
      return;
    }
    if (!streetname.trim()) {
      toast.error('Please enter your street address');
      return;
    }
    if (!postalcode.trim()) {
      toast.error('Please enter your postal code');
      return;
    }

    // Format validation
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!validatePhone(phone)) {
      toast.error('Please enter a valid phone number (10-15 digits)');
      return;
    }
    if (!validatePostalCode(postalcode)) {
      toast.error('Please enter a valid 5-digit postal code');
      return;
    }
    if (name.trim().length < 2) {
      toast.error('Name must be at least 2 characters long');
      return;
    }
    if (city.trim().length < 2) {
      toast.error('City name must be at least 2 characters long');
      return;
    }

    setOrderLoading(true);
    try {
      // Prepare order data
      const orderData = {
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        customer_email: email.trim().toLowerCase(),
        customer_city: city.trim(),
        customer_address: streetname.trim(),
        customer_postal_code: postalcode.trim(),
        payment_method: 'COD'
      };
      
      // Add cart item IDs if available (for selected items)
      const cartItemIds = cartItems.filter(item => item.cartId || item.id).map(item => item.cartId || item.id);
      console.log('Cart items for order:', cartItems);
      console.log('Cart item IDs being sent:', cartItemIds);
      if (cartItemIds.length > 0) {
        orderData.cart_item_ids = cartItemIds;
      }
      
      // Create the order
      const orderResponse = await api.post('/orders', orderData);
      const orderId = orderResponse.data.order.id;
      
      setOrderLoading(false);
      
      // Clear cart items from backend and local storage
      try {
        // Clear from backend if user is logged in
        const user = localStorage.getItem('user');
        if (user && cartItemIds.length > 0) {
          // Delete specific cart items from backend
          await Promise.all(cartItemIds.map(cartId => 
            api.delete(`/cart/${cartId}`).catch(err => console.log('Cart item already removed:', err))
          ));
        }
        
        // Clear from local storage
        if (cartItemIds.length > 0) {
          // Remove only the ordered items
          const remainingItems = cartItems.filter(item => !cartItemIds.includes(item.cartId || item.id));
          setCartItems(remainingItems);
          localStorage.setItem("cartItems", JSON.stringify(remainingItems));
        } else {
          // Clear all items if no specific IDs
          setCartItems([]);
          localStorage.removeItem("cartItems");
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
        // Still clear local state even if backend fails
        setCartItems([]);
        localStorage.removeItem("cartItems");
      }
      
      toast.success(`🎉 Order placed successfully! Order ID: ${orderId}`);
      
      // Dispatch cart update event to refresh cart count
      window.dispatchEvent(new Event("cartUpdated"));
      
      // Navigate immediately to home page
      navigate('/', { replace: true });
      
    } catch (error) {
      console.error('Error placing order:', error);
      setOrderLoading(false);
      
      if (error.response?.status === 422 && error.response?.data?.errors) {
        // Handle validation errors from backend
        const errors = error.response.data.errors;
        Object.keys(errors).forEach(field => {
          errors[field].forEach(message => {
            toast.error(message);
          });
        });
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 401) {
        toast.error('Please login to place an order');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (error.response?.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error('Failed to place order. Please check your information and try again.');
      }
    }
  };



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
  
  if (cartItems.length === 0) {
    console.log('Cart is empty, cartItems:', cartItems);
    return (
      <div className="py-12 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No items in cart</p>
          <p className="text-gray-500 text-sm mt-2">Please add some items to your cart first</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Continue Shopping
          </button>
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
                  <input 
                    className="w-full border-b border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500" 
                    type="text" 
                    placeholder="Enter your full name" 
                    value={name} 
                    onChange={(e)=>setName(e.target.value)}
                    maxLength={255}
                  />
                  <input 
                    className="w-full border-b border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500" 
                    type="tel" 
                    placeholder="Enter phone number (e.g., 03001234567)" 
                    value={phone} 
                    onChange={(e)=>setPhone(e.target.value)}
                    maxLength={20}
                  />
                  <input 
                    className="w-full border-b border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500" 
                    type="email" 
                    placeholder="Enter your email address" 
                    value={email} 
                    onChange={(e)=>setEmail(e.target.value)}
                    maxLength={255}
                  />
                  <input 
                    className="w-full border-b border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500" 
                    type="text" 
                    placeholder="Enter your city" 
                    value={city} 
                    onChange={(e)=>setCity(e.target.value)}
                    maxLength={100}
                  />
                  <input 
                    className="w-full border-b border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500" 
                    type="text" 
                    placeholder="Enter your complete address" 
                    value={streetname} 
                    onChange={(e)=>setStreetname(e.target.value)}
                    maxLength={255}
                  />
                  <input 
                    className="w-full px-4 py-3 text-sm outline-none focus:border-blue-500" 
                    type="text" 
                    placeholder="Enter 5-digit postal code" 
                    value={postalcode} 
                    onChange={(e)=>setPostalcode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    maxLength={5}
                  />
                </div>

                {/* PAYMENT METHOD - COD ONLY */}
                <label className="block text-sm font-medium text-gray-600 mt-6 mb-3">
                  Payment Method
                </label>
                <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-gray-900 rounded-full mr-3 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Cash on Delivery</span>
                        <p className="text-sm text-gray-600 mt-1">Pay when your order arrives at your doorstep</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h4a2 2 0 002-2v-2M7 7h10" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <CODForm subtotal={subtotal} shipping={shipping} codCharges={codCharges} onPlaceOrder={() => handlePlaceOrder()} loading={orderLoading} />
                </div>
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
                        <p className="text-gray-800 text-sm">PKR {item.totalPrice.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <hr className="border-gray-200 my-4" />

                  <div className="flex justify-between text-sm mb-1">
                    <span>Subtotal</span>
                    <span>PKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Shipping</span>
                    <span>PKR {shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1 text-red-600">
                    <span>COD Charges</span>
                    <span>PKR {codCharges.toLocaleString()}</span>
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
