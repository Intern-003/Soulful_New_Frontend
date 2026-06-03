import {
  ShoppingBag,
  User,
  MapPin,
  Lock,
  LogOut,
} from "lucide-react";

export default function Sidebar({ active, setActive, user }) {
  const name = user?.name || "Guest User";
  const firstLetter = name.charAt(0).toUpperCase();

  const menu = [
    { key: "info", label: "Personal Info", icon: User },
    { key: "orders", label: "Orders", icon: ShoppingBag },
    { key: "addresses", label: "Addresses", icon: MapPin },
    { key: "password", label: "Change Password", icon: Lock },
  ];

  return (
    <div className="w-full lg:col-span-3">
      <div className="bg-white/80 backdrop-blur-xl border rounded-3xl p-5 sm:p-6 shadow-md">
        
        {/* USER */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#7A1C3D] text-white flex items-center justify-center font-bold">
            {firstLetter}
          </div>

          <div>
            <p className="font-semibold text-sm sm:text-base text-gray-800">
              {name}
            </p>
            <p className="text-xs text-gray-400">
              {user?.membership || "Premium Member"}
            </p>
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
                className={`w-full flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl text-sm transition
                ${
                  isActive
                    ? "bg-[#7A1C3D] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* LOGOUT */}
        <div className="mt-6 pt-4 border-t">
          <button className="w-full flex items-center gap-3 px-3 sm:px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl text-sm">
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}