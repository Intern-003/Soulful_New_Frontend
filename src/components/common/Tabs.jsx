// src/components/common/Tabs.jsx
import React from "react";

const Tabs = ({ tabs, activeTab, onTabChange, className = "" }) => {
  return (
    <div className={`flex justify-center gap-10 mb-12 border-b pb-4 flex-wrap ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab)}
          className={`uppercase text-sm font-semibold tracking-wide pb-2 transition
            ${activeTab?.id === tab.id
              ? "text-[#7a1c3d] border-b-2 border-[#7a1c3d]"
              : "text-gray-500 hover:text-[#7a1c3d]"
            }`}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
};

export default Tabs;