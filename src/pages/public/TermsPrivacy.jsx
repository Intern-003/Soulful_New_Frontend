import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, FileText, Cookie, RefreshCw } from "lucide-react";

const sections = [
  {
    id: "terms",
    title: "Terms",
    icon: <FileText size={16} />,
    content:
      "By using Soulfull, you agree to a seamless and respectful experience. We expect authenticity, lawful usage, and responsible interaction with our platform By using Soulfull, you agree to a seamless and respectful experience. We expect authenticity, lawful usage, and responsible interaction with our platform By using Soulfull, you agree to a seamless and respectful experience. We expect authenticity, lawful usage, and responsible interaction with our platform By using Soulfull, you agree to a seamless and respectful experience. We expect authenticity, lawful usage, and responsible interaction with our platform.",
  },
  {
    id: "privacy",
    title: "Privacy",
    icon: <Lock size={16} />,
    content:
      "Your data is treated with utmost care. We only collect what is necessary to enhance your experience and never compromise your trust.",
  },
  {
    id: "security",
    title: "Security",
    icon: <Shield size={16} />,
    content:
      "We implement modern security standards to protect your data and ensure a safe environment across all interactions.",
  },
  {
    id: "cookies",
    title: "Cookies",
    icon: <Cookie size={16} />,
    content:
      "Cookies help us personalize your journey, optimize performance, and understand usage patterns without invading privacy.",
  },
  {
    id: "updates",
    title: "Updates",
    icon: <RefreshCw size={16} />,
    content:
      "Our policies evolve to serve you better. Continued use reflects your agreement with updated terms.",
  },
];

export default function TermsPrivacy() {
  const [active, setActive] = useState("terms");

  const activeData = sections.find((s) => s.id === active);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fff9fb] via-white to-[#fff3f6] px-6 md:px-20 py-16">
      {/* BACKGROUND GLOW LAYERS */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#8B0D3A]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#7A1C3D]/10 blur-[120px] rounded-full" />

      <div className="relative flex flex-col md:flex-row gap-16">
        {/* LEFT NAV */}
        <div className="md:w-[260px] shrink-0">
          <h1 className="text-3xl font-semibold text-[#7A1C3D] tracking-tight mb-8">
            Soulfull Policy
          </h1>

          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible">
            {sections.map((item) => {
              const isActive = active === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className={`
                    group relative cursor-pointer rounded-xl px-4 py-3
                    transition-all duration-300
                    ${
                      isActive
                        ? "bg-white shadow-md border border-[#f3d6dd]"
                        : "hover:bg-white/60"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {/* ICON */}
                    <div
                      className={`
                        transition-all duration-300
                        ${
                          isActive
                            ? "text-[#8B0D3A]"
                            : "text-gray-400 group-hover:text-[#8B0D3A]"
                        }
                      `}
                    >
                      {item.icon}
                    </div>

                    {/* TEXT */}
                    <span
                      className={`
                        text-sm tracking-wide transition-all
                        ${
                          isActive
                            ? "text-[#8B0D3A] font-semibold"
                            : "text-gray-500 group-hover:text-[#8B0D3A]"
                        }
                      `}
                    >
                      {item.title}
                    </span>
                  </div>

                  {/* ACTIVE SIDE LINE */}
                  <div
                    className={`
                      absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-[3px] rounded-full
                      bg-[#8B0D3A] transition-all duration-300
                      ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"}
                    `}
                  />

                  {/* HOVER GLOW */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-[#8B0D3A]/5 to-transparent"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 relative">
          {/* CONTENT GLASS BOX */}
          <div className="relative bg-white/70 backdrop-blur-2xl border border-[#f1d6dd] shadow-xl rounded-3xl p-8 md:p-12 overflow-hidden">
            {/* INNER GLOW */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#8B0D3A]/10 blur-3xl rounded-full" />

            <motion.div
              key={active}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative z-10"
            >
              {/* TITLE */}
              <div className="flex items-center gap-3 mb-6">
                <div className="text-[#8B0D3A]">{activeData.icon}</div>

                <h2 className="text-3xl md:text-4xl font-semibold text-[#7A1C3D] tracking-tight">
                  {activeData.title}
                </h2>
              </div>

              {/* PREMIUM DIVIDER */}
              <div className="w-20 h-[2px] bg-gradient-to-r from-[#8B0D3A] via-[#c04b6e] to-transparent mb-6" />

              {/* CONTENT */}
              <p className="text-gray-600 leading-relaxed text-base md:text-lg max-w-2xl">
                {activeData.content}
              </p>

              {/* EXTRA DETAIL (premium touch) */}
              <div className="mt-10 flex items-center gap-3 text-xs text-gray-400">
                <div className="w-8 h-[1px] bg-gray-300"></div>
                <span>Updated recently</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-16 text-center text-xs text-gray-400 tracking-wide">
        © {new Date().getFullYear()} Soulfull — Crafted with care & trust
      </div>
    </div>
  );
}
