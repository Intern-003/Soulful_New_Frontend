import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import usePut from "../../../api/hooks/usePut";

export default function ChangePassword() {
  const { putData, loading } = usePut();

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

  const [errors, setErrors] = useState({});

  // -----------------------
  // CLIENT VALIDATION
  // -----------------------
  const validate = () => {
    const err = {};

    if (!form.currentPassword) err.currentPassword = "Current password is required";
    if (!form.newPassword) err.newPassword = "New password is required";
    if (!form.confirmPassword) err.confirmPassword = "Please confirm password";

    if (
      form.newPassword &&
      form.confirmPassword &&
      form.newPassword !== form.confirmPassword
    ) {
      err.confirmPassword = "Passwords do not match";
    }

    if (
      form.currentPassword &&
      form.newPassword &&
      form.currentPassword === form.newPassword
    ) {
      err.newPassword = "New password must be different from current password";
    }

    return err;
  };

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);

    // live validation
    setErrors(validate());
  };

  const toggle = (field) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async () => {
    const clientErrors = validate();
    setErrors(clientErrors);

    if (Object.keys(clientErrors).length > 0) return;

    try {
      await putData({
        url: "/profile/change-password",
        data: {
          current_password: form.currentPassword,
          new_password: form.newPassword,
          new_password_confirmation: form.confirmPassword,
        },
      });

      alert("Password updated successfully ✅");

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setErrors({});
    } catch (err) {
      // -----------------------
      // LARAVEL ERROR MAPPING
      // -----------------------
      const apiErrors = err?.errors || err?.data?.errors;

      if (apiErrors) {
        const mapped = {};
        Object.keys(apiErrors).forEach((key) => {
          mapped[key] = apiErrors[key][0];
        });
        setErrors(mapped);
      } else {
        setErrors({
          general: "Something went wrong. Please try again.",
        });
      }
    }
  };

  // -----------------------
  // FORM VALID STATE
  // -----------------------
  const isValid =
    form.currentPassword &&
    form.newPassword &&
    form.confirmPassword &&
    Object.keys(errors).length === 0;

  return (
    <div className="w-full px-3 sm:px-0">
      <div className="max-w-md mx-auto">
        <div className="bg-white/80 backdrop-blur-xl border border-[#ead9e0] rounded-2xl p-5 sm:p-6 shadow-sm">

          {/* HEADER */}
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[#2d0f1f]">
              Change Password
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Update your password securely
            </p>
          </div>

          {/* GENERAL ERROR */}
          {errors.general && (
            <p className="text-sm text-red-500 mb-3">{errors.general}</p>
          )}

          {/* FORM */}
          <div className="space-y-4">

            {/* CURRENT */}
            <InputField
              label="Current Password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              show={show.current}
              onToggle={() => toggle("current")}
              error={errors.currentPassword}
            />

            {/* NEW */}
            <InputField
              label="New Password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              show={show.new}
              onToggle={() => toggle("new")}
              error={errors.newPassword}
            />

            {/* CONFIRM */}
            <InputField
              label="Confirm Password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              show={show.confirm}
              onToggle={() => toggle("confirm")}
              error={errors.confirmPassword}
            />

            {/* BUTTON */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={loading || !isValid}
              className="w-full bg-[#7A1C3D] text-white py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#5a142c]"
            >
              {loading ? "Updating..." : "Update Password"}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- INPUT FIELD ---------------- */
function InputField({
  label,
  name,
  value,
  onChange,
  show,
  onToggle,
  error,
}) {
  return (
    <div>
      <label className="text-xs text-gray-500 block mb-1">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-3 py-2.5 text-sm rounded-lg border transition
            ${error
              ? "border-red-400 focus:ring-red-300"
              : "border-[#e7d3dc] focus:ring-[#7A1C3D]/30"
            }
            focus:ring-1 focus:border-[#7A1C3D]
          `}
        />

        {/* EYE ICON */}
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-[#7A1C3D]"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* INLINE ERROR */}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}