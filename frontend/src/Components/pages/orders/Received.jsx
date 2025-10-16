import React, { useState } from "react";
import {
  Package,
  Calendar,
  Search,
  ArrowUpDown,
  ListFilter,
  ChevronDown,
  Plus,
  Grid3x2,
} from "lucide-react";

export default function Received() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);

  const receiveOrders = [
    {
      id: "R101",
      date: "07 Oct at 1:45 pm",
      customer: "Ahmed Ali",
      quantity: "25 items",
      total: "Rs 45,000",
      payment: "Paid",
      receivedStatus: "Completed",
    },
    {
      id: "R102",
      date: "06 Oct at 3:12 pm",
      customer: "Hassan Khan",
      quantity: "15 items",
      total: "Rs 27,500",
      payment: "Pending",
      receivedStatus: "In Progress",
    },
    {
      id: "R103",
      date: "05 Oct at 11:20 am",
      customer: "Sana Malik",
      quantity: "30 items",
      total: "Rs 52,000",
      payment: "Paid",
      receivedStatus: "Completed",
    },
    {
      id: "R104",
      date: "03 Oct at 6:45 pm",
      customer: "Zain Iqbal",
      quantity: "20 items",
      total: "Rs 33,800",
      payment: "Pending",
      receivedStatus: "Partially Received",
    },
    {
      id: "R105",
      date: "01 Oct at 2:10 pm",
      customer: "Mahnoor Javed",
      quantity: "12 items",
      total: "Rs 19,400",
      payment: "Paid",
      receivedStatus: "Completed",
    },
    {
      id: "R106",
      date: "29 Sep at 10:05 am",
      customer: "Ali Raza",
      quantity: "18 items",
      total: "Rs 26,700",
      payment: "Pending",
      receivedStatus: "Pending",
    },
    {
      id: "R107",
      date: "27 Sep at 4:30 pm",
      customer: "Noor Fatima",
      quantity: "22 items",
      total: "Rs 37,200",
      payment: "Paid",
      receivedStatus: "Completed",
    },
    {
      id: "R108",
      date: "25 Sep at 12:25 pm",
      customer: "Hamza Tariq",
      quantity: "10 items",
      total: "Rs 14,800",
      payment: "Pending",
      receivedStatus: "In Progress",
    },
  ];

  const tabs = ["All", "Unfulfilled", "Unpaid", "Open", "Archived"];

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleAllOrders = () => {
    if (selectedOrders.length === receiveOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(receiveOrders.map((order) => order.id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      {/* HEADER */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          <h1 className="text-lg sm:text-2xl font-semibold text-gray-900">
            Received Orders
          </h1>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-5 h-5" />
            <span className="text-base font-medium">Today</span>
          </div>
        </div>

        {["Orders", "Items ordered", "Returns", "Orders fulfilled"].map(
          (label, i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5"
            >
              <div className="text-base font-medium">{label}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-semibold">
                  {label.includes("Returns") ? "Rs 0" : "0"}
                </span>
                <span className="text-sm text-gray-400">—</span>
              </div>
              <div
                className="mt-2 h-0.5 bg-blue-500 rounded-full ml-auto"
                style={{ width: "40%" }}
              ></div>
            </div>
          )
        )}
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center gap-1 px-2 sm:px-4 pt-3 border-b border-gray-200 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-t-lg ${
                activeTab === tab
                  ? "text-gray-900 bg-gray-100"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
          <button className="px-2 sm:px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg ml-1">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-2 sm:px-4 py-3 border-b border-gray-200 gap-2">
          <div></div>
          <div className="flex items-center gap-2 flex-wrap">
           
            <button className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition">
              <Grid3x2 className="w-5 h-5 text-gray-700" />
            </button>
            <button className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition">
              <ArrowUpDown className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto relative max-w-full">
          <table className="min-w-[850px] sm:min-w-[1000px] md:min-w-[1200px] text-sm border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="sticky left-0 bg-gray-50 z-20 px-3 py-3 text-left w-10 sm:w-12">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === receiveOrders.length}
                    onChange={toggleAllOrders}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="sticky left-10 sm:left-12 bg-gray-50 z-20 px-3 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap w-32 sm:w-40">
                  Order
                </th>

                {[
                  "Date",
                  "Customer",
                  "Quantity",
                  "Total",
                  "Payment Status",
                  "Received Status",
                ].map((header, index) => (
                  <th
                    key={index}
                    className="px-3 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap w-40 sm:w-48"
                  >
                    {header === "Date" ? (
                      <div className="flex items-center gap-1">
                        {header}
                        <ChevronDown className="w-3 h-3" />
                      </div>
                    ) : (
                      header
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {receiveOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50"
                  onMouseEnter={() => setHoveredRow(order.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="sticky left-0 bg-white z-20 px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleOrderSelection(order.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="sticky left-10 sm:left-12 bg-white z-20 px-3 py-2 text-sm font-medium text-blue-600 whitespace-nowrap">
                    #{order.id}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-900 whitespace-nowrap">
                    {order.date}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-900 whitespace-nowrap">
                    {order.customer}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-900 whitespace-nowrap">
                    {order.quantity}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-900 whitespace-nowrap">
                    {order.total}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                        order.payment === "Paid"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-orange-50 text-orange-700"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full border-2 ${
                          order.payment === "Paid"
                            ? "bg-gray-500 border-gray-500"
                            : "border-orange-500"
                        }`}
                      ></span>
                      {order.payment}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 whitespace-nowrap">
                      <span className="w-2 h-2 rounded-full border-2 border-yellow-500"></span>
                      {order.receivedStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
