import { useState } from "react";

export default function RegisterForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation:"",
    mobile: "", // Added mobile field
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form
  onSubmit={(e) => {
    e.preventDefault();
    onSubmit(form);
  }}
  className="space-y-4"
>
  <input
    name="name"
    placeholder="Name"
    value={form.name}
    onChange={handleChange}
    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
    required
  />

  <input
    name="email"
    type="email"
    placeholder="Email"
    value={form.email}
    onChange={handleChange}
    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
    required
  />

  <input
    name="mobile"
    type="tel"
    placeholder="Mobile Number"
    value={form.mobile}
    onChange={handleChange}
    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
    required
  />

  <input
    name="password"
    type="password"
    placeholder="Password"
    value={form.password}
    onChange={handleChange}
    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
    required
  />

  <input
    name="password_confirmation"
    type="password"
    placeholder="Confirm Password"
    value={form.password_confirmation}
    onChange={handleChange}
    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
    required
  />

  <button
    type="submit"
    disabled={loading}
    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition duration-200"
  >
    {loading ? "Registering..." : "Register"}
  </button>
</form>
  );
}