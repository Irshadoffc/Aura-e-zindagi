import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";

export default function ResponsiveChannelDropdown() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("All channels");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const dropdownRef = useRef(null);

  const options = [
    "All channels",
    "Online Store",
    "Shopify POS (Phase 2 Al Ghani Garden)",
    "Other",
  ];

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Detect screen resize for responsiveness
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hide completely on large screens (>=1024)
  if (!isMobile) return null;

  return (
    <div className="relative inline-block w-full max-w-[140px]" ref={dropdownRef}>
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full bg-white px-4 py-2 rounded-lg 
                   text-sm shadow-md font-semibold"
      >
        <span className="truncate">{selected}</span>
        <FiChevronDown className="text-gray-700 flex-shrink-0 mt-1 text-lg ml-1" />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {options.map((option, i) => (
            <div
              key={i}
              className={`flex justify-between items-center px-4 py-2 cursor-pointer text-sm font-medium
                ${
                  selected === option
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              onClick={() => {
                setSelected(option);
                setOpen(false);
              }}
            >
              <span className="truncate">{option}</span>
              {selected === option && <FiCheck className="text-gray-700 ml-2" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}