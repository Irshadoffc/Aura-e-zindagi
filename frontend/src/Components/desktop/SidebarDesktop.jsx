import React, { useState, useEffect } from "react";
import {
  BarChart2,
  Home,
  Users2,
  DollarSign,
  MessageSquare,
  History,
  LogOut,
  X,
  PanelLeftOpen,
  PanelLeftClose,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  ListOrdered,
  ShoppingBasket,
  UserRound,
} from "lucide-react";
import DeskHomePage from "./home/DeskHomePage";
import Orders from "../pages/Orders/Orders";
import Products from "../pages/Products/Products";
import Collections from "../pages/Products/Collections";
import CustomersDesktop from "./customer/CustomersDesktop";

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // ----------- Page Rendering -----------
  const renderContent = () => {
    switch (activeItem) {
      case "overview":
        return <DeskHomePage />;
      case "orders":
        return (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Orders</h2>
            <Orders />
          </div>
        );

        return (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Orders Pending</h2>
            <Orders status="pending" />
          </div>
        );
      case "products":
        return (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Products</h2>
            <Products />
          </div>
        );

      case "collections":
        return <Collections />;
      case "messages":
        return <CustomersDesktop />;

      default:
        return <div>Select a page from the sidebar.</div>;
    }
  };

  const getPageTitle = () => {
    switch (activeItem) {
      case "overview":
        return "Dashboard Overview";
      case "orders":
        return "All Orders";
      case "products":
        return "All Products";
      case "collections":
        return "Collections";
      case "messages":
        return "Customers";
      case "history":
        return "Account History";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="flex h-screen relative overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full bg-gray-50 border-r border-gray-200 z-50 transition-all duration-500 ${sidebarOpen
          ? "translate-x-0 opacity-100"
          : "-translate-x-full opacity-0 md:translate-x-0 md:opacity-100"
          }`}
      >
        {/* Overlay on Mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar Panel */}
        <aside className="relative w-64 h-full bg-gray-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 px-4 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <BarChart2 className="size-6" />
              <span className="font-semibold">Admin Dashboard</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 rounded hover:bg-gray-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-4 px-3 flex-1">
            <ul className="flex flex-col gap-1">
              {/* Overview */}
              <li>
                <button
                  onClick={() => setActiveItem("overview")}
                  className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm ${activeItem === "overview"
                    ? "bg-gray-100 text-gray-600 font-medium"
                    : "hover:bg-gray-100"
                    }`}
                >
                  <LayoutDashboard className="size-4 text-gray-900" />
                  <span>Dashboard Overview</span>
                </button>
              </li>

              {/* Orders */}
              <li>
                <button
                  onClick={() => {
                    setOrdersOpen(!ordersOpen); // ✅ Toggle open/close
                    setActiveItem("orders");
                  }}
                  className="w-full flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <ListOrdered className="size-4 text-gray-900" />
                    <span>Orders</span>
                  </div>
                 
                </button>

              </li>

              {/* Products */}
              <li>
                <button
                  onClick={() => {
                    setProductsOpen(!productsOpen); // ✅ Toggle open/close
                    setActiveItem("products");
                  }}
                  className="w-full flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBasket className="size-4 text-gray-900" />
                    <span>Products</span>
                  </div>
                  {productsOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {/* Submenu */}
                {productsOpen && (
                  <ul className="ml-8 mt-1 flex flex-col gap-1 transition-all duration-300">
                    <li>

                    </li>
                    <li>
                      <button
                        onClick={() => setActiveItem("collections")}
                        className={`w-full text-left rounded-md px-3 py-2 text-sm ${activeItem === "collections"
                          ? "bg-gray-100 text-gray-600 font-medium"
                          : "hover:bg-gray-100"
                          }`}
                      >
                        Collections
                      </button>
                    </li>
                  </ul>
                )}
              </li>

              {/* Messages */}
              <li>
                <button
                  onClick={() => setActiveItem("messages")}
                  className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm ${activeItem === "messages"
                    ? "bg-gray-100 text-gray-600 font-medium"
                    : "hover:bg-gray-100"
                    }`}
                >
                  <UserRound className="size-4 text-gray-900" />
                  <span>Customers</span>
                </button>
              </li>

            </ul>
          </nav>

          {/* Logout */}
          <div className="mt-auto p-3 border-t border-gray-200">
            <button
              type="button"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="size-4 shrink-0" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3 bg-white shadow-sm">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded hover:bg-gray-100 transition active:scale-95"
          >
            {sidebarOpen ? (
              <PanelLeftClose className="w-5 h-5 text-gray-700" />
            ) : (
              <PanelLeftOpen className="w-5 h-5 text-gray-700" />
            )}
          </button>
          <span className="font-medium text-gray-800">{getPageTitle()}</span>
        </div>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;