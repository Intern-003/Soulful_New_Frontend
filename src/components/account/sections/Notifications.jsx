import { useState } from "react";

const initialSettings = [
  {
    id: "orders",
    title: "Orders",
    desc: "Updates about your order status",
    email: true,
    sms: true,
    push: true,
  },
  {
    id: "promotions",
    title: "Promotions",
    desc: "Discounts, offers & sales",
    email: true,
    sms: false,
    push: true,
  },
  {
    id: "account",
    title: "Account Activity",
    desc: "Login alerts & account changes",
    email: true,
    sms: true,
    push: false,
  },
  {
    id: "security",
    title: "Security",
    desc: "Password changes & suspicious activity",
    email: true,
    sms: true,
    push: true,
  },
];

export default function Notifications() {
  const [settings, setSettings] = useState(initialSettings);

  const toggle = (id, type) => {
    setSettings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [type]: !item[type] } : item,
      ),
    );
  };

  const handleSave = () => {
    console.log("Saved settings:", settings);
    alert("Preferences saved ✅");
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Notifications</h2>

        <button
          onClick={handleSave}
          className="bg-[#7a1c3d] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#5a142c]"
        >
          Save Changes
        </button>
      </div>

      {/* TABLE HEADER */}
      <div className="grid grid-cols-4 text-sm text-gray-500 pb-2 border-b mb-4">
        <span>Type</span>
        <span>Email</span>
        <span>SMS</span>
        <span>Push</span>
      </div>

      {/* SETTINGS */}
      <div className="space-y-4">
        {settings.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-4 items-center py-3 border-b"
          >
            {/* TYPE */}
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>

            {/* TOGGLES */}
            <Toggle
              checked={item.email}
              onChange={() => toggle(item.id, "email")}
            />
            <Toggle
              checked={item.sms}
              onChange={() => toggle(item.id, "sms")}
            />
            <Toggle
              checked={item.push}
              onChange={() => toggle(item.id, "push")}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`w-10 h-5 flex items-center rounded-full p-1 transition ${
        checked ? "bg-[#7a1c3d]" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
