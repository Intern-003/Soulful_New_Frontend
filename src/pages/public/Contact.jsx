// import React from "react";
// import { MapPin, Phone, Mail } from "lucide-react";
// import { motion } from "framer-motion";

// const Input = ({ placeholder, type = "text" }) => (
//   <div className="relative">
//     <input
//       type={type}
//       placeholder=" "
//       className="peer w-full border border-[#ecd2d9] bg-white/60 backdrop-blur-md rounded-xl px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-[#8B0D3A]"
//     />
//     <label className="absolute left-4 top-2 text-xs text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#8B0D3A]">
//       {placeholder}
//     </label>
//   </div>
// );

// const Contact = () => {
//   return (
//     <div className="relative min-h-screen bg-gradient-to-br from-[#fff9fb] via-white to-[#fff3f6] overflow-hidden">
//       {/* BACKGROUND GLOW */}
//       <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#8B0D3A]/10 blur-[120px] rounded-full" />
//       <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#7A1C3D]/10 blur-[120px] rounded-full" />

//       {/* HEADER */}
//       <div className="max-w-7xl mx-auto px-6 md:px-16 pt-12 pb-6">
//         <p className="text-sm text-gray-400">
//           <span className="text-[#8B0D3A] font-medium">Home</span> / Contact
//         </p>

//         <h1 className="text-4xl md:text-5xl font-semibold text-[#7A1C3D] mt-3 tracking-tight">
//           Get in Touch
//         </h1>

//         <p className="text-gray-500 mt-2 max-w-md">
//           We’re here to help, answer questions, or just hear from you.
//         </p>
//       </div>

//       {/* MAP */}
//       <div className="max-w-7xl mx-auto px-6 md:px-12">
//         <div className="rounded-3xl overflow-hidden shadow-lg border border-[#f1d6dd]">
//           <iframe
//             title="map"
//             width="100%"
//             height="320"
//             className="border-0"
//             loading="lazy"
//             allowFullScreen
//             src="https://www.google.com/maps?q=22.7196,75.8577&z=15&output=embed"
//           ></iframe>
//         </div>
//       </div>

//       {/* CONTENT */}
//       <div className="max-w-7xl mx-auto px-6 md:px-16 py-16 grid md:grid-cols-3 gap-10">
//         {/* LEFT INFO */}
//         <div className="space-y-6">
//           {[
//             {
//               icon: <MapPin size={18} />,
//               title: "Address",
//               value: "G 27 Prestige Tower Navlakha Indore (M.P.) 452001",
//             },
//             {
//               icon: <Phone size={18} />,
//               title: "Call Us",
//               value: "+91 9300098007",
//             },
//             {
//               icon: <Mail size={18} />,
//               title: "Email",
//               value: "soulfuloverseas.in@gmail.com",
//             },
//           ].map((item, i) => (
//             <motion.div
//               key={i}
//               whileHover={{ y: -3 }}
//               className="flex items-start gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-md border border-[#f1d6dd] shadow-sm hover:shadow-md transition"
//             >
//               <div className="text-[#8B0D3A]">{item.icon}</div>
//               <div>
//                 <h3 className="text-sm font-semibold text-gray-800">
//                   {item.title}
//                 </h3>
//                 <p className="text-gray-500 text-sm">{item.value}</p>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* RIGHT FORM */}
//         <div className="md:col-span-2 relative">
//           <div className="relative bg-white/70 backdrop-blur-2xl border border-[#f1d6dd] rounded-3xl p-8 md:p-10 shadow-xl overflow-hidden">
//             {/* inner glow */}
//             <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#8B0D3A]/10 blur-3xl rounded-full" />

//             <form className="space-y-5 relative z-10">
//               {/* ROW */}
//               <div className="grid md:grid-cols-2 gap-4">
//                 <Input placeholder="Your Name" />
//                 <Input placeholder="Your Email" type="email" />
//               </div>

//               <Input placeholder="Subject" />

//               {/* TEXTAREA */}
//               <div className="relative">
//                 <textarea
//                   rows="5"
//                   placeholder=" "
//                   className="peer w-full border border-[#ecd2d9] bg-white/60 backdrop-blur-md rounded-xl px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-[#8B0D3A]"
//                 ></textarea>
//                 <label className="absolute left-4 top-2 text-xs text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#8B0D3A]">
//                   Message
//                 </label>
//               </div>

//               {/* BUTTON */}
//               <div className="pt-2">
//                 <button
//                   type="submit"
//                   className="relative overflow-hidden group bg-[#8B0D3A] text-white px-8 py-3 rounded-xl font-medium tracking-wide shadow-md hover:shadow-lg transition"
//                 >
//                   {/* shine */}
//                   <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-700 animate-[shine_2s_linear_infinite]" />

//                   <span className="relative z-10">Send Message</span>
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>

//       {/* FOOTER */}
//       <div className="text-center pb-10 text-xs text-gray-400">
//         © {new Date().getFullYear()} Soulfull — We’d love to hear from you
//       </div>
//     </div>
//   );
// };

// export default Contact;


import React, { useState } from "react";
import { MapPin, Phone, Mail, Send, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Input = ({ placeholder, type = "text", value, onChange, required }) => (
  <div className="relative">
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder=" "
      className="peer w-full border border-[#ecd2d9] bg-white/60 backdrop-blur-md rounded-xl px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-[#8B0D3A] focus:ring-2 focus:ring-[#8B0D3A]/20 transition-all"
    />
    <label className="absolute left-4 top-2 text-xs text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#8B0D3A]">
      {placeholder}
    </label>
  </div>
);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <MapPin size={20} />,
      title: "Visit Us",
      value: "G 27 Prestige Tower, Navlakha, Indore (M.P.) 452001",
      details: ["Monday - Saturday: 10 AM - 7 PM", "Sunday: Closed"]
    },
    {
      icon: <Phone size={20} />,
      title: "Call Us",
      value: "+91 9300098007",
      details: ["Support: 10 AM - 6 PM", "Emergency: 24/7"]
    },
    {
      icon: <Mail size={20} />,
      title: "Email Us",
      value: "soulfuloverseas.in@gmail.com",
      details: ["Response within 24 hours", "For queries & support"]
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#fff9fb] via-white to-[#fff3f6] overflow-x-hidden">
      {/* BACKGROUND GLOW EFFECTS */}
      <div className="absolute top-0 left-0 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-[#8B0D3A]/10 blur-[100px] sm:blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-[#7A1C3D]/10 blur-[100px] sm:blur-[120px] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-[#8B0D3A]/5 blur-[80px] rounded-full" />

      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6 sm:pb-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
          <span className="text-[#8B0D3A] font-medium cursor-pointer hover:underline transition">
            Home
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">Contact</span>
        </nav>

        {/* Title Section */}
        <div className="text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#7A1C3D] tracking-tight">
            Get in Touch
          </h1>
          <p className="text-gray-500 mt-2 sm:mt-3 text-sm sm:text-base max-w-md mx-auto sm:mx-0">
            We're here to help, answer questions, or just hear from you.
          </p>
        </div>
      </div>

      {/* MAP SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-[#f1d6dd]">
          <iframe
            title="SoulfulOverseas Location Map"
            width="100%"
            height="250"
            className="sm:h-[300px] md:h-[320px] border-0"
            loading="lazy"
            allowFullScreen
            src="https://www.google.com/maps?q=22.7196,75.8577&z=15&output=embed"
          ></iframe>
        </div>
      </div>

      {/* MAIN CONTENT SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* LEFT - CONTACT INFO CARDS */}
          <div className="space-y-4 sm:space-y-6">
            {contactInfo.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group bg-white/70 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-[#f1d6dd] shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#8B0D3A]/10 to-[#7A1C3D]/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-[#8B0D3A] group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base font-medium break-words">
                      {item.value}
                    </p>
                    {item.details && (
                      <div className="mt-2 space-y-1">
                        {item.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-400 text-xs sm:text-sm">
                            {detail}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Social Links (Optional) */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-[#f1d6dd]">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Connect With Us
              </h3>
              <div className="flex gap-3">
                {["Facebook", "Instagram", "Twitter", "LinkedIn"].map((social) => (
                  <button
                    key={social}
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-[#8B0D3A] hover:shadow-md transition-all touch-feedback"
                    aria-label={social}
                  >
                    <span className="text-xs sm:text-sm">{social[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT - CONTACT FORM */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative bg-white/80 backdrop-blur-2xl border border-[#f1d6dd] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl"
            >
              {/* Decorative Elements */}
              <div className="absolute -top-5 -right-5 w-32 h-32 bg-gradient-to-br from-[#8B0D3A]/5 to-[#7A1C3D]/5 blur-2xl rounded-full" />
              <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-gradient-to-tr from-[#8B0D3A]/5 to-[#7A1C3D]/5 blur-2xl rounded-full" />

              <div className="relative z-10">
                {/* Form Header */}
                <div className="mb-6 sm:mb-8 text-center sm:text-left">
                  <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                    Send a Message
                  </h2>
                  <p className="text-gray-500 text-sm mt-2">
                    We'll get back to you within 24 hours
                  </p>
                </div>

                {/* Success Message */}
                <AnimatePresence>
                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <p className="text-green-700 text-sm">
                        Message sent successfully! We'll contact you soon.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                    <Input
                      placeholder="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      placeholder="Your Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Input
                    placeholder="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />

                  {/* Textarea with animation */}
                  <div className="relative">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      placeholder=" "
                      className="peer w-full border border-[#ecd2d9] bg-white/60 backdrop-blur-md rounded-xl px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-[#8B0D3A] focus:ring-2 focus:ring-[#8B0D3A]/20 transition-all resize-none"
                    ></textarea>
                    <label className="absolute left-4 top-2 text-xs text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#8B0D3A]">
                      Message
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 sm:pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="relative w-full sm:w-auto overflow-hidden group bg-gradient-to-r from-[#8B0D3A] to-[#7A1C3D] text-white px-6 sm:px-8 py-3 rounded-xl font-medium tracking-wide shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed touch-feedback"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            Send Message
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </form>

                {/* Contact Note */}
                <p className="text-xs text-gray-400 text-center sm:text-left mt-6 pt-4 border-t border-[#f1d6dd]">
                  By submitting this form, you agree to our privacy policy and consent to being contacted.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center py-6 sm:py-8 pb-8 sm:pb-10">
        <p className="text-xs sm:text-sm text-gray-400">
          © {new Date().getFullYear()} SoulfulOverseas — We'd love to hear from you
        </p>
      </div>
    </div>
  );
};

export default Contact;