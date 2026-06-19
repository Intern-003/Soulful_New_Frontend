// const AboutIntro = () => {
//   return (
//     <section className="bg-white py-16 md:py-20">
//       <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">

//         <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          
//           {/* LEFT SIDE */}
//           <div className="transition-all duration-500 hover:translate-x-1">
//             <p className="text-sm font-semibold text-pink-600 uppercase tracking-wide mb-3">
//               About Our Company
//             </p>

//             <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
//               Sed ut perspiciatis unde omnis iste natus error sit voluptatem.
//             </h2>
//           </div>

//           {/* RIGHT SIDE */}
//           <div className="relative group">
            
//             {/* Vertical Line */}
//             <div className="hidden md:block absolute left-0 top-0 h-full w-[2px] bg-pink-600 transition-all duration-500 group-hover:h-[110%]"></div>

//             <p className="text-gray-600 text-base leading-7 md:pl-6 transition-all duration-300">
//               Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
//               aut fugit, sed quia consequuntur magni dolores eos qui ratione
//               voluptatem sequi nesciunt.
//             </p>

//           </div>

//         </div>

//       </div>
//     </section>
//   );
// };

// export default AboutIntro;
// components/about/AboutIntro.jsx
const AboutIntro = () => {
  return (
    <section className="py-20 md:py-28 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* LEFT SIDE */}
          <div className="transition-all duration-500 hover:translate-x-1">
            <p className="text-sm font-semibold text-[#7a1c3d] uppercase tracking-wider mb-3">
              Our Mission
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2d0f1f] leading-tight">
              Empowering Artisans & Curators Worldwide
            </h2>
            <div className="mt-6 h-1 w-16 bg-gradient-to-r from-[#7a1c3d] to-[#a52355] rounded-full"></div>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative group">
            {/* Vertical Accent Line */}
            <div className="hidden md:block absolute -left-6 top-0 h-full w-[3px] bg-gradient-to-b from-[#7a1c3d] to-[#a52355] rounded-full transition-all duration-500 group-hover:h-[110%]"></div>

            <p className="text-gray-600 text-base leading-7 md:pl-6 transition-all duration-300">
              SoulfulOverseas is more than just a marketplace — it's a movement
              to celebrate soulful, sustainable, and ethically sourced products.
              We provide a trusted platform where independent sellers, small
              businesses, and artisans can showcase their unique creations to a
              global audience. From handwoven textiles to artisanal jewelry and
              home decor, every product tells a story of passion and
              craftsmanship.
            </p>
            <p className="text-gray-600 text-base leading-7 md:pl-6 mt-4 transition-all duration-300">
              As a{" "}
              <strong className="text-[#2d0f1f]">multi-vendor ecosystem</strong>
              , we prioritize transparency, quality, and community. Whether
              you're a buyer seeking something special or a seller looking to
              grow, SoulfulOverseas is your home for meaningful commerce.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutIntro;