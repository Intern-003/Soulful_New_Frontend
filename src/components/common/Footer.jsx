import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const navigate = useNavigate();

  const socialLinks = [
    { icon: FaFacebookF, link: "https://www.facebook.com/profile.php?id=61578897611590", label: "Facebook" },
    { icon: FaInstagram, link: "https://www.instagram.com/soulful_shpyfly", label: "Instagram" },
    { icon: FaTwitter, link: "#", label: "Twitter" },
    { icon: FaYoutube, link: "#", label: "Youtube" },
  ];

  const shopLinks = [
    { label: "New Arrivals", path: "/fresharrivals" },
    { label: "Bestsellers", path: "/bestsellers" },
    { label: "Shop All", path: "/shop" },
    { label: "Essentials", path: "/category/essentials" },
  ];

  const supportLinks = [
    { label: "Help Center", path: "/support" },
    { label: "Shipping Info", path: "/shippinginfo" },
    { label: "Returns", path: "/returnsexchange" },
    { label: "Contact Us", path: "/contact" },
  ];

  return (
    <footer className="w-full bg-[#f7f3f5] border-t border-gray-200">
      {/* Main Footer - 2x2 Grid on ALL devices including mobile */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 md:py-8">
        {/* 2 columns on mobile & tablet, 4 columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
          
          {/* Part 1 - Brand & Social */}
          <div>
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-[#7a1c3d] mb-1.5 sm:mb-2">
              Soulful <span className="text-gray-800">Overseas</span>
            </h2>
            <p className="text-[10px] sm:text-xs text-gray-600 leading-tight mb-2 sm:mb-3">
              Multi-vendor platform connecting customers with trusted sellers.
            </p>
            <div className="flex gap-1.5 sm:gap-2">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center bg-white rounded-full hover:bg-[#7a1c3d] hover:text-white transition-all duration-300 shadow-sm"
                  aria-label={social.label}
                >
                  <social.icon size={11} className="sm:text-xs md:text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Part 2 - Shop Links */}
          <div>
            <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 mb-1.5 sm:mb-2">
              Shop
            </h3>
            <ul className="space-y-1 sm:space-y-1.5">
              {shopLinks.map((item) => (
                <li
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="text-[10px] sm:text-xs text-gray-600 hover:text-[#7a1c3d] cursor-pointer transition-all duration-200 hover:translate-x-0.5"
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Part 3 - Support Links */}
          <div>
            <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 mb-1.5 sm:mb-2">
              Support
            </h3>
            <ul className="space-y-1 sm:space-y-1.5">
              {supportLinks.map((item) => (
                <li
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="text-[10px] sm:text-xs text-gray-600 hover:text-[#7a1c3d] cursor-pointer transition-all duration-200 hover:translate-x-0.5"
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Part 4 - Contact (Quick Info Only) */}
          <div>
            <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 mb-1.5 sm:mb-2">
              Contact
            </h3>
            <ul className="space-y-1 sm:space-y-1.5">
              <li className="flex gap-1.5 text-[10px] sm:text-xs text-gray-600">
                <Phone size={11} className="text-[#7a1c3d] flex-shrink-0 mt-0.5" />
                <a href="tel:+919300098007" className="hover:text-[#7a1c3d]">+91 9300098007</a>
              </li>
              <li className="flex gap-1.5 text-[10px] sm:text-xs text-gray-600">
                <Mail size={11} className="text-[#7a1c3d] flex-shrink-0 mt-0.5" />
                <a href="mailto:soulfuloverseas.in@gmail.com" className="hover:text-[#7a1c3d] truncate">soulfuloverseas.in@gmail.com</a>
              </li>
              <li className="flex gap-1.5 text-[10px] sm:text-xs text-gray-600">
                <Clock size={11} className="text-[#7a1c3d] flex-shrink-0 mt-0.5" />
                <span>Mon-Sat: 9AM-6PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Minimal */}
      <div className="border-t border-gray-200 bg-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
          <p className="text-center text-[9px] sm:text-[10px] text-gray-500">
            © {new Date().getFullYear()} Soulful Overseas. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;