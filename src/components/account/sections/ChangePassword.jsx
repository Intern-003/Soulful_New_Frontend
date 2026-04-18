import { useState } from "react";
import { motion } from "framer-motion";
import usePost from "../../../api/hooks/usePost";

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // ✅ CORRECT API HOOK (POST)
  const { postData, loading } = usePost("/profile/change-password");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleToggle = (field) => {
    setShow({ ...show, [field]: !show[field] });
  };

  const handleSubmit = async () => {
    // ✅ VALIDATIONS
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      alert("All fields are required ❌");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    if (form.currentPassword === form.newPassword) {
      alert("New password must be different ❌");
      return;
    }

    try {
      const payload = {
        current_password: form.currentPassword,
        new_password: form.newPassword,
        new_password_confirmation: form.confirmPassword,
      };

      await postData(payload);

      alert("Password updated successfully ✅");

      // 🔄 RESET FORM
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to update password ❌");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* HEADER */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#2d0f1f]">
          Change Password
        </h2>
        <p className="text-xs text-gray-500">Update your password</p>
      </div>

      {/* FORM */}
      <div className="space-y-4">
        <InputField
          label="Current Password"
          name="currentPassword"
          value={form.currentPassword}
          onChange={handleChange}
          show={show.current}
          onToggle={() => handleToggle("current")}
        />

        <InputField
          label="New Password"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          show={show.new}
          onToggle={() => handleToggle("new")}
        />

        <InputField
          label="Confirm Password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          show={show.confirm}
          onToggle={() => handleToggle("confirm")}
        />

        {/* BUTTON */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#7A1C3D] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#5a142c] transition disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </motion.button>
      </div>
    </div>
  );
}

/* 🔧 INPUT COMPONENT */
function InputField({ label, name, value, onChange, show, onToggle }) {
  return (
    <div>
      <label className="text-[11px] text-gray-500 block mb-1">{label}</label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2.5 text-sm rounded-lg border border-[#e7d3dc] focus:ring-1 focus:ring-[#7A1C3D]/30 focus:border-[#7A1C3D] transition"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}
