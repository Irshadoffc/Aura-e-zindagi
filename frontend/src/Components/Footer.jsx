import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  const [isQuickLinksOpen, setQuickLinksOpen] = useState(false);
  const [isAboutOpen, setAboutOpen] = useState(false);
  const [isServicesOpen, setServicesOpen] = useState(false);

  const toggleQuickLinks = () => setQuickLinksOpen(!isQuickLinksOpen);
  const toggleAbout = () => setAboutOpen(!isAboutOpen);
  const toggleServices = () => setServicesOpen(!isServicesOpen);

  return (
    <footer className="w-full bg-black text-white px-6 py-10 font-serif">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
        
        {/* Logo & Social */}
        <div className="flex flex-col items-center md:items-start">
          <img
            src="/Images/weblogo3.png"
            alt="Logo"
            className="h-20 md:h-24 rounded-2xl mb-6"
          />
          <div className="flex space-x-4">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF className="text-[#0866FF] hover:text-[#FFC80E] transition text-lg" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter className="text-[#1C96E8] hover:text-[#FFC80E] transition text-lg" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram className="text-[#F7322F] hover:text-[#FFC80E] transition text-lg" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn className="text-[#0077B5] hover:text-[#FFC80E] transition text-lg" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-sm">
          <h2
            onClick={toggleQuickLinks}
            className="font-semibold text-[#FFC80E] mb-2 md:mb-4 cursor-pointer md:cursor-default flex justify-between items-center"
          >
            Quick Links
            <span className="ml-2 md:hidden">{isQuickLinksOpen ? "▲" : "▼"}</span>
          </h2>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isQuickLinksOpen ? "max-h-40" : "max-h-0 md:max-h-full"
            } md:block`}
          >
            <ul className="space-y-2 text-white">
              <li>
                <Link 
                  to="/man" 
                  className="hover:text-[#FFC80E] transition block"
                >
                  Men
                </Link>
              </li>
              <li>
                <Link 
                  to="/women" 
                  className="hover:text-[#FFC80E] transition block"
                >
                  Women
                </Link>
              </li>
              <li>
                <Link 
                  to="/unisex" 
                  className="hover:text-[#FFC80E] transition block"
                >
                  Unisex
                </Link>
              </li>
              <li>
                <Link 
                  to="/offers" 
                  className="hover:text-[#FFC80E] transition block"
                >
                  Special Offer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* About Us */}
        <div className="text-sm">
          <h2
            onClick={toggleAbout}
            className="font-semibold text-[#FFC80E] mb-2 md:mb-4 cursor-pointer md:cursor-default flex justify-between items-center"
          >
            About Us
            <span className="ml-2 md:hidden">{isAboutOpen ? "▲" : "▼"}</span>
          </h2>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isAboutOpen ? "max-h-40" : "max-h-0 md:max-h-full"
            } md:block`}
          >
            <ul className="space-y-2 text-white">
              <li>
                <a 
                  href="mailto:info@example.com" 
                  className="hover:text-[#FFC80E] transition"
                >
                  Email: info@example.com
                </a>
              </li>
              <li>Location: 123 Main St, City</li>
              <li>
                <a 
                  href="tel:+1234567890" 
                  className="hover:text-[#FFC80E] transition"
                >
                  Phone: +123 456 7890
                </a>
              </li>
              <li>Working Hours: Mon - Fri, 9am - 6pm</li>
            </ul>
          </div>
        </div>

        {/* Submissions */}
        <div className="text-sm">
          <h2
            onClick={toggleServices}
            className="font-semibold text-[#FFC80E] mb-2 md:mb-4 cursor-pointer md:cursor-default flex justify-between items-center"
          >
            Social Media
            <span className="ml-2 md:hidden">{isServicesOpen ? "▲" : "▼"}</span>
          </h2>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isServicesOpen ? "max-h-40" : "max-h-0 md:max-h-full"
            } md:block`}
          >
            <ul className="space-y-2 text-white">
              <li>
                <Link 
                  to="/sub" 
                  className="hover:text-[#FFC80E] transition block"
                >
                  Face Book
                </Link>
              </li>
              <li>
                <Link 
                  to="/letters" 
                  className="hover:text-[#FFC80E] transition block"
                >
                  Instagram
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="text-center md:text-left text-sm text-[#FFC80E] mt-8 border-t border-[#FFC80E]/30 pt-4 max-w-7xl mx-auto">
        &copy; {new Date().getFullYear()} All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;