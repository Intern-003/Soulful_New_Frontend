// src/components/common/SectionHeader.jsx
import React from 'react';

const SectionHeader = ({ title, subtitle, align = 'center' }) => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right'
  };

  return (
    <div className={`mb-8 xs:mb-10 sm:mb-12 md:mb-16 ${alignClass[align]} max-w-3xl ${align === 'center' ? 'mx-auto' : ''}`}>
      <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-[#7a1c3d] tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-500 mt-2 xs:mt-3 text-xs xs:text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      {/* Decorative line */}
      <div className={`w-12 xs:w-16 h-0.5 bg-[#7a1c3d]/30 mt-3 xs:mt-4 ${align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : ''}`}></div>
    </div>
  );
};

export default SectionHeader;