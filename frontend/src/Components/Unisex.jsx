import React, { useState, useRef, useEffect } from "react";
import {
  SlidersHorizontal,
  ArrowUpDown,
  Box,
  ArrowUpRight,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import SocialMediaToggle from "./Socialmedia";

const productsData = [
  {
    id: "1",
    name: "MODERN UNISEX CHAIR",
    price: 6499,
    rating: 4.3,
    image: "/Images/Card-1.webp",
    description: "Stylish chair suitable for both men and women, with modern design.",
  },
  {
    id: "2",
    name: "CLASSIC UNISEX SEAT",
    price: 7599,
    rating: 4.5,
    image: "/Images/Card-2.webp",
    description: "Comfortable unisex seat with elegant design for any interior.",
  },
  {
    id: "3",
    name: "ELEGANT UNISEX ARMCHAIR",
    price: 8999,
    rating: 4.7,
    image: "/Images/card-3.webp",
    description: "Elegant armchair that fits perfectly in modern homes for everyone.",
  },
  {
    id: "4",
    name: "FUTURISTIC UNISEX CHAIR",
    price: 9999,
    rating: 4.6,
    image: "/Images/Card-2.webp",
    description: "Futuristic unisex chair combining style and comfort.",
  },
  {
    id: "5",
    name: "CREAM UNISEX LOUNGE CHAIR",
    price: 8499,
    rating: 4.4,
    image: "/Images/card-3.webp",
    description: "Soft cream lounge chair suitable for all genders with premium comfort.",
  },
];

export default function Unisex() {
  const navigate = useNavigate();

  const [sortDropdown, setSortDropdown] = useState(false);
  const [sortType, setSortType] = useState(""); // "" | "lowToHigh" | "highToLow"
  const sortRef = useRef(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortedProducts = [...productsData].sort((a, b) => {
    if (sortType === "lowToHigh") return a.price - b.price;
    if (sortType === "highToLow") return b.price - a.price;
    return 0;
  });

  const handleCardClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  return (
    <>
      <Navbar />
      <SocialMediaToggle />

      <div className=" min-h-screen mt-20 flex justify-center py-6  sm:py-10 sm:px-6">
        <div className="w-full max-w-7xl rounded-[3%] bg-white p-[10px]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="ml-6 mt-4">
              <h2 className="text-lg sm:text-xl font-semibold">Top Selling Unisex Items</h2>
              <p className="text-gray-500 text-xs sm:text-sm">{productsData.length} Products</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap relative">

              {/* Sort By */}
              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => setSortDropdown(!sortDropdown)}
                  className="flex items-center gap-1 mr-5 px-3 ml-2 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white shadow text-gray-700 text-xs sm:text-sm hover:bg-gray-100"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 sm:w-4 text-center sm:h-4 ml-3" /> Sort By
                </button>

                {sortDropdown && (
                  <div
                    className="absolute top-full mt-1  right-0 w-36 sm:w-44 bg-white shadow-lg rounded-md border border-gray-200 z-50"
                  >
                    <ul className="text-xs sm:text-sm">
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSortType("lowToHigh");
                          setSortDropdown(false);
                        }}
                      >
                        Price: Low to High
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSortType("highToLow");
                          setSortDropdown(false);
                        }}
                      >
                        Price: High to Low
                      </li>
                    </ul>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 rounded-4xl  md:grid-cols-4 gap-4  sm:gap-4">
            {sortedProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => handleCardClick(p)}
                className="relative bg-white rounded-2xl sm:rounded-4xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-[250px] sm:h-[320px] md:h-[420px] object-cover"
                />

                <div className="absolute top-2 left-2 flex items-center text-yellow-400 bg-black/40 px-2 py-0.5 rounded-full text-xs sm:text-sm">
                  ⭐ {p.rating}
                </div>

                <div className="absolute top-12 sm:top-14 left-2 sm:left-3 text-white drop-shadow max-w-[80%]">
                  <h3 className="font-medium text-sm sm:text-base leading-tight">{p.name}</h3>
                  <p className="text-base sm:text-lg font-bold">${p.price}</p>
                </div>

                <div className="absolute bottom-2 sm:bottom-3 bg-white rounded-full right-2 sm:right-3 flex">
                  <div className="flex overflow-hidden rounded-full shadow">
                    <span className="flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 hover:bg-gray-100">
                      <Box className="w-6 h-6 text-gray-700" />
                    </span>
                    <span className="flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 bg-black text-white hover:bg-gray-800 rounded-full">
                      <ArrowUpRight className="w-6 h-6" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
