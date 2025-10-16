import React, { useState } from "react";
import {
  ChevronDown,
  Search,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const products = [
  {
    id: 1,
    image: "/Images/Card-1.webp",
    name: "mafioso Eau de perfume for men",
    status: "Active",
    category: "Eaux de Parfum",
  },
  {
    id: 2,
    image: "/Images/Card-2.webp",
    name: "ashbourne Eau de Perfume For men",
    status: "Active",
    category: "Eaux de Parfum",
  },
  {
    id: 3,
    image: "/Images/Card-1.webp",
    name: "Bella Mia For female",
    status: "Active",
    category: "Eaux de Parfum",
  },
  {
    id: 4,
    image: "/Images/Card-2.webp",
    name: "Rhea Touched by Bomdshell (Retail $100)",
    status: "Active",
    category: "Uncategorized",
  },
  {
    id: 5,
    image: "/Images/card-3.webp",
    name: "Bella Mia Perfume for Women",
    status: "Active",
    category: "Eaux de Parfum",
  },
  {
    id: 6,
    image: "/Images/card-3.webp",
    name: "Tycoon Eau de Parfum for Men",
    status: "Active",
    category: "Eaux de Parfum",
  },
];

export default function Products() {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortAsc, setSortAsc] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilterField, setSelectedFilterField] = useState("Product");
  const [selectedFilterValue, setSelectedFilterValue] = useState("All");
  const navigate = useNavigate();

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
        <table className="w-full text-left text-sm border border-gray-200 min-w-[600px]">
          <thead className="bg-gray-100 text-gray-700 font-medium border-b border-gray-200">
            <tr>
              <th className="p-3 border-r border-gray-200 w-10">
                <input type="checkbox" />
              </th>
              <th className="p-3 border-r border-gray-200">Product</th>
              <th className="p-3 border-r border-gray-200">Status</th>
              <th className="p-3">Category</th>
            </tr>
          </thead>

          <tbody>
            {displayedProducts.map((p) => (
              <tr
                key={p.id}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="p-3 border-r border-gray-200 w-10">
                  <input type="checkbox" />
                </td>
                <td className="p-3 flex items-center space-x-3 border-r border-gray-200">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <span className="text-sm sm:text-base">{p.name}</span>
                </td>
                <td className="p-3 border-r border-gray-200">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                    {p.status}
                  </span>
                </td>
                <td className="p-3">{p.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
