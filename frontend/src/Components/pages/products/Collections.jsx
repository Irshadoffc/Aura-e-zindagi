import React, { useState } from "react";
import { Search, Plus, ArrowUpDown, BarChart3, LayoutGrid, Folder } from "lucide-react";

const rows = [
  { id: 1, title: "Special Offer", products: 7, img: "/Images/Card-1.webp" },
  { id: 2, title: "Home page", products: 4, img: "/Images/Card-2.webp" },
  { id: 3, title: "Women Perfumes", products: 2, img: "/Images/card-3.webp" },
  { id: 4, title: "Men Perfumes", products: 4, img: "/Images/WhatsApp Image 2025-07-08 at 11.12.23 PM.webp" },
];

const Collection = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === rows.length) setSelectedRows([]);
    else setSelectedRows(rows.map((r) => r.id));
  };

  // Filtered & Sorted rows
  const displayedRows = [...rows]
    .filter((r) => r.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => (sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)));

  return (
    <div className="min-h-screen w-full bg-gray-50 flex justify-center px-2 py-6">
      <div className="w-full max-w-5xl bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Folder className="w-5 h-5 text-gray-700" />
            Collections
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
              <button
                className="p-1.5 border-r border-gray-300"
                onClick={() => {
                  setShowSearchBar((prev) => !prev);
                }}
              >
                <Search className="w-4 h-4 text-gray-700" />
              </button>

            </div>

            <button
              className="p-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-100"
              onClick={() => setSortAsc((prev) => !prev)}
            >
              <ArrowUpDown className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearchBar && (
          <div className="mb-4 px-4 py-2">
            <input
              type="text"
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="w-10 px-3 py-2 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === rows.length}
                    onChange={toggleAll}
                    className="accent-gray-700"
                  />
                </th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-right">Products</th>
                <th className="px-4 py-2 text-left">Product conditions</th>
              </tr>
            </thead>
            <tbody>
              {displayedRows.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(r.id)}
                      onChange={() => toggleRow(r.id)}
                      className="accent-gray-700"
                    />
                  </td>
                  <td className="px-4 py-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md overflow-hidden border border-gray-200">
                      <img src={r.img} alt={r.title} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-medium text-gray-800">{r.title}</span>
                  </td>
                  <td className="px-4 py-2 text-right">{r.products}</td>
                  <td className="px-4 py-2 text-gray-500 text-sm"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {/* <div className="text-center py-5 text-sm text-gray-500 border-t border-gray-200">
          Learn more about collections
        </div> */}
      </div>
    </div>
  );
};

export default Collection;