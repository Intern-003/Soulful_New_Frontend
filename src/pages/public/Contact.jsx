import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";

const Contact = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <p className="text-sm text-gray-500">
          <span className="text-[#7a1c3d] font-medium">Home</span> / Contact
        </p>
        <h1 className="text-2xl md:text-3xl font-bold mt-2 text-gray-800">
          Contact
        </h1>
      </div>

      {/* MAP */}
      <div className="w-full h-[350px]">
        <iframe
          title="map"
          width="100%"
          height="100%"
          className="border-0"
          loading="lazy"
          allowFullScreen
          src="https://www.google.com/maps?q=22.7196,75.8577&z=15&output=embed"
        ></iframe>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid md:grid-cols-3 gap-8">
        {/* LEFT INFO */}
        <div className="space-y-6">
          {/* ADDRESS */}
          <div className="flex items-start gap-4">
            <div className="bg-[#7a1c3d] text-white p-3 rounded-lg">
              <MapPin size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Address</h3>
              <p className="text-gray-500 text-sm">
                G 27 Prestige Tower Navlakha Indore (M.P.) 452001
              </p>
            </div>
          </div>

          {/* PHONE */}
          <div className="flex items-start gap-4">
            <div className="bg-[#7a1c3d] text-white p-3 rounded-lg">
              <Phone size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Call Us</h3>
              <p className="text-gray-500 text-sm">+91 9300098007</p>
            </div>
          </div>

          {/* EMAIL */}
          <div className="flex items-start gap-4">
            <div className="bg-[#7a1c3d] text-white p-3 rounded-lg">
              <Mail size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Email Us</h3>
              <p className="text-gray-500 text-sm">
                soulfuloverseas.in@gmail.com
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm">
          <form className="space-y-4">
            {/* NAME + EMAIL */}
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7a1c3d]"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7a1c3d]"
              />
            </div>

            {/* SUBJECT */}
            <input
              type="text"
              placeholder="Subject"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7a1c3d]"
            />

            {/* MESSAGE */}
            <textarea
              rows="5"
              placeholder="Message"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7a1c3d]"
            ></textarea>

            {/* BUTTON */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-[#7a1c3d] text-white px-6 py-3 rounded-lg hover:bg-[#5a142c] transition"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
