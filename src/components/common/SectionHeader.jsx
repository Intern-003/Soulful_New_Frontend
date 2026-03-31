// src/components/common/SectionHeader.jsx
import React from 'react';

const SectionHeader = ({ title, subtitle, align = 'center' }) => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <div className={`mb-12 ${alignClass[align]}`}>
      <h2 className="text-3xl font-bold text-[#7a1c3d]">{title}</h2>
      {subtitle && <p className="text-gray-500 mt-2">{subtitle}</p>}
    </div>
  );
};

export default SectionHeader;