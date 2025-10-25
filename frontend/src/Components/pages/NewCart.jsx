import React, { useState, useEffect } from "react";
import { X, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/Axios";

const CartDrawer = ({ onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const navigate = useNavigate();

  // Load cart from backend API
  useEffect(() => {
    const loadCart = async () => {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const response = await api.get('/cart');
          const backendItems = response.data.cart_items.map(item => ({
            id: item.id,
            productId: item.product.id,
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
          // Reset selected items when cart is reloaded
          setSelectedItems(new Set());
        } catch (error) {
          console.error('Error fetching cart:', error);
          // Fallback to localStorage
          const saved = localStorage.getItem("cartItems");
          setCartItems(saved ? JSON.parse(saved) : []);
          setSelectedItems(new Set());
        }
      } else {
        // Fallback to localStorage for non-authenticated users
        const saved = localStorage.getItem("cartItems");
        setCartItems(saved ? JSON.parse(saved) : []);
        setSelectedItems(new Set());
      }
      setLoading(false);
    };
    
    loadCart();
    
    // Listen for cart updates (only reload from other components, not internal updates)
    const handleCartUpdate = (event) => {
      // Only reload if the update came from outside this component
      if (event.detail && event.detail.source !== 'cartDrawer') {
        setTimeout(() => loadCart(), 100);
      }
    };
    
    window.addEventListener("cartUpdated", handleCartUpdate);
    
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);



  // Update quantity
  const updateQuantity = async (index, newQty) => {
    if (newQty < 1) return;
    
    const item = cartItems[index];
    const user = localStorage.getItem('user');
    
    if (user && item.id) {
      try {
        await api.put(`/cart/${item.id}`, { quantity: newQty });
        // Update local state immediately for better UX
        const updated = [...cartItems];
        updated[index].quantity = newQty;
        updated[index].totalPrice = newQty * updated[index].basePrice;
        setCartItems(updated);
        // Dispatch event with source info to prevent reload
        window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { source: 'cartDrawer' } }));
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    } else {
      // Fallback to localStorage
      const updated = [...cartItems];
      updated[index].quantity = newQty;
      updated[index].totalPrice = newQty * updated[index].basePrice;
      setCartItems(updated);
      localStorage.setItem("cartItems", JSON.stringify(updated));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  // Remove item
  const removeItem = async (index) => {
    const item = cartItems[index];
    const user = localStorage.getItem('user');
    
    if (user && item.id) {
      try {
        await api.delete(`/cart/${item.id}`);
        // Update local state immediately
        const updated = cartItems.filter((_, i) => i !== index);
        setCartItems(updated);
        // Update selected items indices
        const newSelected = new Set();
        selectedItems.forEach(selectedIndex => {
          if (selectedIndex < index) {
            newSelected.add(selectedIndex);
          } else if (selectedIndex > index) {
            newSelected.add(selectedIndex - 1);
          }
        });
        setSelectedItems(newSelected);
        window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { source: 'cartDrawer' } }));
      } catch (error) {
        console.error('Error removing item:', error);
      }
    } else {
      // Fallback to localStorage
      const updated = cartItems.filter((_, i) => i !== index);
      setCartItems(updated);
      localStorage.setItem("cartItems", JSON.stringify(updated));
      // Update selected items indices
      const newSelected = new Set();
      selectedItems.forEach(selectedIndex => {
        if (selectedIndex < index) {
          newSelected.add(selectedIndex);
        } else if (selectedIndex > index) {
          newSelected.add(selectedIndex - 1);
        }
      });
      setSelectedItems(newSelected);
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { source: 'cartDrawer' } }));
    }
  };

  // Calculate total for selected items only
  const totalAmount = cartItems
    .filter((_, index) => selectedItems.has(index))
    .reduce((sum, item) => sum + item.totalPrice, 0);
    
  // Toggle item selection
  const toggleItemSelection = (index) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
  };
  
  // Select all items
  const selectAllItems = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map((_, index) => index)));
    }
  };

  const handleCheckout = () => {
    const selectedCartItems = cartItems.filter((_, index) => selectedItems.has(index));
    if (selectedCartItems.length === 0) {
      alert('Please select at least one item to checkout');
      return;
    }
    navigate("/checkout", { state: { cartItems: selectedCartItems } });
    onClose();
  };

  return (
    <AnimatePresence>
      <>
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50"
          onClick={onClose}
        />

        {/* Drawer */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 w-full sm:w-[400px] h-full bg-white shadow-2xl z-50 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Your Cart ({cartItems.length})</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            {cartItems.length > 0 && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedItems.size === cartItems.length && cartItems.length > 0}
                  onChange={selectAllItems}
                  className="w-4 h-4 accent-gray-900"
                />
                <span className="text-sm text-gray-600">
                  Select All ({selectedItems.size}/{cartItems.length})
                </span>
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p className="text-lg">Your cart is empty</p>
                <p className="text-sm mt-2">Add some products to get started!</p>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex items-center gap-4 mb-4 p-3 border rounded-lg transition-colors ${
                    selectedItems.has(index) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  {/* Selection checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedItems.has(index)}
                    onChange={() => toggleItemSelection(index)}
                    className="w-4 h-4 accent-blue-600 flex-shrink-0"
                  />
                  {/* Remove button */}
                  <button
                    onClick={() => removeItem(index)}
                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-600">{item.selectedSize}</p>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-gray-200 w-24 mt-2">
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <p className="font-semibold text-sm mt-1">
                      PKR {(item.totalPrice * 280).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-700">
                  Selected ({selectedItems.size}) Total:
                </span>
                <span className="font-bold text-lg">
                  PKR {(totalAmount * 280).toLocaleString()}
                </span>
              </div>
              {selectedItems.size === 0 && (
                <p className="text-sm text-gray-500 mb-4 text-center">
                  Select items to proceed to checkout
                </p>
              )}
              <button
                onClick={handleCheckout}
                disabled={selectedItems.size === 0}
                className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800 transition rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Proceed to Checkout ({selectedItems.size} items)
              </button>
            </div>
          )}
        </motion.div>
      </>
    </AnimatePresence>
  );
};

export default CartDrawer;