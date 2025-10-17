// src/Components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUser, FaShoppingBag } from "react-icons/fa";
import { FiMenu, FiX, FiChevronRight, FiLogOut } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import MiniNavbar from "./Mobilescreen/MiniNavbar";
import CartDrawer from "./pages/NewCart";
import api from "../api/Axios";

const Navbar = () => {
  const [isTop, setIsTop] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showCart, setShowCart] = useState(false); // ✅ control CartDrawer visibility
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY === 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update cart count from backend API
  useEffect(() => {
    const updateCartCount = async () => {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const response = await api.get('/cart');
          const totalQty = response.data.cart_items.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(totalQty);
        } catch (error) {
          console.error('Error fetching cart count:', error);
          setCartCount(0);
        }
      } else {
        // Fallback to localStorage for non-authenticated users
        const saved = localStorage.getItem("cartItems");
        if (saved) {
          const items = JSON.parse(saved);
          const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(totalQty);
        } else {
          setCartCount(0);
        }
      }
    };
    
    updateCartCount();
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      updateCartCount();
    };
    
    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("storage", updateCartCount);
    
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("storage", updateCartCount);
    };
  }, [isLoggedIn]);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      if (token && userData) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const navLinks = [
    { name: "WOMAN", path: "/women" },
    { name: "MAN", path: "/man" },
    { name: "UNISEX", path: "/unisex" },
    { name: "SPECIAL OFFERS", path: "/offers" },
  ];

  const mobileMenuVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { when: "beforeChildren", staggerChildren: 0.06, delayChildren: 0.04 },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  };

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-500 ${
        isTop ? "bg-black" : "bg-black shadow-md"
      }`}
    >
      {/* 🔹 Top Row */}
      <div className="flex items-center justify-between p-3 lg:px-8 text-white relative">
        {/* Left area */}
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-md"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen((s) => !s)}
          >
            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

          {/* Desktop Search */}
          <div className="hidden lg:flex items-center">
            <div className="w-[20vw] max-w-[520px] min-w-[280px] relative">
              <div className="absolute inset-y-0 left-0 bg-yellow-400/95 hover:bg-yellow-400 px-4 flex items-center rounded-full">
                <FaSearch className="text-black" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent border border-gray-700 text-white rounded-full pl-14 pr-14 py-2 text-sm outline-none placeholder-gray-300 focus:placeholder-transparent"
                aria-label="Search"
              />
            </div>
          </div>
        </div>

        {/* Center logo (desktop) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 lg:flex hidden">
          <Link to="/" aria-label="Home">
            <img src="/Images/weblogo3.png" alt="Logo" className="h-10 w-auto object-contain" />
          </Link>
        </div>

        {/* Mobile logo */}
        <div className="lg:hidden">
          <Link to="/" aria-label="Home">
            <img src="/Images/weblogo3.png" alt="Logo" className="h-10 w-auto object-contain" />
          </Link>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-3">
          {/* Mobile search button */}
          <button
            className="lg:hidden p-2 rounded-full bg-yellow-400/95 hover:bg-yellow-400 flex items-center justify-center"
            aria-label="Open search"
            onClick={() => setShowSearch((s) => !s)}
          >
            {showSearch ? <FiX className="text-black" /> : <FaSearch className="text-black" />}
          </button>

          {/* Profile / Logout */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="inline-flex p-2 rounded-md hover:bg-red-600 transition-colors cursor-pointer"
              aria-label="Logout"
              title={`Logout (${user?.name})`}
            >
              <FiLogOut />
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="inline-flex p-2 rounded-md cursor-pointer"
              aria-label="Profile"
            >
              <FaUser />
            </button>
          )}

          {/* ✅ Cart Drawer Trigger */}
        <button
  onClick={() => setShowCart(true)}  // Ye already hai
  className="relative p-2 rounded-md"
  aria-label="Cart"
>
  <FaShoppingBag />
  <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full w-4 h-4 flex items-center justify-center">
    {cartCount}
  </span>
</button>

        </div>
      </div>

      {/* 🔹 Desktop Nav Links */}
      <nav className="hidden lg:flex justify-center bg-black text-white border-t border-white/20">
        <ul className="flex gap-8 py-3">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`text-sm tracking-wide hover:text-yellow-400 transition ${
                  link.name === "SPECIAL OFFERS"
                    ? "text-red-400 font-semibold"
                    : "text-white"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* 🔹 Mobile search expansion */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="lg:hidden px-4 pb-3 bg-black"
          >
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 bg-yellow-400/95 px-3 flex items-center rounded-full">
                <FaSearch className="text-black" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                autoFocus
                className="w-full bg-transparent border border-gray-700 text-white rounded-full pl-12 pr-12 py-2 text-sm outline-none placeholder-gray-300 focus:placeholder-transparent"
                aria-label="Mobile search input"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 Mobile menu (LEFT SLIDE) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.nav
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mobileMenuVariants}
              className="lg:hidden fixed top-0 left-0 h-full w-[75%] max-w-xs bg-black text-white flex flex-col px-4 py-6 z-50 shadow-lg"
              aria-label="Mobile menu"
            >
              <button
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <FiX size={22} />
              </button>

              <motion.ul className="w-full mt-14">
                {navLinks.map((link) => (
                  <motion.li
                    key={link.name}
                    variants={menuItemVariants}
                    className="border-b border-white/20 flex items-center justify-between"
                  >
                    <Link
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block py-3 px-2 text-base ${
                        link.name === "SPECIAL OFFERS"
                          ? "text-red-400 font-semibold"
                          : "text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                    <FiChevronRight className="text-gray-400" />
                  </motion.li>
                ))}
              </motion.ul>
              <div className="h-px bg-white/30 mt-3" />
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* ✅ Cart Drawer Component */}
      <AnimatePresence>
        {showCart && (
          <CartDrawer onClose={() => setShowCart(false)} />
        )}
      </AnimatePresence>

      {/* 🔹 Mobile Mini Navbar */}
      <div className="lg:hidden">
        <MiniNavbar />
      </div>
    </header>
  );
};

export default Navbar;
