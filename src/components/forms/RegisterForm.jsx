import { useState } from "react";
import { Link } from "react-router-dom";

export default function RegisterForm({ onSendOtp, loading }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sendMethod, setSendMethod] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.password) newErrors.password = "Password is required";
    if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!form.agreeTerms) newErrors.agreeTerms = "You must agree to Terms of Service";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtpClick = (type) => {
    if (!validateForm()) {
      return;
    }

    if (type === "email" && !form.email) {
      setErrors({ ...errors, email: "Please enter email address" });
      return;
    }
    if (type === "phone" && !form.phone) {
      setErrors({ ...errors, phone: "Please enter phone number" });
      return;
    }

    setSendMethod(type);
    onSendOtp(form, type);
  };

  return (
    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-[#52233c]">Create Account</h1>
        <p className="text-sm text-gray-600 mt-2">Join us and start shopping</p>
      </div>

      {/* Names */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] font-medium text-[#52233c] mb-1">
            First Name *
          </label>
          <input
            name="firstName"
            placeholder="John"
            value={form.firstName}
            onChange={handleChange}
            className={`w-full h-[42px] px-3 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#8b0d3a] focus:border-transparent`}
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[#52233c] mb-1">
            Last Name *
          </label>
          <input
            name="lastName"
            placeholder="Doe"
            value={form.lastName}
            onChange={handleChange}
            className={`w-full h-[42px] px-3 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#8b0d3a] focus:border-transparent`}
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-[13px] font-medium text-[#52233c] mb-1">
          Password *
        </label>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 6 characters"
            value={form.password}
            onChange={handleChange}
            className={`w-full h-[42px] px-3 pr-10 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#8b0d3a] focus:border-transparent`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[12px] text-gray-400 hover:text-gray-600"
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-[13px] font-medium text-[#52233c] mb-1">
          Confirm Password *
        </label>
        <div className="relative">
          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Repeat your password"
            value={form.confirmPassword}
            onChange={handleChange}
            className={`w-full h-[42px] px-3 pr-10 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#8b0d3a] focus:border-transparent`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-[12px] text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? "🙈" : "👁"}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-[13px] font-medium text-[#52233c] mb-1">
          Email Address
        </label>
        <div className="flex gap-2">
          <input
            name="email"
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={handleChange}
            className={`flex-1 h-[42px] px-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#8b0d3a] focus:border-transparent`}
          />
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSendOtpClick("email")}
            className="px-4 bg-[#8b0d3a] hover:bg-[#6b0a2d] text-white rounded-lg font-medium transition disabled:opacity-50 whitespace-nowrap"
          >
            {loading && sendMethod === "email" ? "Sending..." : "Send OTP"}
          </button>
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-[13px] font-medium text-[#52233c] mb-1">
          Phone Number
        </label>
        <div className="flex gap-2">
          <input
            name="phone"
            placeholder="+1234567890"
            value={form.phone}
            onChange={handleChange}
            className={`flex-1 h-[42px] px-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#8b0d3a] focus:border-transparent`}
          />
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSendOtpClick("phone")}
            className="px-4 bg-[#8b0d3a] hover:bg-[#6b0a2d] text-white rounded-lg font-medium transition disabled:opacity-50 whitespace-nowrap"
          >
            {loading && sendMethod === "phone" ? "Sending..." : "Send OTP"}
          </button>
        </div>
        <p className="text-[11px] text-gray-500 mt-1">
          You'll receive OTP on either email or phone
        </p>
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>

      {/* Terms */}
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          name="agreeTerms"
          checked={form.agreeTerms}
          onChange={handleChange}
          className="mt-[2px] w-4 h-4 text-[#8b0d3a] rounded border-gray-300 focus:ring-[#8b0d3a]"
        />
        <label className="text-[13px] text-gray-600 leading-snug">
          I agree to the{" "}
          <a href="/terms" className="text-[#8b0d3a] font-medium hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-[#8b0d3a] font-medium hover:underline">
            Privacy Policy
          </a>
        </label>
      </div>
      {errors.agreeTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeTerms}</p>}

      {/* Login Link */}
      <div className="text-center pt-4">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-[#8b0d3a] font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}