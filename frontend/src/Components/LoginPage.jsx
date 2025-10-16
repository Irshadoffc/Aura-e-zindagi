// src/Components/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";


const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.email || !formData.password) {
    toast.error("⚠ Please enter both email and password.", {
      position: "top-center",
      autoClose: 2500,
      theme: "dark",
    });
    return;
  }

  try {
    const res = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Invalid credentials");
    }

    toast.success(`✅ Logged in as: ${data.name}`, {
      position: "top-center",
      autoClose: 2000,
      theme: "dark",
    });

    localStorage.setItem("user", JSON.stringify(data));

    setTimeout(() => navigate("/Dashboard"), 200);
  } catch (err) {
    toast.error(`⚠ ${err.message}`, {
      position: "top-center",
      autoClose: 2500,
      theme: "dark",
    });
  }
};
const handleGoogleLoginSuccess = async (credentialResponse) => {
  try {
    if (!credentialResponse?.credential) {
      throw new Error("No credential received from Google");
    }

    // Decode JWT to get email and name
    const decoded = jwtDecode(credentialResponse.credential);
    const { email, name } = decoded;

    // Call backend API to store/check user
    const res = await fetch("http://localhost:8000/api/google-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    });

    // ✅ Check if response is JSON before parsing
    const contentType = res.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      throw new Error("Server returned non-JSON response:\n" + text);
    }

    if (!res.ok) {
      throw new Error(data.message || "Google login failed on server");
    }

    // Show toast and store user info from backend
    toast.success(`✅ Logged in as: ${data.name}`, {
      position: "top-center",
      autoClose: 2000,
      theme: "dark",
    });

    localStorage.setItem("user", JSON.stringify(data));

    // Redirect to Dashboard
    navigate("/Dashboard");
  } catch (err) {
    console.error("Google Login Error:", err);
    toast.error(`⚠ ${err.message}`, {
      position: "top-center",
      autoClose: 2500,
      theme: "dark",
    });
  }
};


return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "url('/Images/loginbg.webp')" }}
    >
      <ToastContainer />

      {/* 🔝 Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <img
            src="public/Images/weblogo3.png"
            alt="Logo"
            className="w-12 h-12 rounded-full shadow-[0_0_15px_rgba(255,215,0,0.4)]"
          />
          <h1 className="text-yellow-400 text-2xl font-bold tracking-wide">
            AURA E ZINDGI
          </h1>
        </div>
      </nav>

      {/* 🔐 Login Card */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-200 shadow-gray-300 p-8 text-gray-400 rounded-3xl relative">
          {/* 🖼 Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="/Images/loginlogo.webp"
              alt="Logo"
              className="w-20 h-20 object-contain rounded-full shadow-[0_0_15px_rgba(255,215,0,0.5)]"
            />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-wide text-yellow-400">
              Login to your account
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Enter your details to login.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2 bg-black/40 border border-yellow-500/30 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-black/40 border border-yellow-500/30 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-yellow-500 text-black font-semibold py-2.5 rounded-lg hover:bg-yellow-400 transition-colors shadow-[0_0_10px_rgba(255,215,0,0.4)]"
            >
              Login
            </button>
          </form>

          {/* 🟢 Google Sign-In */}
          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() =>
                toast.error("⚠ Google login failed.", {
                  position: "top-center",
                  autoClose: 2500,
                  theme: "dark",
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
