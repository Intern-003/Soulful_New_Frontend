import { Link } from "react-router-dom";

const AboutHeader = () => {
  return (
    <section className="bg-[#f8f9fa] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-3">
          <Link
            to="/"
            className="hover:text-pink-600 transition duration-200"
          >
            Home
          </Link>

          <span className="mx-2 text-gray-400">/</span>

          <span className="text-gray-700 font-medium">
            About
          </span>
        </nav>

        {/* Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
            About
          </h1>

          {/* Optional Right Side (for future use like button/banner) */}
          <div className="hidden md:block">
            {/* You can add button or info here later */}
          </div>
        </div>

        {/* Bottom Accent Line (matches modern UI feel) */}
        <div className="mt-4 h-[2px] w-16 bg-pink-600 rounded-full"></div>

      </div>
    </section>
  );
};

export default AboutHeader;