import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Search,
  Filter,
  ArrowUpDown,
  Edit,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../api/Axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortAsc, setSortAsc] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilterField, setSelectedFilterField] = useState("Product");
  const [selectedFilterValue, setSelectedFilterValue] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products?show_all=true&t=' + Date.now());
      console.log('Products data:', response.data.products);
      console.log('First product full data:', response.data.products[0] || 'No products');
      console.log('Brand field check:', response.data.products[0] ? {
        brand_name: response.data.products[0].brand_name,
        brand: response.data.products[0].brand,
        stock_quantity: response.data.products[0].stock_quantity,
        minimum_stock: response.data.products[0].minimum_stock
      } : 'No products');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter + Sort logic
  const displayedProducts = [...products]
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((p) => {
      if (selectedFilterValue === "All") return true;
      if (selectedFilterField === "Product") return p.name === selectedFilterValue;
      if (selectedFilterField === "Status") return p.status === selectedFilterValue;
      if (selectedFilterField === "Category") return p.category === selectedFilterValue;
      return true;
    })
    .sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

  const getUniqueOptions = (field) => {
    if (field === "Product") return ["All", ...new Set(products.map((p) => p.name))];
    if (field === "Status") return ["All", ...new Set(products.map((p) => p.status))];
    if (field === "Category") return ["All", ...new Set(products.map((p) => p.category))];
    return ["All"];
  };

  const handleDelete = async (productId, productName) => {
    // Show confirmation toast
    toast.warn(
      <div>
        <p>Delete "{productName}"?</p>
        <div className="mt-2 flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss();
              try {
                await api.delete(`/products/${productId}`);
                setProducts(products.filter(p => p.id !== productId));
                toast.success('✅ Product deleted successfully!');
              } catch (error) {
                console.error('Error deleting product:', error);
                toast.error('❌ Failed to delete product. Please try again.');
              }
            }}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const handleToggleVisibility = async (productId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'show' : 'hide';
    
    // Show confirmation toast
    toast.warn(
      <div>
        <p>{action === 'show' ? '👁️ Show' : '🙈 Hide'} this product?</p>
        <div className="mt-2 flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss();
              try {
                await api.put(`/products/${productId}`, { status: newStatus });
                setProducts(products.map(p => 
                  p.id === productId ? { ...p, status: newStatus } : p
                ));
                toast.success(`✅ Product ${action === 'show' ? 'shown' : 'hidden'} successfully!`);
              } catch (error) {
                console.error('Error updating product visibility:', error);
                toast.error('❌ Failed to update product visibility. Please try again.');
              }
            }}
            className={`${action === 'show' ? 'bg-green-500' : 'bg-yellow-500'} text-white px-3 py-1 rounded text-sm`}
          >
            {action === 'show' ? 'Show' : 'Hide'}
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
        <h1 className="text-lg sm:text-2xl font-semibold">Products</h1>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 relative">
          <button
            onClick={() => navigate("/add-product")}
            className="bg-black text-white px-3 py-2 rounded-md shadow hover:bg-gray-800 text-sm"
          >
            Add product
          </button>
        </div>
      </div>

      {/* Filters + Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div className="flex flex-wrap gap-2">
          {["All"].map((label) => (
            <button
              key={label}
              className="px-4 py-1.5 rounded-md bg-gray-100 text-gray-700 text-sm hover:bg-gray-200"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Icons */}
        <div className="flex gap-2">
          {[Search, Filter, ArrowUpDown].map((Icon, i) => (
            <button
              key={i}
              className="p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
              onClick={() => {
                if (Icon === Search) {
                  setShowSearchBar((prev) => !prev);
                  setShowFilters(false);
                } else if (Icon === Filter) {
                  setShowFilters((prev) => !prev);
                  setShowSearchBar(false);
                } else if (Icon === ArrowUpDown) {
                  setSortAsc((prev) => !prev);
                }
              }}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      {showSearchBar && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      )}

      {/* Filter Dropdowns */}
      {showFilters && (
        <div className="mb-4 p-3 bg-white rounded-md shadow flex flex-wrap gap-3">
          {["Product", "Status", "Category"].map((field) => (
            <div key={field} className="relative">
              <button
                className="px-3 py-2 bg-gray-100 rounded-md shadow hover:bg-gray-200 text-sm flex items-center gap-1"
                onClick={() => setSelectedFilterField(field)}
              >
                {field}: {selectedFilterField === field ? selectedFilterValue : "All"}
                <ChevronDown className="w-4 h-4" />
              </button>
              {selectedFilterField === field && (
                <div className="absolute mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-40 overflow-auto">
                  {getUniqueOptions(field).map((val) => (
                    <div
                      key={val}
                      className="px-3 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => setSelectedFilterValue(val)}
                    >
                      {val}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Table Section */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm border border-gray-200 min-w-[600px]">
            <thead className="bg-gray-100 text-gray-700 font-medium border-b border-gray-200">
              <tr>
                <th className="p-3 border-r border-gray-200 w-10">
                  <input type="checkbox" />
                </th>
                <th className="p-3 border-r border-gray-200">Product</th>
                <th className="p-3 border-r border-gray-200">Brand</th>
                <th className="p-3 border-r border-gray-200">Price</th>
                <th className="p-3 border-r border-gray-200">Stock</th>
                <th className="p-3 border-r border-gray-200">Status</th>
                <th className="p-3 border-r border-gray-200">Category</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {displayedProducts.length > 0 ? displayedProducts.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="p-3 border-r border-gray-200 w-10">
                    <input type="checkbox" />
                  </td>
                  <td className="p-3 flex items-center space-x-3 border-r border-gray-200">
                    <img
                      src={p.image ? 
                        (p.image.startsWith('uploads/') ? `http://127.0.0.1:8000/${p.image}` : `/${p.image}`) 
                        : '/Images/Card-1.webp'
                      }
                      alt={p.name}
                      className="w-10 h-10 rounded object-cover"
                      onError={(e) => {
                        e.target.src = '/Images/Card-1.webp';
                      }}
                    />
                    <span className="text-sm sm:text-base">{p.name}</span>
                  </td>
                  <td className="p-3 border-r border-gray-200">{p.brand_name}</td>
                  <td className="p-3 border-r border-gray-200">PKR {parseFloat(p.price).toLocaleString()}</td>
                  <td className="p-3 border-r border-gray-200">
                    <div className="flex flex-col">
                      <span className="font-medium">{p.stock_quantity || 0}</span>
                      <span className="text-xs text-gray-500">Min: {p.minimum_stock || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="p-3 border-r border-gray-200">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      p.stock_status === 'out_of_stock' ? 'bg-red-100 text-red-700' :
                      p.stock_status === 'low_stock' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {p.stock_status === 'out_of_stock' ? 'Out of Stock' :
                       p.stock_status === 'low_stock' ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td className="p-3 border-r border-gray-200">{p.category}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => navigate(`/edit-product/${p.id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleVisibility(p.id, p.status)}
                        className={`p-2 rounded transition ${
                          p.status === 'active' 
                            ? 'text-green-600 hover:bg-green-50' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                        title={p.status === 'active' ? 'Hide Product' : 'Show Product'}
                      >
                        {p.status === 'active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
