import { Phone, Mail, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useState } from "react";

const TopBar = () => {
  const messages = [
    "Free shipping on premium orders",
    "Crafted with precision & care",
    "Luxury products with trusted quality",
  ];

  const [index, setIndex] = useState(0);

  // Auto rotate text
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden md:flex items-center justify-between bg-[#f7f2f4] px-6 py-2 text-[12px] tracking-wide text-[#8C0D4F]">
      {/* LEFT - Contact (Sharper & Darker) */}
      <div className="flex items-center gap-6 font-medium">
        <span className="flex items-center gap-1.5">
          <Phone size={13} strokeWidth={1.8} />
          +91 9300098007
        </span>
        <span className="flex items-center gap-1.5">
          <Mail size={13} strokeWidth={1.8} />
          soulfuloverseas.in@gmail.com
        </span>
      </div>

      {/* CENTER - PERFECT ROTATING TEXT */}
      <div className="relative h-5 w-[320px] overflow-hidden flex items-center justify-center">
        {messages.map((msg, i) => (
          <span
            key={i}
            className={`absolute transition-all duration-700 ease-in-out cursor-pointer pr-20 ${
              i === index
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
          >
            {msg}
          </span>
        ))}
      </div>

      {/* RIGHT - Trust Signals (Sharper) */}
      <div className="flex items-center gap-5 font-medium">
        <span className="flex items-center gap-1.5">
          <Truck size={13} strokeWidth={1.8} />
          Trusted Shipping
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={13} strokeWidth={1.8} />
          Secure Shopping
        </span>
      </div>
    </div>
  );
};

export default TopBar;
