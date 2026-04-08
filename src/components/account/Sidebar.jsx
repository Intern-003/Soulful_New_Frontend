export default function Sidebar({ active, setActive }) {
  const menu = [
    { key: "orders", label: "Orders" },
    { key: "wishlist", label: "Wishlist" },
    { key: "payment", label: "Payment methods" },
    { key: "reviews", label: "My reviews" },
    { key: "info", label: "Personal info" },
    { key: "addresses", label: "Addresses" },
    { key: "notifications", label: "Notifications" },
  ];

  return (
    <div className="col-span-3 bg-white rounded-2xl p-5 shadow-sm">
      {/* USER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#7a1c3d] text-white flex items-center justify-center font-bold">
          S
        </div>
        <div>
          <p className="font-semibold">Sarah Anderson</p>
          <p className="text-xs text-gray-500">100 bonuses available</p>
        </div>
      </div>

      {/* MENU */}
      <div className="space-y-2">
        {menu.map((item) => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              active === item.key
                ? "bg-[#7a1c3d] text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6 text-red-500 text-sm">Log out</div>
    </div>
  );
}
