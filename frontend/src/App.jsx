import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 🏠 Main Site Pages
import Combine from './Components/Combine';
import Womens from './Components/Women';
import Mens from './Components/Men';
import ProductDetail from './Components/ProductDetail';
import CheckoutPage from './Components/CheckoutPage';
import Unisex from './Components/Unisex';
import SpecialOffers from './Components/SpecialOffer';
import LoginPage from './Components/LoginPage';
import CartDrawer from './Components/pages/NewCart';

// 🧩 Admin Dashboard Layout + Pages
import Layout from './Components/pages/Layoutsidebar';
import Dashboard from './Components/pages/Dashboard';
import Collections from './Components/pages/Products/Collections';
import Inventory from './Components/pages/Products/Inventory';
import Received from './Components/pages/Orders/Received';
import Pending from './Components/pages/Orders/Pending';
import CustomersDesktop from './Components/desktop/customer/CustomersDesktop';
import DeskHomePage from './Components/desktop/home/DeskHomePage';

// ✅ Add Product Page (Without Sidebar)
import AddProduct from './Components/pages/products/AddProduct';
import SocialMediaToggle from './Components/Socialmedia';
import Orders from './Components/pages/Orders/Orders';
import Products from './Components/pages/Products/Products';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🏠 Public Pages */}
        <Route path="/" element={<Combine />} />
        <Route path="/women" element={<Womens />} />
        <Route path="/man" element={<Mens />} />
        <Route path="/unisex" element={<Unisex />} />
        <Route path="/offers" element={<SpecialOffers />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CartDrawer />} />

        {/* 🧭 Admin Dashboard Pages */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders/>} />
          <Route path="/orders/received" element={<Received />} />
          <Route path="/orders/pending" element={<Pending />} />
          <Route path="/products" element={<Products/>} />
          <Route path="/products/collections" element={<Collections />} />
          <Route path="/products/inventory" element={<Inventory />} />
          <Route path="/customers" element={<CustomersDesktop />} />
          <Route path="/home-desktop" element={<DeskHomePage />} />
          <Route path="/" element={<SocialMediaToggle/>} />
        </Route>

        {/* 🆕 Add Product Page (Standalone without Sidebar) */}
        <Route path="/add-product" element={<AddProduct />} />
      </Routes>
      
    </BrowserRouter>
  );
};

export default App;
