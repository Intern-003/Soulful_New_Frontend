import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";

const Input = ({ placeholder, type = "text" }) => (
  <div className="relative">
    <input
      type={type}
      placeholder=" "
      className="peer w-full border border-[#ecd2d9] bg-white/60 backdrop-blur-md rounded-xl px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-[#8B0D3A]"
    />
    <label className="absolute left-4 top-2 text-xs text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#8B0D3A]">
      {placeholder}
    </label>
  </div>
);

const Contact = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#fff9fb] via-white to-[#fff3f6] overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#8B0D3A]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#7A1C3D]/10 blur-[120px] rounded-full" />

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 pt-12 pb-6">
        <p className="text-sm text-gray-400">
          <span className="text-[#8B0D3A] font-medium">Home</span> / Contact
        </p>

        <h1 className="text-4xl md:text-5xl font-semibold text-[#7A1C3D] mt-3 tracking-tight">
          Get in Touch
        </h1>

        <p className="text-gray-500 mt-2 max-w-md">
          We’re here to help, answer questions, or just hear from you.
        </p>
      </div>

      {/* MAP */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="rounded-3xl overflow-hidden shadow-lg border border-[#f1d6dd]">
          <iframe
            title="map"
            width="100%"
            height="320"
            className="border-0"
            loading="lazy"
            allowFullScreen
            src="https://www.google.com/maps?q=22.7196,75.8577&z=15&output=embed"
          ></iframe>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-16 grid md:grid-cols-3 gap-10">
        {/* LEFT INFO */}
        <div className="space-y-6">
          {[
            {
              icon: <MapPin size={18} />,
              title: "Address",
              value: "G 27 Prestige Tower Navlakha Indore (M.P.) 452001",
            },
            {
              icon: <Phone size={18} />,
              title: "Call Us",
              value: "+91 9300098007",
            },
            {
              icon: <Mail size={18} />,
              title: "Email",
              value: "soulfuloverseas.in@gmail.com",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3 }}
              className="flex items-start gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-md border border-[#f1d6dd] shadow-sm hover:shadow-md transition"
            >
              <div className="text-[#8B0D3A]">{item.icon}</div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* RIGHT FORM */}
        <div className="md:col-span-2 relative">
          <div className="relative bg-white/70 backdrop-blur-2xl border border-[#f1d6dd] rounded-3xl p-8 md:p-10 shadow-xl overflow-hidden">
            {/* inner glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#8B0D3A]/10 blur-3xl rounded-full" />

            <form className="space-y-5 relative z-10">
              {/* ROW */}
              <div className="grid md:grid-cols-2 gap-4">
                <Input placeholder="Your Name" />
                <Input placeholder="Your Email" type="email" />
              </div>

              <Input placeholder="Subject" />

              {/* TEXTAREA */}
              <div className="relative">
                <textarea
                  rows="5"
                  placeholder=" "
                  className="peer w-full border border-[#ecd2d9] bg-white/60 backdrop-blur-md rounded-xl px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-[#8B0D3A]"
                ></textarea>
                <label className="absolute left-4 top-2 text-xs text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#8B0D3A]">
                  Message
                </label>
              </div>

              {/* BUTTON */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="relative overflow-hidden group bg-[#8B0D3A] text-white px-8 py-3 rounded-xl font-medium tracking-wide shadow-md hover:shadow-lg transition"
                >
                  {/* shine */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-700 animate-[shine_2s_linear_infinite]" />

                  <span className="relative z-10">Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center pb-10 text-xs text-gray-400">
        © {new Date().getFullYear()} Soulfull — We’d love to hear from you
      </div>
    </div>
  );
};

export default Contact;
