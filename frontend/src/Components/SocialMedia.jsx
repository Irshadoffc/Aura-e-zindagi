"use client";

import { useState, useEffect } from "react";
import {
  ChevronUp,
  MessageCircle,
  Instagram,
  Linkedin,
  Facebook,
} from "lucide-react";

const SocialMediaToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    if (!userInteracted) {
      const interval = setInterval(() => {
        setIsOpen((prev) => !prev);
      }, 3000); // Toggle every 3 seconds
      return () => clearInterval(interval);
    }
  }, [userInteracted]);

  const toggleSocials = () => {
    setUserInteracted(true);
    setIsOpen(!isOpen);
  };

  const socialLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: "https://api.whatsapp.com/send/?phone=923290303391&text&type=phone_number&app_absent=0",
      color:
        "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/devzone.official/",
      color:
        "bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 dark:from-purple-600 dark:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://www.linkedin.com/company/devzone-software/?viewAsMember=true",
      color:
        "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://web.facebook.com/profile.php?id=61579881629526",
      color:
        "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
    },
  ];

  return (
    <div className="relative">
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-center">
        {socialLinks.map((social, index) => {
          const IconComponent = social.icon;
          return (
            <div
              key={social.name}
              className={`mb-0.5 md:mb-1 transition-all duration-500 ease-out ${
                isOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto scale-100"
                  : "opacity-0 translate-y-8 pointer-events-none scale-0"
              }`}
              style={{
                transform: isOpen
                  ? `translateY(-${(socialLinks.length - index) * 35}px) scale(1)`
                  : "translateY(0px) scale(0)",
                transitionDelay: isOpen
                  ? `${index * 200}ms`
                  : `${(socialLinks.length - index - 1) * 200}ms`,
              }}
            >
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:-translate-y-1 ${social.color} backdrop-blur-sm border border-white/20 dark:border-white/30`}
                title={social.name}
              >
                <IconComponent
                  size={16}
                  className="md:w-5 md:h-5 drop-shadow-sm"
                />
              </a>
            </div>
          );
        })}

        {/* Toggle Button */}
        <button
          onClick={toggleSocials}
          className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl backdrop-blur-sm border-2 border-white/20 dark:border-white/30 ${
            isOpen
              ? "bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 dark:from-red-600 dark:to-red-800 dark:hover:from-red-700 dark:hover:to-red-900"
              : "bg-gradient-to-br from-black to-gray-800 hover:from-gray-900 hover:to-gray-700 dark:from-gray-800 dark:to-gray-900 dark:hover:from-gray-900 dark:hover:to-black"
          }`}
          aria-label={isOpen ? "Close social media menu" : "Open social media menu"}
        >
          <ChevronUp
            size={20}
            className={`md:w-6 md:h-6 text-white transition-all duration-500 ${
              isOpen ? "rotate-0" : "rotate-180"
            } drop-shadow-sm`}
          />
        </button>
      </div>
    </div>
  );
};

export default SocialMediaToggle;
