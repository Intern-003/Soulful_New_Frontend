import { useState } from "react";
import Sidebar from "../../components/account/Sidebar";

import Orders from "../../components/account/sections/Orders";
import Wishlist from "../../components/account/sections/Wishlist";
import PaymentMethods from "../../components/account/sections/PaymentMethods";
import Reviews from "../../components/account/sections/Reviews";
import PersonalInfo from "../../components/account/sections/PersonalInfo";
import Addresses from "../../components/account/sections/Addresses";
import Notifications from "../../components/account/sections/Notifications";

export default function AccountPage() {
  const [active, setActive] = useState("orders");

  const renderSection = () => {
    switch (active) {
      case "orders":
        return <Orders />;
      case "wishlist":
        return <Wishlist />;
      case "payment":
        return <PaymentMethods />;
      case "reviews":
        return <Reviews />;
      case "info":
        return <PersonalInfo />;
      case "addresses":
        return <Addresses />;
      case "notifications":
        return <Notifications />;
      default:
        return <Orders />;
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
