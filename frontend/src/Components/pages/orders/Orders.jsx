import React, { useState, useEffect } from "react";
import {
  Package,
  Calendar,
  Search,
  ArrowUpDown,
  ChevronDown,
  X,
} from "lucide-react";
import api from "../../../api/Axios";

export default function Orders() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("Order");
  const [dateFilter, setDateFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "total", direction: "asc" });
  const [editingOrder, setEditingOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      const apiOrders = response.data.orders.map(order => ({
        id: order.id.toString(),
        date: new Date(order.created_at).toISOString().split('T')[0],
        customer: order.customer_name,
        total: `PKR ${order.total_amount.toLocaleString()}`,
        payment: order.payment_status === 'pending' ? 'Unpaid' : 'Paid',
        fulfillment: order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1),
        items: `${order.order_items.length} item${order.order_items.length > 1 ? 's' : ''}`,
        deliverymethod: order.payment_method === 'COD' ? 'Cash on Delivery' : 'Bank Transfer',
        rawOrder: order
      }));
      setOrders(apiOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const toggleAllOrders = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((order) => order.id));
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const aTotal = Number(a.total.replace(/[^0-9.-]+/g, ""));
    const bTotal = Number(b.total.replace(/[^0-9.-]+/g, ""));
    if (aTotal < bTotal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aTotal > bTotal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSort = () => {
    setSortConfig((prev) => ({
      key: "total",
      direction: prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // ✅ Filtering logic with search + date
  const filteredOrders = sortedOrders.filter((order) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      order.id.toString().includes(term) ||
      order.customer.toLowerCase().includes(term) ||
      order.payment.toLowerCase().includes(term);
    const matchesDate = dateFilter ? order.date === dateFilter : true;
    return matchesSearch && matchesDate;
  });

  // ✅ Summary counts
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.fulfillment === "Pending").length;
  const deliveredOrders = orders.filter((o) => o.fulfillment === "Delivered").length;
  const unpaidOrders = orders.filter((o) => o.payment === "Unpaid").length;

  const handleUpdate = async (updated) => {
    try {
      const statusMap = {
        'Pending': 'pending',
        'Delivered': 'delivered', 
        'Return': 'cancelled'
      };
      const paymentMap = {
        'Unpaid': 'pending',
        'Paid': 'paid'
      };
      
      await api.put(`/orders/${updated.id}`, {
        order_status: statusMap[updated.fulfillment],
        payment_status: paymentMap[updated.payment]
      });
      
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      setEditingOrder(null);
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6" />
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Orders</h1>
        </div>
      </div>

      {/* ✅ Dynamic Stats */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg border p-4 flex flex-col justify-between">
          <div className="text-sm font-medium text-gray-700">Total Orders</div>
          <div className="text-2xl font-semibold">{totalOrders}</div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex flex-col justify-between">
          <div className="text-sm font-medium text-gray-700">Pending Orders</div>
          <div className="text-2xl font-semibold text-yellow-600">{pendingOrders}</div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex flex-col justify-between">
          <div className="text-sm font-medium text-gray-700">Delivered Orders</div>
          <div className="text-2xl font-semibold text-green-600">{deliveredOrders}</div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex flex-col justify-between">
          <div className="text-sm font-medium text-gray-700">Unpaid Orders</div>
          <div className="text-2xl font-semibold text-red-600">{unpaidOrders}</div>
        </div>
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Loading orders...</p>
        </div>
      ) : (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Toolbar: Search + Date */}
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between px-4 py-3 border-b border-gray-200 gap-2">
          <div className="flex flex-wrap md:flex-nowrap items-center gap-2 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex items-center w-full md:w-72">
              <Search className="absolute left-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Order ID, Name or Payment"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg py-2 pl-9 pr-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Date Picker */}
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none w-full md:w-auto"
            />
          </div>

          {/* Sort Button */}
          <button
            className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            onClick={toggleSort}
          >
            <ArrowUpDown className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto relative max-w-full">
          <table className="min-w-[1600px] text-sm border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="sticky left-0 bg-gray-50 z-20 px-4 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === orders.length}
                    onChange={toggleAllOrders}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="sticky left-12 bg-gray-50 z-20 px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap w-40">
                  Order
                </th>

                {[
                  "Date",
                  "Customer",
                  "Address",
                  "Total",
                  "Payment status",
                  "Order status",
                  "Items",
                  "Delivery method",
                ].map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap w-48"
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap w-32">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50"
                  onMouseEnter={() => setHoveredRow(order.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="sticky left-0 bg-white z-20 px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleOrderSelection(order.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="sticky left-12 bg-white z-20 px-4 py-2 text-sm font-medium text-blue-600 whitespace-nowrap">
                    #{order.id}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                    {order.date}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                    {order.customer}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600 whitespace-nowrap max-w-xs truncate" title={`${order.rawOrder?.customer_address || 'N/A'}, ${order.rawOrder?.customer_city || 'N/A'}`}>
                    {order.rawOrder?.customer_address ? `${order.rawOrder.customer_address}, ${order.rawOrder.customer_city}` : 'N/A'}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                    {order.total}
                  </td>

                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${order.payment === "Paid"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-orange-50 text-orange-700"
                        }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full border-2 ${order.payment === "Paid"
                          ? "bg-gray-500 border-gray-500"
                          : "border-orange-500"
                          }`}
                      ></span>
                      {order.payment}
                    </span>
                  </td>

                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${order.fulfillment === "Delivered"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : order.fulfillment === "Pending"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-red-50 text-red-700"
                        }`}
                    >
                      <span className="w-2 h-2 rounded-full border-2 border-current"></span>
                      {order.fulfillment}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                    {order.items}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                    {order.deliverymethod}
                  </td>

                  <td className="px-4 py-2 text-sm text-gray-700">
                    <button
                      onClick={() => setEditingOrder({ ...order })}
                      className="text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md px-2 py-1 transition-colors duration-200"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Edit Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 relative shadow-lg">
            <button
              onClick={() => setEditingOrder(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Edit Order #{editingOrder.id}
            </h2>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700">
                <strong>Customer:</strong> {editingOrder.customer}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Phone:</strong> {editingOrder.rawOrder?.customer_phone || 'N/A'}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Email:</strong> {editingOrder.rawOrder?.customer_email || 'N/A'}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Address:</strong> {editingOrder.rawOrder?.customer_address || 'N/A'}
              </p>
              <p className="text-sm text-gray-700">
                <strong>City:</strong> {editingOrder.rawOrder?.customer_city || 'N/A'}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Postal Code:</strong> {editingOrder.rawOrder?.customer_postal_code || 'N/A'}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Date:</strong> {editingOrder.date}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Total:</strong> {editingOrder.total}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Delivery:</strong> {editingOrder.deliverymethod}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Status
                </label>
                <select
                  value={editingOrder.fulfillment}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, fulfillment: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  <option>Return</option>
                  <option>Pending</option>
                  <option>Delivered</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  value={editingOrder.payment}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, payment: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  <option>Unpaid</option>
                  <option>Paid</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdate(editingOrder)}
                  className="flex-1 bg-gray-600 text-white rounded-lg py-2 hover:bg-gray-700 transition"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditingOrder(null)}
                  className="flex-1 border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
