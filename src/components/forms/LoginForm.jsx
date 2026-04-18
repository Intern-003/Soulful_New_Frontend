import { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    //rememberMe: false,
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
      //remember_me: form.rememberMe,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Email */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-[#3e0925] mb-1.5">
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b0d3a]/20 focus:border-[#8b0d3a] text-sm"
          required
        />
      </div>

      {/* Password */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-sm font-medium text-[#3e0925]">
            Password
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-[#9c2e67] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b0d3a]/20 focus:border-[#8b0d3a] text-sm"
          required
        />
      </div>

      {/* Remember */}
      <div className="mb-5 mt-3 flex items-center gap-2">
        {/* <input
          type="checkbox"
          name="rememberMe"
          checked={form.rememberMe}
          onChange={handleChange}
          className="w-4 h-4 border-gray-300 rounded"
        />
        <span className="text-sm text-gray-600">
          Remember for 30 days
        </span> */}
      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#8b0d3a] hover:bg-[#6f0a2e] text-white font-medium py-2.5 rounded-md transition"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}