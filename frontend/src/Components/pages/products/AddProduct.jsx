import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../api/Axios";

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand_name: '',
    category: 'mens',
    fragrance_type: 'EDP',
    notes: '',
    original_price: '',
    price: '',
    discount_percentage: 0,
    stock_quantity: '',
    minimum_stock: 10
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    
    // Auto-calculate price when original_price or discount changes
    if (name === 'original_price' || name === 'discount_percentage') {
      const originalPrice = name === 'original_price' ? parseFloat(value) : parseFloat(formData.original_price);
      const discount = name === 'discount_percentage' ? parseFloat(value) : parseFloat(formData.discount_percentage);
      
      if (originalPrice && discount >= 0) {
        const discountedPrice = originalPrice - (originalPrice * discount / 100);
        updatedData.price = discountedPrice.toFixed(2);
      }
    }
    
    setFormData(updatedData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Append image if selected
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      const response = await api.post('/products', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('Product created successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        brand_name: '',
        category: 'mens',
        fragrance_type: 'EDP',
        notes: '',
        original_price: '',
        price: '',
        discount_percentage: 0,
        stock_quantity: '',
        minimum_stock: 10
      });
      setSelectedImage(null);
      setImagePreview(null);
      
      // Redirect to products page after 2 seconds
      setTimeout(() => {
        navigate('/products');
      }, 2000);
      
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create product';
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <ToastContainer />
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <span className="hover:text-gray-700 cursor-pointer">Products</span> /
        <span className="text-gray-700 font-medium"> Add New Product</span>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">
        Add New Product
      </h1>
      <p className="text-gray-500 mb-8">
        Add a new perfume to your store
      </p>

      {/* Main Grid */}
      <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE (Main Info) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Name & Description */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Name and Description</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Perfume Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter perfume name (e.g., Chanel No. 5)"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Perfume Description
                </label>
                <textarea
                  rows="6"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the perfume's scent, longevity, and unique features..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Perfume Category
                </label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="mens">Men's Perfume</option>
                  <option value="womens">Women's Perfume</option>
                  <option value="unisex">Unisex Perfume</option>
                  <option value="special_offer">Special Offer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Perfume Volume (ml)
                </label>
                <select 
                  name="fragrance_type"
                  value={formData.fragrance_type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="EDP">Eau de Parfum (EDP)</option>
                  <option value="EDT">Eau de Toilette (EDT)</option>
                  <option value="EDC">Eau de Cologne (EDC)</option>
                  <option value="Oil">Perfume Oil</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stock */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Manage Stock</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Keeping Unit
                </label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  placeholder="Enter available quantity (e.g., 100)"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Stock
                </label>
                <input
                  type="number"
                  name="minimum_stock"
                  value={formData.minimum_stock}
                  onChange={handleChange}
                  placeholder="Minimum stock alert level (e.g., 5)"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Stock
                </label>
                <input
                  type="text"
                  name="brand_name"
                  value={formData.brand_name}
                  onChange={handleChange}
                  placeholder="Enter brand name (e.g., Chanel, Dior)"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* Product Details */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Perfume Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Enter brand name (e.g., Chanel, Dior)"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fragrance Type
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option>Eau de Parfum (EDP)</option>
                  <option>Eau de Toilette (EDT)</option>
                  <option>Eau de Cologne (EDC)</option>
                  <option>Perfume Oil</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Original Price
                </label>
                <input
                  type="number"
                  name="original_price"
                  value={formData.original_price || ''}
                  onChange={handleChange}
                  placeholder="Enter original price (e.g., 100.00)"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Final Price (Auto-calculated)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  placeholder="Auto-calculated price"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount %
                </label>
                <input
                  type="number"
                  name="discount_percentage"
                  value={formData.discount_percentage}
                  onChange={handleChange}
                  placeholder="Discount % (e.g., 10 for 10% off)"
                  min="0"
                  max="100"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Product Image */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Product Images</h2>
            <div className="flex gap-4 flex-wrap">
              <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 text-sm cursor-pointer hover:border-indigo-500 hover:text-indigo-500 transition">
                <span>Click to Upload</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="product preview"
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                  <button 
                    type="button"
                    onClick={removeImage}
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded-md"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button 
              type="button"
              onClick={() => navigate('/products')}
              className="border border-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-100"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Adding...' : '+ Add Product'}
            </button>
          </div>
        </div>
      </div>
      </form>
    </div>
  );
};

export default AddProduct;
