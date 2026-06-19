// import { Link } from "react-router-dom";

// const AboutHeader = () => {
//   return (
//     <section className="bg-[#f8f9fa] border-b border-gray-200">
//       <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">

//         {/* Breadcrumb */}
//         <nav className="flex items-center text-sm text-gray-500 mb-3">
//           <Link
//             to="/"
//             className="hover:text-pink-600 transition duration-200"
//           >
//             Home
//           </Link>

//           <span className="mx-2 text-gray-400">/</span>

//           <span className="text-gray-700 font-medium">
//             About
//           </span>
//         </nav>

//         {/* Title */}
//         <div className="flex items-center justify-between">
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
//             About
//           </h1>

//           {/* Optional Right Side (for future use like button/banner) */}
//           <div className="hidden md:block">
//             {/* You can add button or info here later */}
//           </div>
//         </div>

//         {/* Bottom Accent Line (matches modern UI feel) */}
//         <div className="mt-4 h-[2px] w-16 bg-pink-600 rounded-full"></div>

//       </div>
//     </section>
//   );
// };

// export default AboutHeader;

// components/about/AboutHeader.jsx
import { Link } from "react-router-dom";

const AboutHeader = () => {
  return (
    <section className="bg-gradient-to-r from-[#fdf7f9] to-[#f6f1f3] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 lg:py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-[#7a1c3d] transition duration-200">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-[#2d0f1f] font-medium">About Us</span>
        </nav>

        {/* Title & Subtitle */}
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2d0f1f] tracking-tight mb-4">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-[#7a1c3d] to-[#a52355] bg-clip-text text-transparent">
              SoulfulOverseas
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            India's fastest-growing multi-vendor marketplace connecting you with
            authentic, handcrafted treasures from across the globe.
          </p>
        </div>

        {/* Decorative Accent Line */}
        <div className="mt-6 h-1 w-24 bg-gradient-to-r from-[#7a1c3d] to-[#a52355] rounded-full"></div>
      </div>
    </section>
  );
};

export default AboutHeader;