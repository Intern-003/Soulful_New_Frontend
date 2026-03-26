import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">

        <div>
          <h2 className="text-lg font-semibold mb-3">FashionStore</h2>
          <p className="text-sm text-gray-400">
            Your one-stop shop for fashion. Quality products at the best prices.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Home</li>
            <li>Shop</li>
            <li>Cart</li>
            <li>Wishlist</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Contact</h3>
          <p className="text-sm text-gray-400">
            Email: support@example.com
          </p>
          <p className="text-sm text-gray-400">
            Phone: +1 (234) 567-890
          </p>
        </div>

      </div>

      <div className="text-center text-sm text-gray-500 border-t border-gray-700 py-3">
        © 2026 FashionStore. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;