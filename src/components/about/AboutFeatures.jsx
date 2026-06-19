// const features = [
//   {
//     title: "Ut enim ad minima veniam",
//     desc: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
//     img: "/images/about-1.jpg",
//     btn: "Explore More",
//   },
//   {
//     title: "Quis autem vel eum iure",
//     desc: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.",
//     img: "/images/about-2.jpg",
//     btn: "Learn More",
//   },
//   {
//     title: "Nam libero tempore",
//     desc: "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet.",
//     img: "/images/about-3.jpg",
//     btn: "Discover More",
//   },
// ];

// const AboutFeatures = () => {
//   return (
//     <section className="bg-white py-16 md:py-20">
//       <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">

//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

//           {features.map((item, index) => (
//             <div
//               key={index}
//               className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
//             >
              
//               {/* Image */}
//               <div className="overflow-hidden">
//                 <img
//                   src={item.img}
//                   alt={item.title}
//                   className="w-full h-60 object-cover transform group-hover:scale-110 transition duration-500"
//                 />
//               </div>

//               {/* Content */}
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-pink-600 transition">
//                   {item.title}
//                 </h3>

//                 <p className="text-gray-600 text-sm leading-6 mb-5">
//                   {item.desc}
//                 </p>

//                 {/* Button */}
//                 <button className="text-pink-600 font-medium flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
//                   {item.btn}
//                   <span className="text-lg">→</span>
//                 </button>
//               </div>

//             </div>
//           ))}

//         </div>

//       </div>
//     </section>
//   );
// };

// export default AboutFeatures;

// components/about/AboutFeatures.jsx
import {
  Globe,
  Users,
  Sparkles,
  ShieldCheck,
  Truck,
  Heart,
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Curated Multi-Vendor Network",
    description:
      "Handpicked sellers from India and beyond, each vetted for quality and authenticity.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Marketplace",
    description:
      "Safe payments, buyer protection, and transparent dispute resolution for peace of mind.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Sell to customers worldwide or discover unique products from different cultures.",
  },
  {
    icon: Sparkles,
    title: "Artisan First",
    description:
      "Fair commission structure and seller tools designed to help small businesses thrive.",
  },
  {
    icon: Truck,
    title: "Reliable Logistics",
    description:
      "Integrated shipping solutions with tracking and dedicated support for deliveries.",
  },
  {
    icon: Heart,
    title: "Sustainable Choices",
    description:
      "Promoting eco-friendly, handmade, and upcycled products for conscious living.",
  },
];

const AboutFeatures = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-[#fff9fb] via-white to-[#fff3f6]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-[#7a1c3d] uppercase tracking-wide mb-3">
            Why SoulfulOverseas
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#2d0f1f]">
            Built for Sellers, Loved by Buyers
          </h2>
          <div className="mt-4 h-1 w-20 bg-gradient-to-r from-[#7a1c3d] to-[#a52355] rounded-full mx-auto"></div>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              <div className="w-12 h-12 bg-[#f8e9ef] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#7a1c3d]/10 transition-colors">
                <feature.icon className="w-6 h-6 text-[#7a1c3d] group-hover:text-[#a52355]" />
              </div>
              <h3 className="text-xl font-bold text-[#2d0f1f] mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-gray-100">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-700">
              Trusted by 10,000+ happy customers & 1,500+ active sellers
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutFeatures;