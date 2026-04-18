import { useState } from "react";
import usePost from "../../api/hooks/usePost";

const BecomeVendor = () => {
  const { postData, loading } = usePost();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    store_name: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ✅ handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const res = await postData({
        url: "/vendor/register",
        data: form,
      });

      setMessage(res.message || "Vendor registered successfully");

      // reset form
      setForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone: "",
        store_name: "",
        description: "",
      });
    } catch (err) {
      console.error(err);
      setError(err?.message || "Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Become a Vendor</h2>

      {/* ✅ SUCCESS */}
      {message && <p style={styles.success}>{message}</p>}

      {/* ❌ ERROR */}
      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          name="password_confirmation"
          type="password"
          placeholder="Confirm Password"
          value={form.password_confirmation}
          onChange={handleChange}
          required
        />

        <input
          name="store_name"
          placeholder="Store Name"
          value={form.store_name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Store Description"
          value={form.description}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Register as Vendor"}
        </button>
      </form>
    </div>
  );
};

// 🎨 BASIC STYLES
const styles = {
  container: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  success: {
    color: "green",
  },
  error: {
    color: "red",
  },
};

export default BecomeVendor;