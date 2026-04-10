import { useState } from "react";
import { Headphones, Package, CreditCard, User, Gift } from "lucide-react";

export default function Support() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      q: "How do I track my order?",
      a: "You can track your order from the Orders section in your account.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept cards, UPI, wallets and net banking.",
    },
    {
      q: "How can I change my password?",
      a: "Go to account settings and update your password securely.",
    },
  ];

  const topics = [
    {
      title: "Track Your Order",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      title: "Return Policy",
      desc: "Praesent venenatis metus at tortor pulvinar varius.",
    },
    {
      title: "Account Security",
      desc: "Maecenas tempus tellus eget condimentum rhoncus.",
    },
    {
      title: "Payment Methods",
      desc: "Vestibulum purus quam, scelerisque ut mollis sed.",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-[#f6f6f7] to-[#f0e9ec] min-h-screen px-6 py-23">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-semibold tracking-tight">
              How Can We Help You?
            </h1>
            <p className="text-gray-500 mt-2">
              Browse help topics or search for assistance
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-16">
            {topics.map((t, i) => (
              <div
                key={i}
                className="relative group rounded-2xl p-6 bg-white/70 backdrop-blur-md border border-white/40 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#7a1c3d] to-pink-400 rounded-l-xl opacity-0 group-hover:opacity-100 transition" />

                <h3 className="font-semibold text-lg mb-2 group-hover:text-[#7a1c3d] transition">
                  {t.title}
                </h3>

                <p className="text-sm text-gray-500 mb-3">{t.desc}</p>

                <button className="text-[#7a1c3d] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn More →
                </button>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-md border rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <div
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  className="flex justify-between cursor-pointer"
                >
                  <p className="font-medium">{f.q}</p>
                  <span className="text-[#7a1c3d]">
                    {openFAQ === i ? "−" : "+"}
                  </span>
                </div>

                {openFAQ === i && (
                  <p className="text-sm text-gray-500 mt-3">{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="sticky top-6 h-fit">
          <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-lg">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7a1c3d] to-pink-500 text-white flex items-center justify-center mb-4 shadow-lg">
                <Headphones />
              </div>

              <h3 className="font-semibold text-lg">Need More Help?</h3>

              <p className="text-gray-500 text-sm mt-2">
                Our support team is available 24/7
              </p>

              <button className="mt-6 w-full bg-gradient-to-r from-[#7a1c3d] to-pink-500 text-white py-2 rounded-full shadow-md hover:scale-[1.02] transition">
                Live Chat
              </button>

              <button className="mt-3 w-full bg-gray-100 py-2 rounded-full hover:bg-gray-200 transition">
                Send Email
              </button>

              <p className="text-xs text-gray-400 mt-4">or call us</p>
              <p className="mt-2 font-medium">+1 (555) 123-4567</p>
            </div>

            <div className="mt-10">
              <h4 className="font-semibold mb-3">Support Resources</h4>

              <ul className="space-y-2 text-sm text-gray-600">
                <li className="hover:text-[#7a1c3d] cursor-pointer transition">
                  User Guides
                </li>
                <li className="hover:text-[#7a1c3d] cursor-pointer transition">
                  Video Tutorials
                </li>
                <li className="hover:text-[#7a1c3d] cursor-pointer transition">
                  Documentation
                </li>
                <li className="hover:text-[#7a1c3d] cursor-pointer transition">
                  Downloads
                </li>
              </ul>
            </div>

            {/* HOURS */}
            <div className="mt-10">
              <h4 className="font-semibold mb-3">Business Hours</h4>

              <p className="text-sm text-gray-600">
                Mon - Fri: <span className="font-medium">9AM - 8PM</span>
              </p>
              <p className="text-sm text-gray-600">
                Sat: <span className="font-medium">10AM - 6PM</span>
              </p>
              <p className="text-sm text-gray-600">
                Sun: <span className="font-medium">Closed</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
