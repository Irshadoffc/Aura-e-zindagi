import React, { useState, useEffect } from 'react';
import api from '../api/Axios';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      {/* Top banner */}
      <div className="bg-yellow-50 text-sm text-center py-2 border-b">
        Order Now, Enjoy Free Shipping Nationwide! — "First Open, Then Pay!"
      </div>

      {/* Navbar */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/" className="text-2xl font-extrabold">Aura E Zindagi</a>
          <nav className="hidden md:flex gap-6 items-center text-sm">
            <a href="#" className="hover:underline">Home</a>
            <div className="group relative">
              <button className="hover:underline">Men</button>
              <div className="absolute left-0 top-full mt-2 w-40 bg-white shadow rounded hidden group-hover:block p-2 text-sm">
                <a href="#" className="block py-1">Perfumes</a>
              </div>
            </div>
            <div className="group relative">
              <button className="hover:underline">Women</button>
              <div className="absolute left-0 top-full mt-2 w-40 bg-white shadow rounded hidden group-hover:block p-2 text-sm">
                <a href="#" className="block py-1">Perfumes</a>
              </div>
            </div>
            <a href="#" className="hover:underline">Special Offer</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden md:inline-block px-3 py-1 border rounded">Log in</button>
          <button className="px-3 py-2 bg-black text-white rounded">Cart</button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">Breathe Style, Live Zindagi</h1>
            <p className="text-gray-600 mb-6">Where scent becomes signature — curated perfumes for every mood.</p>
            <div className="flex gap-4">
              <a href="#products" className="px-6 py-3 bg-black text-white rounded shadow">Shop Now</a>
              <a href="#explore" className="px-6 py-3 border rounded">Explore Now</a>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-md rounded-lg overflow-hidden shadow-lg">
              <img src="/images/hero-perfume.jpg" alt="hero" className="w-full object-cover h-80"/>
            </div>
          </div>
        </div>
      </section>

      {/* Category quick links */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="#men" className="p-6 border rounded text-center">Men Perfumes</a>
          <a href="#women" className="p-6 border rounded text-center">Women Perfumes</a>
          <a href="#special" className="p-6 border rounded text-center">Special Offer</a>
          <a href="#shop" className="p-6 border rounded text-center">Shop All</a>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Hot Selling</h2>
          <a href="#" className="text-sm underline">View all</a>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((p) => (
              <article key={p.id} className="border rounded-lg overflow-hidden group">
                <div className="relative">
                  <img 
                    src={p.image ? 
                      (p.image.startsWith('uploads/') ? `http://127.0.0.1:8000/${p.image}` : `/${p.image}`) 
                      : '/Images/Card-1.webp'
                    } 
                    alt={p.name} 
                    className="w-full h-56 object-cover" 
                  />
                  {p.discount_percentage > 0 && (
                    <span className="absolute left-3 top-3 bg-red-600 text-white px-2 py-1 text-xs rounded">
                      Save {p.discount_percentage}%
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sm mb-2">{p.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="text-lg font-semibold">PKR {parseFloat(p.price).toLocaleString()}</div>
                    {p.discount_percentage > 0 && (
                      <div className="text-sm text-gray-400 line-through">
                        PKR {parseFloat(p.original_price || p.price).toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 px-3 py-2 border rounded">View</button>
                    <button className="px-3 py-2 bg-black text-white rounded">Add</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* About / Best Performing */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-semibold">Our Best Performing</h3>
          <p className="max-w-2xl mx-auto mt-2 text-gray-600">Crafted for the Bold, Inspired by the Best of Us.</p>
          <div className="mt-6">
            <a href="#" className="px-6 py-3 bg-black text-white rounded">Shop Now</a>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <footer className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-bold">Aura E Zindagi</h4>
            <p className="text-gray-600 text-sm mt-2">Where scent becomes signature.</p>
          </div>
          <div className="md:col-span-2">
            <h5 className="font-semibold">Sign up and save</h5>
            <p className="text-gray-600 text-sm mt-2">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <form className="mt-4 flex max-w-md">
              <input type="email" placeholder="Enter your email" className="flex-1 border rounded-l px-4 py-2" />
              <button className="px-4 py-2 bg-black text-white rounded-r">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">© 2025 Aura E Zindagi</div>
      </footer>
    </div>
  );
}
