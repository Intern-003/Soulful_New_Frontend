import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  Repeat,
  CheckCircle,
  XCircle,
  ChevronDown,
} from "lucide-react";

const tabs = [
  { id: "returns", label: "Returns", icon: <RotateCcw size={16} /> },
  { id: "exchange", label: "Exchanges", icon: <Repeat size={16} /> },
];

const stepsData = {
  returns: [
    "Request a return within 7 days",
    "Package the item securely",
    "Pickup scheduled by us",
    "Refund processed after inspection",
  ],
  exchange: [
    "Request exchange within 7 days",
    "Select replacement product",
    "Pickup & replacement initiated",
    "New item delivered to you",
  ],
};

const faqs = [
  {
    q: "What items are eligible for return?",
    a: "Items must be unused, in original packaging, and in resellable condition.",
  },
  {
    q: "How long does refund take?",
    a: "Refunds are processed within 5–7 business days after inspection.",
  },
  {
    q: "Can I exchange for a different product?",
    a: "Yes, exchanges are allowed based on availability and eligibility.",
  },
];

export default function ReturnsExchange() {
  const [activeTab, setActiveTab] = useState("returns");
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#fff9fb] via-white to-[#fff3f6] px-6 md:px-20 py-16 overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-[350px] h-[350px] bg-[#8B0D3A]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-[#7A1C3D]/10 blur-[120px] rounded-full" />

      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-semibold text-[#7A1C3D] mb-4">
          Returns & Exchanges
        </h1>
        <p className="text-gray-500">
          Simple, transparent, and designed to give you complete peace of mind.
        </p>
      </div>

      {/* TOGGLE TABS */}
      <div className="flex justify-center mb-12">
        <div className="flex bg-white/70 backdrop-blur-xl border border-[#f1d6dd] rounded-full p-1 shadow-md">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-5 py-2 rounded-full text-sm transition-all
                  ${
                    isActive
                      ? "bg-[#8B0D3A] text-white shadow"
                      : "text-gray-500 hover:text-[#8B0D3A]"
                  }
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* STEPS FLOW */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="flex flex-wrap justify-center gap-4">
          {stepsData[activeTab].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="px-4 py-2 rounded-full bg-white border border-[#f1d6dd] text-sm text-gray-600 shadow-sm hover:shadow-md transition"
            >
              {step}
            </motion.div>
          ))}
        </div>
      </div>

      {/* POLICY BOX */}
      <div className="max-w-3xl mx-auto mb-16">
        <div className="relative bg-white/70 backdrop-blur-xl border border-[#f1d6dd] rounded-2xl p-6 shadow-lg overflow-hidden">
          {/* glow */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#8B0D3A]/10 blur-3xl rounded-full" />

          <div className="relative z-10">
            <h3 className="text-xl font-semibold text-[#7A1C3D] mb-3">
              Policy Highlights
            </h3>

            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                7-day easy return & exchange
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                Hassle-free pickup service
              </li>
              <li className="flex items-center gap-2">
                <XCircle size={16} className="text-red-400" />
                Items must be unused & intact
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h3 className="text-xl font-semibold text-[#7A1C3D] mb-6 text-center">
          Frequently Asked Questions
        </h3>

        <div className="space-y-3">
          {faqs.map((item, i) => {
            const isOpen = openFAQ === i;
            return (
              <div
                key={i}
                className="bg-white/70 border border-[#f1d6dd] rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFAQ(isOpen ? null : i)}
                  className="w-full flex justify-between items-center px-4 py-3 text-left cursor-pointer"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`transition ${isOpen ? "rotate-180" : ""}`}
                    size={18}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 text-sm text-gray-500"
                    >
                      {item.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center mt-16 text-xs text-gray-400">
        Your satisfaction is at the heart of Soulfull.
      </div>
    </div>
  );
}
