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
    price: '',
    discount_percentage: 0,
    stock_quantity: '',
    minimum_stock: 10
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testers, setTesters] = useState([{ name: '', price: '', image: null }]);
  const [volumes, setVolumes] = useState(['']);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const addTester = () => setTesters([...testers, { name: '', price: '', image: null }]);
  const removeTester = (index) => setTesters(testers.filter((_, i) => i !== index));
  const updateTester = (index, field, value) => {
    const updated = [...testers];
    updated[index][field] = value;
    setTesters(updated);
  };

  const addVolume = () => setVolumes([...volumes, '']);
  const removeVolume = (index) => setVolumes(volumes.filter((_, i) => i !== index));
  const updateVolume = (index, value) => {
    const updated = [...volumes];
    updated[index] = value;
    setVolumes(updated);
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

      // Append volumes with ml suffix
      const validVolumes = volumes.filter(v => v.trim()).map(v => `${v}ml`);
      formDataToSend.append('volumes', JSON.stringify(validVolumes));

      // Append testers
      testers.forEach((tester, index) => {
        if (tester.name && tester.price) {
          formDataToSend.append(`testers[${index}][name]`, tester.name);
          formDataToSend.append(`testers[${index}][price]`, tester.price);
          if (tester.image) formDataToSend.append(`testers[${index}][image]`, tester.image);
        }
      });

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
        price: '',
        discount_percentage: 0,
        stock_quantity: '',
        minimum_stock: 10
      });
      setTesters([{ name: '', price: '', image: null }]);
      setVolumes(['']);
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
            <div className="grid grid-cols-1 gap-4">
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


            </div>
          </div>

          {/* Stock */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Manage Stock</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Brand Name
                </label>
                <input
                  type="text"
                  name="brand_name"
                  value={formData.brand_name}
                  onChange={handleChange}
                  placeholder="Enter brand name (e.g., Chanel, Dior)"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Stock
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
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Available Volumes</label>
                  <button type="button" onClick={addVolume} className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700">+ Add</button>
                </div>
                {volumes.map((volume, index) => (
                  <div key={index} className="flex gap-2 mb-2 items-center">
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={volume}
                        onChange={(e) => updateVolume(index, e.target.value)}
                        placeholder="50"
                        min="1"
                        className="w-16 border border-gray-300 rounded-l-md px-2 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <span className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-2 py-2 text-sm text-gray-600">ml</span>
                    </div>
                    {volumes.length > 1 && (
                      <button type="button" onClick={() => removeVolume(index)} className="text-red-600 text-xs hover:bg-red-50 rounded px-1">×</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* Pricing */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Pricing</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Original Price (PKR)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter original price in PKR (e.g., 2500)"
                  step="1"
                  min="0"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Final Price (PKR)
                </label>
                <input
                  type="number"
                  value={formData.price && formData.discount_percentage ? (formData.price - (formData.price * formData.discount_percentage / 100)).toFixed(0) : formData.price || ''}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-100"
                  readOnly
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

          {/* Testers */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Product Testers</h2>
              <button type="button" onClick={addTester} className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700">+ Add Tester</button>
            </div>
            {testers.map((tester, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Tester {index + 1}</h3>
                  {testers.length > 1 && <button type="button" onClick={() => removeTester(index)} className="text-red-600 text-sm">Remove</button>}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input type="text" value={tester.name} onChange={(e) => updateTester(index, 'name', e.target.value)} placeholder="Tester name" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                  <input type="number" value={tester.price} onChange={(e) => updateTester(index, 'price', e.target.value)} placeholder="Price (PKR)" step="1" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <input type="file" accept="image/*" onChange={(e) => updateTester(index, 'image', e.target.files[0])} className="w-full text-sm" />
              </div>
            ))}
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