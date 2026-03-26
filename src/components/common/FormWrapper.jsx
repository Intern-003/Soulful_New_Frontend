import React from "react";

const FormWrapper = ({
  title,
  subtitle,
  children,
  onSubmit,
  className = "",
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div
        className={`w-full max-w-md bg-white shadow-lg rounded-2xl p-6 ${className}`}
      >
        {/* Header */}
        {title && (
          <h2 className="text-2xl font-bold text-center mb-2">
            {title}
          </h2>
        )}

        {subtitle && (
          <p className="text-gray-500 text-center mb-6">
            {subtitle}
          </p>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {children}
        </form>
      </div>
    </div>
  );
};

export default FormWrapper;