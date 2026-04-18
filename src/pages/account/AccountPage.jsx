import { useState } from "react";
import Sidebar from "../../components/account/Sidebar";

import Orders from "../../components/account/sections/Orders";
import PersonalInfo from "../../components/account/sections/PersonalInfo";
import Addresses from "../../components/account/sections/Addresses";
import ChangePassword from "../../components/account/sections/ChangePassword";

export default function AccountPage() {
  const [active, setActive] = useState("info");

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

  return (
    <div className="bg-[#f6f6f7] min-h-screen pt-15 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        <Sidebar active={active} setActive={setActive} />

        <div className="col-span-9 bg-white rounded-2xl p-6 shadow-sm h-fit">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
