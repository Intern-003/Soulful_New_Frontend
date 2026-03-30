// components/forms/LoginForm.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      email: form.email,
      password: form.password,
      remember_me: form.rememberMe,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Email Field with Forgot Password Link */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-pink-800"
          >
            Email
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-pink-500 hover:text-pink-700 hover:underline transition"
          >
            Forgot password?
          </Link>
        </div>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-pink-200 rounded-lg focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-200 text-gray-900 placeholder-pink-300 text-sm sm:text-base"
          required
        />
      </div>

      {/* Password Field */}
      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-pink-800 mb-1.5"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-pink-200 rounded-lg focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-200 text-gray-900 placeholder-pink-300 text-sm sm:text-base"
          required
        />
      </div>

      {/* Remember Me Checkbox */}
      <div className="mb-6">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            name="rememberMe"
            checked={form.rememberMe}
            onChange={handleChange}
            className="w-4 h-4 text-pink-600 border-pink-300 rounded focus:ring-pink-400 focus:ring-2 cursor-pointer"
          />
          <span className="text-sm text-pink-700 group-hover:text-pink-900 transition">
            Remember for 30 days
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-pink-700 hover:bg-pink-800 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
        style={{ backgroundColor: '#8b0d3a' }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#6f0a2e'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#8b0d3a'}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </span>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
}