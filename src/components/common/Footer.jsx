import React from "react";
import { useNavigate } from "react-router-dom";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="w-full bg-[#f7f3f5] text-gray-700">
      {/* MAIN FOOTER */}
      <div className="w-full px-6 md:px-10 lg:px-16 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* LEFT */}
        <div>
          <h2 className="text-2xl font-semibold text-[#7a1c3d] mb-4">
            Soulful Overseas
          </h2>

          <p className="text-sm leading-6 text-gray-600 mb-4">
            Soulful Overseas is a multi-vendor eCommerce platform connecting
            customers with trusted sellers across categories. We aim to deliver
            quality products, seamless shopping experience .
          </p>

          <p className="font-medium mb-3">Connect With Us</p>

          <div className="flex gap-3">
            <a
              href="https://www.facebook.com/profile.php?id=61578897611590"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-md hover:bg-[#7a1c3d] hover:text-white transition-all duration-300"
            >
              <FaFacebookF size={14} />
            </a>

            <a
              href="https://www.instagram.com/soulful_shpyfly?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-md hover:bg-[#7a1c3d] hover:text-white transition-all duration-300"
            >
              <FaInstagram size={14} />
            </a>

            <div className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-md hover:bg-[#7a1c3d] hover:text-white transition-all duration-300 cursor-pointer">
              <FaTwitter size={14} />
            </div>

            <div className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-md hover:bg-[#7a1c3d] hover:text-white transition-all duration-300 cursor-pointer">
              <FaYoutube size={14} />
            </div>
          </div>
        </div>

        {/* SHOP */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Shop
            <span className="block w-10 h-[2px] bg-[#7a1c3d] mt-1"></span>
          </h3>

          <ul className="space-y-2 text-sm">
            {[
              { label: "New Arrivals", path: "/fresharrivals" },
              { label: "Bestsellers", path: "/bestsellers" },
              { label: "Shop all", path: "/shop" },
              { label: "Essentials", path: "/category/essentials" },
              { label: "Sale", path: "/soulful-special" },
            ].map((item, i) => (
              <li
                key={i}
                onClick={() => navigate(item.path)}
                className="hover:text-[#7a1c3d] cursor-pointer transition-all duration-300 hover:translate-x-1"
              >
                <span className="text-[#7a1c3d] mr-2">→</span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Support
            <span className="block w-10 h-[2px] bg-[#7a1c3d] mt-1"></span>
          </h3>

          <ul className="space-y-2 text-sm">
            {[
              { label: "Help Center", path: "/support" },
              { label: "Shipping Info", path: "/shippinginfo" },
              { label: "Returns & Exchanges", path: "/returnsexchange" },
              { label: "Terms & Privacy", path: "/termsprivacy" },
              { label: "Contact Us", path: "/contact" },
            ].map((item, i) => (
              <li
                key={i}
                onClick={() => navigate(item.path)}
                className="hover:text-[#7a1c3d] cursor-pointer transition-all duration-300 hover:translate-x-1"
              >
                <span className="text-[#7a1c3d] mr-2">→</span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Contact Information
            <span className="block w-10 h-[2px] bg-[#7a1c3d] mt-1"></span>
          </h3>

          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin size={16} className="text-[#7a1c3d]" />
              <span>G 27 Prestige Tower, Indore (M.P.) 452001</span>
            </li>

            <li className="flex gap-3">
              <Phone size={16} className="text-[#7a1c3d]" />
              <span>+91 9300098007</span>
            </li>

            <li className="flex gap-3">
              <Mail size={16} className="text-[#7a1c3d]" />
              <span>soulfuloverseas.in@gmail.com</span>
            </li>

            <li className="flex gap-3">
              <Clock size={16} className="text-[#7a1c3d]" />
              <div>
                <p>Mon-Fri: 9am-6pm</p>
                <p>Saturday: 10am-4pm</p>
                <p>Sunday: Closed</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t text-sm py-4 px-6 flex flex-col md:flex-row justify-between items-center text-gray-500">
        <p>
          © 2026 <span className="font-semibold">Soulful Overseas</span>. All
          Rights Reserved.
        </p>

        <div className="flex gap-6 mt-2 md:mt-0">
          <span className="hover:text-[#7a1c3d] cursor-pointer">Terms</span>
          <span className="hover:text-[#7a1c3d] cursor-pointer">Privacy</span>
          <span className="hover:text-[#7a1c3d] cursor-pointer">Cookies</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
