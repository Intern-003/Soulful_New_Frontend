import React from "react";

const Button = ({
  text = "Click",
  onClick,
  type = "button",
  variant = "primary", // primary | secondary | outline | danger
  size = "md", // sm | md | lg
  fullWidth = false,
  loading = false,
  disabled = false,
  className = "",
}) => {
  // 🎨 Variants
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    outline: "border border-gray-400 text-gray-700 hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  // 📏 Sizes
  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        rounded-lg font-medium transition duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading ? "Loading..." : text}
    </button>
  );
};

export default Button;