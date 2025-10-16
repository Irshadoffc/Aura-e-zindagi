import React, { useState } from "react";
import {
  Search,
  Plus,
  ArrowUpDown,
  LayoutGrid,
  Upload,
  Download,
  Box,
} from "lucide-react"; // ✅ make sure this line ends with a semicolon

const inventoryData = [
  {
    id: 1,
    name: "ashbourne Eau de Perfume For men",
    sku: "No SKU",
    unavailable: 0,
    committed: 0,
    available: 88,
    onHand: 88,
    image: "/images/Card-1.webp",
  },
  {
    id: 2,
    name: "Bella Mia For female",
    sku: "No SKU",
    unavailable: 0,
    committed: 8,
    available: 33,
    onHand: 41,
    image: "/images/Card-2.webp",
  },
  {
    id: 3,
    name: "Bella Mia Perfume for Women",
    sku: "No SKU",
    unavailable: 0,
    committed: 0,
    available: 50,
    onHand: 50,
    image: "/images/card-3.webp",
  },
  {
    id: 4,
    name: "mafioso Eau de perfume for men",
    sku: "No SKU",
    unavailable: 0,
    committed: 0,
    available: 0,
    onHand: 0,
    image: "/images/WhatsApp Image 2025-07-08 at 11.13.39 PM.webp",
  },
  {
    id: 5,
    name: "Rhea Touched by Bombshell (Retail $100)",
    sku: "No SKU",
    unavailable: 0,
    committed: 1,
    available: 8,
    onHand: 9,
    image: "/images/Card-1.webp",
  },
];

const Inventory = () => {
  const [selectedRows, setSelectedRows] = useState([]);

  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === inventoryData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(inventoryData.map((r) => r.id));
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex justify-center px-3 py-6">
      <div className="w-full max-w-6xl bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Box className="w-5 h-5 text-gray-700" />
            Inventory
          </h2>
          
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-100">
              All
            </button>
           
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-300 rounded-md bg-white hover:bg-gray-100">
              <button className="p-1.5 border-r border-gray-300">
                <Search className="w-4 h-4 text-gray-700" />
              </button>
              <button className="p-1.5">
                <LayoutGrid className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            <button className="p-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-100">
              <ArrowUpDown className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="w-10 px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === inventoryData.length}
                    onChange={toggleAll}
                    className="accent-gray-700"
                  />
                </th>
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">SKU</th>
                <th className="px-4 py-2 text-right">Unavailable</th>
                <th className="px-4 py-2 text-right">Committed</th>
                <th className="px-4 py-2 text-right">Available</th>
                <th className="px-4 py-2 text-right">On hand</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(item.id)}
                      onChange={() => toggleRow(item.id)}
                      className="accent-gray-700"
                    />
                  </td>
                  <td className="px-4 py-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md overflow-hidden border border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-gray-800">
                      {item.name}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-500">{item.sku}</td>
                  <td className="px-4 py-2 text-right">{item.unavailable}</td>
                  <td className="px-4 py-2 text-right">{item.committed}</td>
                  <td className="px-4 py-2 text-right">
                    <input
                      type="number"
                      defaultValue={item.available}
                      className="w-16 border border-gray-300 rounded-md text-right px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <input
                      type="number"
                      defaultValue={item.onHand}
                      className="w-16 border border-gray-300 rounded-md text-right px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
