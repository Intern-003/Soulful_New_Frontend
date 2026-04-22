import React from "react";
import { motion } from "framer-motion";
import {
  Truck,
  Package,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

const steps = [
  {
    icon: <Package size={18} />,
    title: "Order Confirmed",
    desc: "Once your order is placed, we begin processing immediately with care and precision.",
  },
  {
    icon: <Truck size={18} />,
    title: "Packed & Dispatched",
    desc: "Your items are securely packed and handed over to our trusted delivery partners.",
  },
  {
    icon: <MapPin size={18} />,
    title: "Out for Delivery",
    desc: "Your order is on the way and will reach you shortly at your doorstep.",
  },
  {
    icon: <CheckCircle size={18} />,
    title: "Delivered",
    desc: "Enjoy your Soulfull experience — delivered safely and on time.",
  },
];

export default function ShippingInfo() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#fff9fb] via-white to-[#fff3f6] px-6 md:px-20 py-16 overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#8B0D3A]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#7A1C3D]/10 blur-[120px] rounded-full" />

      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-semibold text-[#7A1C3D] tracking-tight mb-4">
          Shipping Information
        </h1>
        <p className="text-gray-500 text-base md:text-lg">
          Fast, reliable, and transparent delivery — crafted for a seamless
          experience.
        </p>
      </div>

      {/* TIMELINE */}
      <div className="relative max-w-5xl mx-auto">
        {/* LINE */}
        <div className="hidden md:block absolute left-1/2 top-0 w-[2px] h-full bg-gradient-to-b from-[#8B0D3A]/30 to-transparent -translate-x-1/2" />

        <div className="flex flex-col gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative flex flex-col md:flex-row items-center gap-6 ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* CARD */}
              <div className="w-full md:w-1/2">
                <div className="bg-white/70 backdrop-blur-xl border border-[#f1d6dd] shadow-lg rounded-2xl p-6 hover:shadow-xl transition duration-300">
                  <div className="flex items-center gap-3 mb-3 text-[#8B0D3A]">
                    {step.icon}
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>

              {/* DOT */}
              <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[#f1d6dd] shadow-md z-10">
                <div className="w-3 h-3 bg-[#8B0D3A] rounded-full" />
              </div>

              {/* EMPTY SIDE */}
              <div className="w-full md:w-1/2 hidden md:block" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* INFO CARDS */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mt-20">
        {[
          {
            icon: <Clock size={18} />,
            title: "Delivery Time",
            desc: "Orders are typically delivered within 3–7 business days depending on location.",
          },
          {
            icon: <Truck size={18} />,
            title: "Shipping Charges",
            desc: "We offer free shipping on select orders. Charges may vary based on location.",
          },
          {
            icon: <ShieldCheck size={18} />,
            title: "Secure Delivery",
            desc: "All orders are handled with care and delivered safely with trusted partners.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="bg-white/70 backdrop-blur-xl border border-[#f1d6dd] rounded-2xl p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3 text-[#8B0D3A] mb-3">
              {item.icon}
              <h4 className="font-semibold">{item.title}</h4>
            </div>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* FOOTER NOTE */}
      <div className="text-center mt-16 text-sm text-gray-400">
        We ensure every delivery reflects the quality and trust of Soulfull.
      </div>
    </div>
  );
}
