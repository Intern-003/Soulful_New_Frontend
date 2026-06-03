import { useState } from "react";
import useGet from "../../api/hooks/useGet";

import Sidebar from "../../components/account/Sidebar";
import Orders from "../../components/account/sections/Orders";
import PersonalInfo from "../../components/account/sections/PersonalInfo";
import Addresses from "../../components/account/sections/Addresses";
import ChangePassword from "../../components/account/sections/ChangePassword";

export default function AccountPage() {
  const [active, setActive] = useState("info");

  const { data, loading } = useGet("/profile");
  const user = data?.user || null;

  const renderSection = () => {
    switch (active) {
      case "info":
        return <PersonalInfo />;
      case "orders":
        return <Orders />;
      case "addresses":
        return <Addresses />;
      case "password":
        return <ChangePassword />;
      default:
        return <PersonalInfo />;
    }
  };

  // -------------------------
  // LOADING (only skeleton-friendly)
  // -------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f6f7]">
        <div className="animate-pulse text-sm text-gray-500">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f6f6f7] min-h-screen pt-16 sm:pt-20 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

        {/* ---------------- SIDEBAR ---------------- */}
        <aside className="w-full lg:w-1/4 lg:sticky lg:top-20 h-fit">
          <Sidebar
            active={active}
            setActive={setActive}
            user={user}
          />
        </aside>

        {/* ---------------- CONTENT ---------------- */}
        <main className="flex-1 bg-white rounded-2xl p-4 sm:p-6 shadow-sm min-h-[60vh]">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}