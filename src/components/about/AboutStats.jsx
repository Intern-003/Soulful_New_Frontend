// const stats = [
//   { number: "232", label: "Happy Clients" },
//   { number: "521", label: "Projects" },
//   { number: "1453", label: "Hours Of Support" },
//   { number: "32", label: "Hard Workers" },
// ];

// const AboutStats = () => {
//   return (
//     <section className="bg-gray-50 py-16 md:py-20">
//       <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

//           {stats.map((item, index) => (
//             <div
//               key={index}
//               className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
//             >
              
//               {/* Number */}
//               <h3 className="text-3xl md:text-4xl font-bold text-pink-600 mb-2 transition group-hover:scale-110">
//                 {item.number}
//               </h3>

//               {/* Label */}
//               <p className="text-gray-600 text-sm md:text-base">
//                 {item.label}
//               </p>

//             </div>
//           ))}

//         </div>

//       </div>
//     </section>
//   );
// };

// export default AboutStats;
// components/about/AboutStats.tsx
const stats = [
  { number: "2,500+", label: "Active Sellers", suffix: "" },
  { number: "85k+", label: "Products Listed", suffix: "" },
  { number: "120+", label: "Countries Served", suffix: "" },
  { number: "4.92", label: "Customer Rating", suffix: "/5" },
];

const AboutStats = () => {
  return (
    <section className="bg-gradient-to-br from-amber-50 via-white to-pink-50 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">

          {stats.map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              {/* Number */}
              <h3 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-amber-700 to-pink-600 bg-clip-text text-transparent mb-2">
                {item.number}
              </h3>
              {/* Label */}
              <p className="text-gray-600 text-base font-medium">
                {item.label}
              </p>
              {item.suffix && <span className="text-sm text-gray-400">{item.suffix}</span>}
            </div>
          ))}

        </div>

        {/* Divider */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">*Live metrics as of this quarter</p>
        </div>

      </div>
    </section>
  );
};

export default AboutStats;