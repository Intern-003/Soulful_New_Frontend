import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#f7f3f5] text-gray-700 mt-10">

      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* LEFT SECTION */}
        <div>
          <h2 className="text-2xl font-semibold text-[#7a1c3d] mb-4">
            FashionStore
          </h2>

          <p className="text-sm leading-6 text-gray-600 mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Nullam in nibh vehicula, facilisis magna ut, consectetur lorem.
            Proin eget tortor risus.
          </p>

          <p className="font-medium mb-3">Connect With Us</p>

          <div className="flex gap-3">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <div
                key={i}
                className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-md hover:bg-[#7a1c3d] hover:text-white transition cursor-pointer"
              >
                <Icon size={16} />
              </div>
            ))}
          </div>
        </div>

        {/* SHOP */}
        <div>
          <h3 className="text-lg font-semibold mb-4 relative">
            Shop
            <span className="block w-10 h-[2px] bg-[#7a1c3d] mt-1"></span>
          </h3>

          <ul className="space-y-2 text-sm">
            {[
              "New Arrivals",
              "Bestsellers",
              "Women's Clothing",
              "Men's Clothing",
              "Accessories",
              "Sale",
            ].map((item, i) => (
              <li
                key={i}
                className="hover:text-[#7a1c3d] cursor-pointer transition"
              >
                → {item}
              </li>
            ))}
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-lg font-semibold mb-4 relative">
            Support
            <span className="block w-10 h-[2px] bg-[#7a1c3d] mt-1"></span>
          </h3>

          <ul className="space-y-2 text-sm">
            {[
              "Help Center",
              "Order Status",
              "Shipping Info",
              "Returns & Exchanges",
              "Size Guide",
              "Contact Us",
            ].map((item, i) => (
              <li
                key={i}
                className="hover:text-[#7a1c3d] cursor-pointer transition"
              >
                → {item}
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-semibold mb-4 relative">
            Contact Information
            <span className="block w-10 h-[2px] bg-[#7a1c3d] mt-1"></span>
          </h3>

          <ul className="space-y-3 text-sm">

            <li className="flex gap-3">
              <MapPin size={16} className="text-[#7a1c3d]" />
              <span>123 Fashion Street, New York, NY 10001</span>
            </li>

            <li className="flex gap-3">
              <Phone size={16} className="text-[#7a1c3d]" />
              <span>+1 (555) 123-4567</span>
            </li>

            <li className="flex gap-3">
              <Mail size={16} className="text-[#7a1c3d]" />
              <span>hello@example.com</span>
            </li>

            <li className="flex gap-3">
              <Clock size={16} className="text-[#7a1c3d]" />
              <div>
                <p>Monday-Friday: 9am-6pm</p>
                <p>Saturday: 10am-4pm</p>
                <p>Sunday: Closed</p>
              </div>
            </li>

          </ul>

          {/* APP BUTTONS */}
          <div className="flex gap-3 mt-5">
            <button className="bg-gray-200 px-4 py-2 rounded-md text-sm">
               App Store
            </button>
            <button className="bg-gray-200 px-4 py-2 rounded-md text-sm">
              ▶ Google Play
            </button>
          </div>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t text-sm py-4 px-6 flex flex-col md:flex-row justify-between items-center text-gray-500">

        <p>
          © Copyright <span className="font-semibold">MyWebsite</span>. All Rights Reserved.
        </p>

        <div className="flex gap-6 mt-2 md:mt-0">
          <span className="cursor-pointer hover:text-[#7a1c3d]">Terms</span>
          <span className="cursor-pointer hover:text-[#7a1c3d]">Privacy</span>
          <span className="cursor-pointer hover:text-[#7a1c3d]">Cookies</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;