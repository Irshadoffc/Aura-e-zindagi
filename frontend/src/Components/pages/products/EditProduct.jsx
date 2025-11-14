import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../api/Axios";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [testers, setTesters] = useState([{ name: '', price: '', image: null }]);
  const [volumes, setVolumes] = useState(['']);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      const product = response.data.product;
      
      setFormData({
        name: product.name || '',
        description: product.description || '',
        brand_name: product.brand_name || '',
        category: product.category || 'mens',
        price: product.price || '',
        discount_percentage: product.discount_percentage || 0,
        stock_quantity: product.stock_quantity || '',
        minimum_stock: product.minimum_stock || 10
      });

      if (product.image) {
        const imageUrl = product.image.startsWith('uploads/') 
          ? `http://127.0.0.1:8000/${product.image}` 
          : `/${product.image}`;
        setCurrentImage(imageUrl);
      }

      if (product.volumes && product.volumes.length > 0) {
        setVolumes(product.volumes.map(v => v.replace('ml', '')));
      }

      if (product.testers && product.testers.length > 0) {
        setTesters(product.testers.map(t => ({
          id: t.id,
          name: t.name,
          price: t.price,
          image: null,
          currentImage: t.image ? 
            (t.image.startsWith('uploads/') ? `http://127.0.0.1:8000/${t.image}` : `/${t.image}`) 
            : null
        })));
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product data');
    } finally {
      setFetchLoading(false);
    }
  };

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
      
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      const validVolumes = volumes.filter(v => v.trim()).map(v => `${v}ml`);
      formDataToSend.append('volumes', JSON.stringify(validVolumes));

      testers.forEach((tester, index) => {
        if (tester.name && tester.price) {
          formDataToSend.append(`testers[${index}][name]`, tester.name);
          formDataToSend.append(`testers[${index}][price]`, tester.price);
          if (tester.image) formDataToSend.append(`testers[${index}][image]`, tester.image);
        }
      });

      // Add method override for Laravel
      formDataToSend.append('_method', 'PUT');
      
      const response = await api.post(`/products/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('Product updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      
      setTimeout(() => {
        navigate('/products');
      }, 2000);
      
    } catch (error) {
      console.error('Update error:', error);
      console.error('Error response:', error.response);
      const message = error.response?.data?.message || 'Failed to update product';
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <ToastContainer />
      <div className="text-sm text-gray-500 mb-6">
        <span className="hover:text-gray-700 cursor-pointer">Products</span> /
        <span className="text-gray-700 font-medium"> Edit Product</span>
      </div>

      <h1 className="text-2xl font-semibold text-gray-900 mb-2">
        Edit Product
      </h1>
      <p className="text-gray-500 mb-8">
        Update product information
      </p>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    placeholder="Enter perfume name"
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
                    placeholder="Describe the perfume..."
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
                    placeholder="Enter available quantity"
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
                    placeholder="Enter brand name"
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
                    placeholder="Minimum stock alert level"
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
                    placeholder="Enter original price in PKR"
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
                    placeholder="Discount %"
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
                {(imagePreview || currentImage) && (
                  <div className="relative">
                    <img
                      src={imagePreview || currentImage}
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
                {loading ? 'Updating...' : 'Update Product'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;