import { useState } from "react";

export default function RegisterForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    subscribeNewsletter: false,
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.agreeTerms) return;

    onSubmit({
      name: `${form.firstName} ${form.lastName}`,
      email: form.email,
      password: form.password,
      password_confirmation: form.confirmPassword,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">

      {/* Names */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-[13px] font-medium text-[#52233c] mb-1">
            First Name
          </label>
          <input
            name="firstName"
            placeholder="John"
            value={form.firstName}
            onChange={handleChange}
            className="w-full h-[38px] px-3 border border-gray-300 rounded-md text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#8b0d3a] focus:border-[#8b0d3a]"
            required
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[#52233c] mb-1">
            Last Name
          </label>
          <input
            name="lastName"
            placeholder="Doe"
            value={form.lastName}
            onChange={handleChange}
            className="w-full h-[38px] px-3 border border-gray-300 rounded-md text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#8b0d3a] focus:border-[#8b0d3a]"
            required
          />
        </div>
      </div>

      {/* Email */}
      <div className="mb-5">
        <label className="block text-[13px] font-medium text-[#52233c] mb-1">
          Email Address
        </label>
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          className="w-full h-[38px] px-3 border border-gray-300 rounded-md text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#8b0d3a] focus:border-[#8b0d3a]"
          required
        />
      </div>

      {/* Password */}
      <div className="mb-4">
        <label className="block text-[13px] font-medium text-[#52233c] mb-1">
          Password
        </label>

        <div className="relative">
          <input
            name="password"
            type="password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={handleChange}
            className="w-full h-[38px] px-3 pr-9 border border-gray-300 rounded-md text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#8b0d3a] focus:border-[#8b0d3a]"
            required
          />
          <span className="absolute right-3 top-[9px] text-gray-400 text-sm">
            👁
          </span>
        </div>

        <p className="mt-1 text-[11px] text-gray-500 leading-snug">
          Must be at least 8 characters long and include uppercase, lowercase,
          number, and special character
        </p>
      </div>

      {/* Confirm Password */}
      <div className="mb-5">
        <label className="block text-[13px] font-medium text-[#52233c] mb-1">
          Confirm Password
        </label>

        <div className="relative">
          <input
            name="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full h-[38px] px-3 pr-9 border border-gray-300 rounded-md text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#8b0d3a] focus:border-[#8b0d3a]"
            required
          />
          <span className="absolute right-3 top-[9px] text-gray-400 text-sm">
            👁
          </span>
        </div>
      </div>

      {/* Newsletter */}
      {/* <div className="flex items-start gap-2 mb-4">
        <input
          type="checkbox"
          name="subscribeNewsletter"
          checked={form.subscribeNewsletter}
          onChange={handleChange}
          className="mt-[2px] w-4 h-4 border-gray-300 rounded"
        />
        <span className="text-[13px] text-gray-600 leading-snug">
          Subscribe to our newsletter for exclusive offers and updates
        </span>
      </div> */}

      {/* Terms */}
      <div className="flex items-start gap-2 mb-6">
        <input
          type="checkbox"
          name="agreeTerms"
          checked={form.agreeTerms}
          onChange={handleChange}
          className="mt-[2px] w-4 h-4 border-gray-300 rounded"
          required
        />
        <span className="text-[13px] text-gray-600 leading-snug">
          I agree to the{" "}
          <a href="/terms" className="text-[#8b0d3a] font-medium hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-[#8b0d3a] font-medium hover:underline">
            Privacy Policy
          </a>
        </span>
      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-[40px] bg-[#8b0d3a] hover:bg-[#6f0a2e] text-white text-[14px] font-medium rounded-md transition"
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}