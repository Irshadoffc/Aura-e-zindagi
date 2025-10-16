import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, ArrowUpRight, SlidersHorizontal, ArrowUpDown } from "lucide-react";

const products = [
  { id: 1, image: "/Images/Card-1.webp", title: "Leather Watch", category: "For Him", price: "Rs 1,500", rating: 4.5 },
  { id: 2, image: "/Images/Card-2.webp", title: "Handbag", category: "For Her", price: "Rs 2,200", rating: 5 },
  { id: 3, image: "/Images/card-3.webp", title: "Perfume", category: "Unisex", price: "Rs 999", rating: 4 },
  { id: 4, image: "/Images/WhatsApp Image 2025-07-08 at 11.12.23 PM.webp", title: "Wallet", category: "For Him", price: "Rs 750", rating: 4.2 },
  { id: 5, image: "/Images/WhatsApp Image 2025-07-08 at 11.13.28 PM.webp", title: "Sunglasses", category: "For Her", price: "Rs 1,250", rating: 4.8 },
  { id: 6, image: "/Images/WhatsApp Image 2025-07-08 at 11.13.39 PM.webp", title: "Necklace", category: "Unisex", price: "Rs 1,800", rating: 5 },
];

const ProductList = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortType, setSortType] = useState("");

  const navigate = useNavigate();
  const filterRef = useRef(null);
  const sortRef = useRef(null);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Filtering logic
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  // ✅ Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = Number(a.price.replace(/[^0-9]/g, ""));
    const priceB = Number(b.price.replace(/[^0-9]/g, ""));
    if (sortType === "lowToHigh") return priceA - priceB;
    if (sortType === "highToLow") return priceB - priceA;
    return 0;
  });

  const visibleProducts = sortedProducts.slice(0, 4);

  // ✅ Product navigation
  const handleCardClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  return (
    <div className="flex bg-gray-100 h-full w-full justify-center px-0 md:px-2 sm:p-6 sm:px-6">
      <div className="w-full h-full rounded-2xl md:rounded-4xl">
        {/* ✅ Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 px-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">New Arrival</h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              {filteredProducts.length} Products
            </p>
          </div>

          {/* ✅ Filter & Sort */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap relative overflow-visible">
            {/* Filter Dropdown */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white shadow text-gray-700 text-xs sm:text-sm hover:bg-gray-100"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filter
              </button>

              {showFilterDropdown && (
                <div className="absolute top-[110%] left-0 w-36 sm:w-40 bg-white shadow-lg rounded-md border border-gray-200 z-50 text-xs sm:text-sm">
                  <ul>
                    <li
                      onClick={() => {
                        setSelectedCategory("All");
                        setShowFilterDropdown(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      All
                    </li>
                    <li
                      onClick={() => {
                        setSelectedCategory("For Him");
                        setShowFilterDropdown(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Men
                    </li>
                    <li
                      onClick={() => {
                        setSelectedCategory("For Her");
                        setShowFilterDropdown(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Women
                    </li>
                    <li
                      onClick={() => {
                        setSelectedCategory("Unisex");
                        setShowFilterDropdown(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Unisex
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white shadow text-gray-700 text-xs sm:text-sm hover:bg-gray-100"
              >
                <ArrowUpDown className="w-4 h-4" /> Sort By
              </button>

              {showSortDropdown && (
                <div
                  className="absolute top-[110%] right-0 w-40 sm:w-44 bg-white shadow-lg rounded-md border border-gray-200 z-50 text-xs sm:text-sm"
                  style={{ minWidth: "140px" }}
                >
                  <ul>
                    <li
                      onClick={() => {
                        setSortType("lowToHigh");
                        setShowSortDropdown(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Price: Low to High
                    </li>
                    <li
                      onClick={() => {
                        setSortType("highToLow");
                        setShowSortDropdown(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Price: High to Low
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ✅ Product Cards (unchanged) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-3 pb-4 sm:gap-6">
          {visibleProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => handleCardClick(p)}
              className="relative bg-white rounded-3xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
            >
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-[240px] sm:h-[300px] md:h-[380px] object-cover"
              />

              <div className="absolute top-2 left-2 flex items-center text-yellow-400 bg-black/40 px-2 py-0.5 rounded-full text-xs sm:text-sm">
                ⭐ {p.rating}
              </div>

              <div className="absolute top-10 left-2 text-white drop-shadow max-w-[80%]">
                <h3 className="font-medium text-xs sm:text-base leading-tight">
                  {p.title}
                </h3>
                <p className="text-sm sm:text-lg font-semibold">{p.price}</p>
              </div>

              <div className="absolute bottom-2 right-2 flex rounded-full overflow-hidden bg-white shadow">
                <span className="flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 hover:bg-gray-100">
                  <Box className="w-6 h-6 text-gray-700" />
                </span>
                <span className="flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 bg-black text-white hover:bg-gray-800 rounded-full">
                  <ArrowUpRight className="w-6 h-6" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
