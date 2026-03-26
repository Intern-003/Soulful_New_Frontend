import { useState } from "react";

export default function LoginForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
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
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="w-full p-2 border"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        className="w-full p-2 border"
      />

      <button className="bg-blue-500 text-white px-4 py-2">
        {loading ? "Loading..." : "Login"}
      </button>
    </form>
  );
}