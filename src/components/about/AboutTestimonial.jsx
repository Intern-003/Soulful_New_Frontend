// const AboutTestimonial = () => {
//   return (
//     <section className="bg-white py-16 md:py-20">
//       <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">

//         <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          
//           {/* LEFT CONTENT */}
//           <div>
//             <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
//               Sed ut perspiciatis unde omnis iste natus
//             </h2>

//             <p className="text-gray-600 leading-7 mb-6">
//               Proin iaculis purus consequat sem cure digni ssim donec porttitora
//               entum suscipit rhoncus. Accusantium quam, ultricies eget id,
//               aliquam eget nibh et. Maecen aliquam, risus at semper.
//             </p>

//             {/* USER */}
//             <div className="flex items-center gap-4">
//               <img
//                 src="/images/testimonial-user.jpg"
//                 alt="user"
//                 className="w-12 h-12 rounded-full object-cover"
//               />

//               <div>
//                 <h4 className="font-semibold text-gray-800">
//                   Saul Goodman
//                 </h4>
//                 <p className="text-sm text-gray-500">Client</p>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT IMAGE */}
//           <div className="relative group">
//             <img
//               src="/images/testimonial.jpg"
//               alt="testimonial"
//               className="w-full rounded-2xl shadow-md transition duration-500 group-hover:scale-[1.02]"
//             />

//             {/* Optional overlay effect */}
//             <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-pink-200 transition"></div>
//           </div>

//         </div>

//       </div>
//     </section>
//   );
// };

// export default AboutTestimonial;

// components/about/AboutTestimonial.tsx
const AboutTestimonial = () => {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-amber-600 uppercase tracking-wide mb-3">
            Voices from our community
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            What Sellers & Buyers Say
          </h2>
          <div className="mt-4 h-1 w-20 bg-gradient-to-r from-amber-400 to-pink-500 rounded-full mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
          
          {/* LEFT CONTENT - Testimonial */}
          <div className="bg-gray-50 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              ))}
            </div>
            <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
              "SoulfulOverseas transformed my small jewelry business. The multi-vendor tools are intuitive, and I've reached customers I never thought possible. Truly a game-changer for artisans like me."
            </p>
            <div className="flex items-center gap-4">
              <img
                src="https://randomuser.me/api/portraits/women/68.jpg"
                alt="Anjali Sharma"
                className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-200"
              />
              <div>
                <h4 className="font-bold text-gray-800 text-lg">
                  Anjali Sharma
                </h4>
                <p className="text-sm text-gray-500">Jewelry Designer, Jaipur</p>
                <p className="text-xs text-amber-600 mt-1">Seller since 2023</p>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE / Second Testimonial */}
          <div className="bg-gradient-to-br from-amber-50 to-pink-50 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              ))}
            </div>
            <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
              "As a buyer, I love discovering unique products from different vendors all in one place. Shipping is reliable, and the quality exceeds expectations every time."
            </p>
            <div className="flex items-center gap-4">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Michael Chen"
                className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-200"
              />
              <div>
                <h4 className="font-bold text-gray-800 text-lg">
                  Michael Chen
                </h4>
                <p className="text-sm text-gray-500">Loyal Customer, Singapore</p>
                <p className="text-xs text-amber-600 mt-1">15+ orders placed</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutTestimonial;