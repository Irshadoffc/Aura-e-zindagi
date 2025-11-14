import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Minus,
  Plus,
  ChevronDown,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./pages/NewCart";
import SocialMediaToggle from "./Socialmedia";
import api from "../api/Axios";

const ProductDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(state?.product || null);
  const [loading, setLoading] = useState(!state?.product);
  

  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [shippingOpen, setShippingOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  // For tasters selection
  const [selectedTaster, setSelectedTaster] = useState(null);

  // Always fetch product to ensure fresh data
  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      const productData = response.data.product;
      setProduct(productData);
      
      // Update selected size based on available volumes
      if (productData.volumes && Array.isArray(productData.volumes) && productData.volumes.length > 0) {
        setSelectedSize(productData.volumes[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="mt-2">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-gray-600">Product not found.</div>
    );
  }

  const productImage = product.image ? 
    (product.image.startsWith('uploads/') ? `http://127.0.0.1:8000/${product.image}` : `/${product.image}`) 
    : '/Images/Card-1.webp';
  
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [productImage, productImage, productImage, productImage];

  const basePrice = parseFloat(product.price) || 0;
  const discountPercentage = product.discount_percentage || 0;
  const originalPrice = discountPercentage > 0 ? basePrice / (1 - discountPercentage / 100) : basePrice;
  const displayPrice = basePrice; // This is the actual price after discount
  
  // Get available volumes from product data
  const availableVolumes = product?.volumes && Array.isArray(product.volumes) && product.volumes.length > 0 
    ? product.volumes 
    : ["50ml", "100ml"];
  
  // Create price map based on available volumes using discounted price as base
  const priceMap = {};
  if (availableVolumes.length > 0) {
    availableVolumes.forEach((volume) => {
      const volumeNumber = parseInt(volume.replace('ml', ''));
      // Use stored price (after discount) as base and calculate proportionally
      // Assuming stored price is for the first volume in the array
      const baseVolumeNumber = parseInt(availableVolumes[0].replace('ml', ''));
      const multiplier = volumeNumber / baseVolumeNumber;
      priceMap[volume] = Math.round(displayPrice * multiplier);
    });
  } else {
    priceMap['default'] = displayPrice;
  }
  
  // Set default selected size to first available volume
  const [selectedSize, setSelectedSize] = useState(() => {
    const volumes = product?.volumes && Array.isArray(product.volumes) && product.volumes.length > 0 
      ? product.volumes 
      : ["50ml", "100ml"];
    return volumes[0] || "50ml";
  });
  
  const totalPrice = priceMap[selectedSize] * quantity;

  const handlePrevImage = () =>
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNextImage = () =>
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Add main product to cart
  const handleAddToCart = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await api.post('/cart', {
        product_id: product.id,
        size: selectedSize,
        quantity: quantity,
        price: priceMap[selectedSize]
      });
      
      toast.success('✅ Product added to cart!', {
        position: 'top-right',
        autoClose: 2000,
      });
      
      setQuantity(1);
      
      // Dispatch custom event for cart update
      window.dispatchEvent(new Event("cartUpdated"));
      
      // Auto-open cart after toast
      setTimeout(() => {
        setShowCartDrawer(true);
      }, 2200);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('❌ Failed to add to cart. Please login first.', {
        position: 'top-right',
        autoClose: 3000,
      });
      // Fallback to localStorage
      const existingIndex = cartItems.findIndex(
        (item) => item.id === product.id && item.selectedSize === selectedSize
      );

      let updatedCart;
      if (existingIndex >= 0) {
        updatedCart = [...cartItems];
        updatedCart[existingIndex].quantity += quantity;
        updatedCart[existingIndex].totalPrice =
          updatedCart[existingIndex].quantity *
          priceMap[updatedCart[existingIndex].selectedSize];
      } else {
        updatedCart = [
          ...cartItems,
          {
            id: product.id,
            name: product.name,
            image: images[selectedImage],
            selectedSize,
            quantity,
            basePrice: priceMap[selectedSize],
            totalPrice: priceMap[selectedSize] * quantity,
          },
        ];
      }

      setCartItems(updatedCart);
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      
      window.dispatchEvent(new Event("cartUpdated"));
      setQuantity(1);
      
      // Auto-open cart after toast (fallback case)
      setTimeout(() => {
        setShowCartDrawer(true);
      }, 2200);
    }
  };

  // Buy it now handler - Send to backend and navigate to checkout
  const handleBuyNow = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await api.post('/cart', {
        product_id: product.id,
        size: selectedSize,
        quantity: quantity,
        price: priceMap[selectedSize]
      });
      
      navigate("/checkout");
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Fallback to localStorage
      const item = {
        id: product.id,
        name: product.name,
        image: images[selectedImage],
        selectedSize,
        quantity,
        basePrice: priceMap[selectedSize],
        totalPrice: priceMap[selectedSize] * quantity,
      };
      
      const updatedCart = [...cartItems, item];
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      navigate("/checkout");
    }
  };

  // Get testers from product data
  const tasters = product.testers || [];

  // Add selected taster to cart
  const handleAddTasterToCart = async () => {
    if (!selectedTaster) {
      alert("Please select a taster!");
      return;
    }

    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await api.post('/cart', {
        product_id: product.id,
        tester_id: selectedTaster.id,
        size: "5 ml",
        quantity: 1,
        price: selectedTaster.price
      });
      
      toast.success('✅ Tester added to cart!', {
        position: 'top-right',
        autoClose: 2000,
      });
      
      setSelectedTaster(null);
      
      // Dispatch custom event for cart update
      window.dispatchEvent(new Event("cartUpdated"));
      
      // Auto-open cart after toast
      setTimeout(() => {
        setShowCartDrawer(true);
      }, 2200);
    } catch (error) {
      console.error('Error adding tester to cart:', error);
      toast.error('❌ Failed to add tester to cart', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <Navbar />
      <SocialMediaToggle/>
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 py-8 mt-24 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* LEFT SECTION */}
            <div className="flex flex-col-reverse lg:flex-row gap-4">
              {/* Thumbnails */}
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 border-2 overflow-hidden transition-all ${
                      selectedImage === index
                        ? "border-black"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="relative flex-1 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden min-h-[400px] md:h-[600px]">
                <img
                  src={images[selectedImage]}
                  alt="Product"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-800" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition"
                >
                  <ChevronRight className="w-4 h-4 text-gray-800" />
                </button>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{product.rating || 4.5}</span>
                </div>
              </div>

              <div className="mb-6">
                {discountPercentage > 0 ? (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm text-gray-500 line-through">
                        PKR {Math.round(originalPrice * quantity).toLocaleString()}
                      </p>
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                        {discountPercentage}% OFF
                      </span>
                    </div>
                    <p className="text-xl font-semibold text-green-600">
                      PKR {totalPrice.toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-xl font-semibold text-gray-900">
                    PKR {totalPrice.toLocaleString()}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  PKR {priceMap[selectedSize].toLocaleString()} × {quantity}
                </p>
              </div>

              {/* Size Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Size
                </label>
                <div className="flex gap-2">
                  {Object.keys(priceMap).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-4 border rounded text-sm font-medium transition-all ${
                        selectedSize === size
                          ? "border-gray-600 bg-gray-900 text-white"
                          : "border-gray-300 bg-white text-gray-900 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quantity
                </label>
                <div className="flex items-center border border-gray-200 w-36">
                  <button
                    onClick={decrementQuantity}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-lg font-medium w-10 text-center">
                    {quantity.toString().padStart(2, "0")}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="py-3 px-5 border-2 border-gray-400 bg-white text-gray-700 font-medium hover:bg-gray-50"
                >
                  Add to cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="py-3 px-5 bg-gray-900 text-white font-medium hover:bg-gray-800"
                >
                  Buy it now
                </button>
              </div>

              {/* ====== Tester Section ====== */}
              <div className="max-w-8xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4">Testers</h2>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {tasters.map((taster) => (
                    <div
                      key={taster.id}
                      className="p-5 rounded-lg flex flex-col cursor-pointer transition hover:shadow-lg min-h-[350px]"
                    >
                      <img
                        src={taster.image ? 
                          (taster.image.startsWith('uploads/') ? `http://127.0.0.1:8000/${taster.image}` : `/${taster.image}`) 
                          : '/Images/WhatsApp Image 2025-07-08 at 11.12.23 PM.webp'
                        }
                        alt={taster.name}
                        className="w-full h-56 object-cover rounded-lg mb-4"
                      />
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-lg">{taster.name}</span>
                        <span className="font-semibold text-lg">PKR {parseFloat(taster.price).toLocaleString()}</span>
                      </div>
                      <span className="text-sm text-gray-500 mb-4">{taster.size || '5 ml'}</span>

                      {/* Checkbox */}
                      <label className="flex items-center gap-2 mt-auto">
                        <input
                          type="checkbox"
                          checked={selectedTaster?.id === taster.id}
                          onChange={() => {
                            setSelectedTaster(
                              selectedTaster?.id === taster.id ? null : taster
                            );
                          }}
                          className="w-5 h-5 accent-gray-900"
                        />
                        <span className="text-sm font-medium text-gray-700">Select</span>
                      </label>
                    </div>
                  ))}
                </div>

                {/* Add Selected Taster */}
                <div className="mb-4">
                  <button
                    onClick={handleAddTasterToCart}
                    className="w-full py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
                  >
                    Add Selected Taster to Cart
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-gray-200 mt-6">
                <button
                  onClick={() => setDescriptionOpen(!descriptionOpen)}
                  className="w-full py-4 flex items-center justify-between text-left"
                >
                  <span className="font-medium text-gray-900">Description</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform ${
                      descriptionOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {descriptionOpen && (
                  <div className="pb-4 text-sm text-gray-600 leading-relaxed">
                    <div className="mb-3">
                      {product.description || product.longDescription ||
                        "No description available for this product."}
                    </div>
                    {product.volumes && product.volumes.length > 0 && (
                      <div className="border-t pt-3">
                        <strong className="text-gray-800">Available Volumes:</strong> {product.volumes.join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Shipping */}
              <div className="border-t border-gray-200">
                <button
                  onClick={() => setShippingOpen(!shippingOpen)}
                  className="w-full py-4 flex items-center justify-between text-left"
                >
                  <span className="font-medium text-gray-900">
                    Shipping & Returns
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform ${
                      shippingOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {shippingOpen && (
                  <div className="pb-4 text-sm text-gray-600 leading-relaxed">
                    <p>
                      Free shipping on orders over PKR 5,000. 30-day easy returns
                      policy.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ====== CART DRAWER ====== */}
        <AnimatePresence>
          {showCartDrawer && (
            <CartDrawer onClose={() => setShowCartDrawer(false)} />
          )}
        </AnimatePresence>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default ProductDetail;