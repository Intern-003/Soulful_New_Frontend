import { ShoppingBag, User, MapPin, Lock, LogOut } from "lucide-react";

export default function Sidebar({ active, setActive }) {
  const menu = [
    { key: "info", label: "Personal Info", icon: User },
    { key: "orders", label: "Orders", icon: ShoppingBag },
    { key: "addresses", label: "Addresses", icon: MapPin },
    { key: "password", label: "Change Password", icon: Lock },
  ];

  return (
    <div className="col-span-3">
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
        {/* USER */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7A1C3D] to-[#a8325f] text-white flex items-center justify-center font-bold text-lg shadow-md">
            S
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-[15px]">
              Sarah Anderson
            </p>
            <p className="text-xs text-gray-400">Premium Member</p>
          </div>
        </div>

        {/* MENU */}
        <div className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;

            return (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden
                ${
                  isActive
                    ? "bg-[#7A1C3D] text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 cursor-pointer"
                }`}
              >
                {/* Hover Glow */}
                {!isActive && (
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-[#7A1C3D]/10 to-transparent"></span>
                )}

                {/* Icon */}
                <Icon
                  size={18}
                  className={`relative z-10 transition ${
                    isActive
                      ? "text-white"
                      : "text-gray-400 group-hover:text-[#7A1C3D]"
                  }`}
                />

                {/* Text */}
                <span className="relative z-10 text-sm font-medium">
                  {item.label}
                </span>

                {/* Active Indicator */}
                {isActive && (
                  <span className="absolute right-3 w-2 h-2 bg-white rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* LOGOUT */}
        <div className="mt-8 pt-5 border-t border-gray-200">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-300">
            <LogOut size={18} />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
