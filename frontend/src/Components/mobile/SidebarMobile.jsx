import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiShoppingBag,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { VscIndent } from "react-icons/vsc";
import { MdHomeFilled } from "react-icons/md";
import { IoMdPricetag } from "react-icons/io";
import { TbDiscountFilled } from "react-icons/tb";

// ...rest of your imports

const SidebarMobile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => (prev[menu] ? {} : { [menu]: true }));
  };

  const menuItems = [
    { id: "home", title: "Home", icon: <MdHomeFilled />, path: "/" },
    {
      id: "orders",
      title: "Orders",
      icon: <FiShoppingBag />,
      path: "/orders",
      children: [
        { title: "Order Received", path: "/orders/received" },
        { title: "Order Pending", path: "/orders/pending" },
      ],
    },
    {
      id: "products",
      title: "Products",
      icon: <IoMdPricetag />,
      path: "/products",
      children: [
        { title: "Collections", path: "/products/collections" },
        { title: "Inventory", path: "/products/inventory" },
      ],
    },
    { id: "customers", title: "Customers", icon: <FaUser />, path: "/customers" },
    { id: "discounts", title: "Discounts", icon: <TbDiscountFilled />, path: "/discounts" },
  ];

  const isParentActive = (item) => location.pathname === item.path;
  const isChildActive = (child) => location.pathname === child.path;

  return (
    <>
      {/* Top Navbar with Hamburger */}
      <div className="flex items-center justify-between bg-gray-100 border-b border-gray-200 p-3 lg:hidden fixed top-0 left-0 right-0 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="text-gray-700 hover:text-gray-900 cursor-pointer"
        >
          <FiMenu className="text-2xl" />
        </button>
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>

      {/* Transparent Overlay */}
      {isOpen && <div className="fixed inset-0 bg-transparent z-40"></div>}

      {/* Sidebar Drawer */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-gray-100 border-r border-gray-200 shadow-md z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="cursor-pointer"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Scrollable Menu */}
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
          {menuItems.map((item) => (
            <div key={item.id} className="mb-1">
              <button
                onClick={() => {
                  if (item.children) toggleMenu(item.id);
                  else setOpenMenus({});
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg 
                  text-sm font-medium transition-all duration-200 cursor-pointer
                  ${
                    isParentActive(item)
                      ? "bg-white shadow text-gray-900"
                      : "hover:bg-gray-200 text-gray-700"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-[14px] font-semibold">{item.title}</span>
                </div>
              </button>

              {/* Submenu */}
              {item.children && openMenus[item.id] && (
                <div className="mt-1 flex flex-col border-l border-gray-300 ml-4 pl-4">
                  {item.children.map((child) => (
                    <button
                      key={child.path}
                      onClick={() => {
                        navigate(child.path);
                        setIsOpen(false);
                      }}
                      className={`flex items-center gap-2 py-1 rounded-md w-full relative group cursor-pointer
                        ${
                          isChildActive(child)
                            ? "bg-gray-200 text-gray-900 font-semibold"
                            : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                        } transition-all duration-150
                      `}
                    >
                      <VscIndent className="text-[16px] opacity-0 group-hover:opacity-40 transition" />
                      <span className="text-[14px]">{child.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Logout */}
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200 text-red-600 text-sm transition cursor-pointer"
          >
            <FiLogOut className="text-[16px]" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SidebarMobile;