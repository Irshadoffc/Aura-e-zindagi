import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import bannerVideo from "../assets/sliderVideo.mp4";
import thumbnail from "../assets/thumbnail.jpeg";
import thumbnailVideo from "../assets/thumbnailVideo.mp4";

import Footer from "./Footer";
import Navbar from "./Navbar";
import ProductList from "./Product_list";
import SocialMediaToggle from "./Socialmedia";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const slideDuration = 12000;
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const slides = [
    {
      type: "video",
      src: bannerVideo,
      heading: "Hello, Summer Saving",
      text: "Up to 25% off",
      button: null,
      productId: null,
      productData: null,
    },
    {
      type: "image",
      src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      heading: "Double This Summer",
      text: "Buy 1 Get One Free",
      button: "SHOP NOW",
      productId: "summer-perfume",
      productData: {
        id: "summer-perfume",
        name: "Summer Collection Perfume",
        price: "4500",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        images: [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        ],
        longDescription: "Experience the freshness of summer with our exclusive collection perfume. Perfect for warm days and cool evenings.",
      },
    },
    {
      type: "image",
      src: "/Images/Card-2.webp",
      heading: "Double This Summer",
      text: "Buy 1 Get 1",
      button: "SHOP NOW",
      productId: "beach-perfume",
      productData: {
        id: "beach-perfume",
        name: "Beach Breeze Perfume",
        price: "5500",
        rating: 4.9,
        image: "/Images/Card-2.webp",
        images: [
          "/Images/Card-2.webp",
          "/Images/Card-2.webp",
          "/Images/Card-2.webp",
          "/Images/Card-2.webp",
        ],
        longDescription: "Capture the essence of sandy beaches and ocean waves with this refreshing scent. A perfect companion for your summer adventures.",
      },
    },
  ];

  const boards = [
    {
      type: "image",
      title: "Ayura – This Is How I Express Myself",
      text: "For the woman who leads with confidence and leaves a lasting impression.",
      src: thumbnail,
      productId: "ayura-perfume",
      productData: {
        id: "ayura-perfume",
        name: "Ayura Premium Perfume",
        price: "5000",
        rating: 4.8,
        image: thumbnail,
        images: [thumbnail, thumbnail, thumbnail, thumbnail],
        longDescription: "Ayura is a captivating fragrance for the woman who leads with confidence and leaves a lasting impression. Crafted with premium ingredients for an unforgettable experience."
      },
      button: "BUY NOW",
    },
    {
      type: "video",
      title: "",
      text: "",
      src: thumbnailVideo,
      button: null,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, slideDuration);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
    setTimeout(() => {
      setAnimationKey((prev) => prev + 1);
    }, 50);
  }, [currentSlide]);

  const handleTouchStart = (e) => {
    touchStartX.current =
      e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    touchEndX.current = null;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (isDragging) {
      touchEndX.current =
        e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX.current && touchEndX.current) {
      const deltaX = touchEndX.current - touchStartX.current;
      if (deltaX > 50) {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      } else if (deltaX < -50) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
    setIsDragging(false);
  };

  return (
    <>
      {/* Navbar + Hero Slider */}
      <section>
        <Navbar />
        <SocialMediaToggle/>
        <div
          className={`relative w-full h-[50vh] sm:h-[60vh] md:h-[75vh] lg:h-[85vh] 
          overflow-hidden ${isDragging ? "cursor-grabbing" : "cursor-grab"} mt-25`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 z-0 ${
                index === currentSlide
                  ? "opacity-100 translate-x-0"
                  : index < currentSlide
                  ? "opacity-0 -translate-x-full"
                  : "opacity-0 translate-x-full"
              }`}
            >
              {slide.type === "video" ? (
                <video
                  className="w-full h-full object-cover"
                  src={slide.src}
                  autoPlay
                  loop
                  muted
                />
              ) : (
                <img
                  className="w-full h-full object-cover"
                  src={slide.src}
                  alt={`Slide ${index + 1}`}
                />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20">
                <h1
                  key={`heading-${index}-${animationKey}`}
                  className={`text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 text-yellow-500 ${
                    index === currentSlide ? "animate-slide-up" : ""
                  }`}
                >
                  {slide.heading}
                </h1>
                <p
                  key={`text-${index}-${animationKey}`}
                  className={`text-base sm:text-lg md:text-xl lg:text-2xl mb-8 ${
                    index === currentSlide ? "animate-slide-up" : ""
                  }`}
                >
                  {slide.text}
                </p>
                {slide.button && slide.productId && (
                  <Link
                    key={`button-${index}-${animationKey}`}
                    to={`/product/${slide.productId}`}
                    state={{ product: slide.productData }}
                    className={`px-6 py-2 bg-yellow-500 text-black font-semibold rounded-2xl hover:bg-yellow-600 hover:text-white transition-all ${
                      index === currentSlide ? "animate-slide-up-slow" : ""
                    }`}
                  >
                    {slide.button}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <motion.section className="px-4 sm:px-2 py-16">
        <h2 className="text-3xl sm:text-4xl text-center my-12 text-gray-900">
          Explore Now
          <span className="block w-24 h-0.5 bg-gray-900 mx-auto mt-2"></span>
        </h2>

        <div className="flex gap-3">
          {/* MAN'S PERFUME */}
          <motion.div className="rounded-2xl overflow-hidden relative">
            <Link
              to="/man"
              className="block object-cover object-center bg-center bg-cover"
            >
              <img
                src="/Images/manpic.webp"
                alt="MAN'S PERFUME"
                className="w-150 h-100 object-cover object-center bg-center bg-cover"
              />
              <div className="absolute inset-y-0 left-6 bottom-40 flex flex-col justify-center items-center whitespace-nowrap text-white font-bold text-2xl">
                <span className="transform rotate-90 origin-left">
                  MAN,S PERFUME
                </span>
              </div>
            </Link>
          </motion.div>

          {/* WOMAN'S PERFUME */}
          <motion.div className="rounded-2xl overflow-hidden shadow-lg relative h-100 w-100">
            <Link
              to="/women"
              className="block object-cover object-center bg-center bg-cover"
            >
              <img
                src="/Images/womanpic.jpeg"
                alt="WOMAN'S PERFUME"
                className="w-full h-full object-cover object-center bg-center bg-cover"
              />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 whitespace-nowrap text-white font-bold text-2xl p-2">
                WOMAN'S PERFUME
              </div>
            </Link>
          </motion.div>

          {/* UNISEX PERFUME */}
          <motion.div className="rounded-2xl overflow-hidden shadow-lg relative h-100 w-100">
            <Link
              to="/unisex"
              className="block w-full h-full object-cover object-center bg-center bg-cover"
            >
              <img
                src="/Images/couplepic.webp"
                alt="UNISEX PERFUME"
                className="w-full h-full object-cover object-center bg-center bg-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">
                UNISEX PERFUME
              </div>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Boards Section */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen items-center">
          {boards.map((card, index) => (
            <div
              key={index}
              className={`relative flex flex-col justify-end w-full h-full overflow-hidden ${
                card.type === "video" ? "hidden md:block" : ""
              }`}
            >
              {card.type === "video" ? (
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  src={card.src}
                  autoPlay
                  loop
                  muted
                />
              ) : (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${card.src})` }}
                ></div>
              )}
              <div className="relative z-10 p-6 sm:p-10 bg-black/40">
                {card.title && (
                  <h2 className="text-4xl font-bold text-yellow-500 mb-4">
                    {card.title}
                  </h2>
                )}
                {card.text && <p className="text-lg text-white mb-4">{card.text}</p>}
                {card.button && (
                  <Link 
                    to={`/product/${card.productId}`}
                    state={{ product: card.productData }}
                    className="inline-block px-6 py-3 bg-white text-black rounded-lg hover:bg-yellow-500 transition"
                  >
                    {card.button}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product List */}
      <section className="">
        <ProductList />
      </section>

      {/* Banner + Footer */}
      <div>
        <div className="w-full mx-auto rounded-lg shadow-lg overflow-hidden">
          <img
            src="/Images/banner.webp"
            alt="Banner"
            className="w-full max-h-[350px] object-contain md:object-cover"
          />
        </div>

        <Footer />
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes slideUpSlow {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .animate-slide-up {
            animation: slideUp 0.5s ease-out forwards;
          }
          .animate-slide-up-slow {
            animation: slideUpSlow 0.8s ease-out forwards;
          }
        `}
      </style>
    </>
  );
};

export default HeroSection;