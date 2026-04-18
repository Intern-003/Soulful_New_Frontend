import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useGet from "../../../api/hooks/useGet";
import usePut from "../../../api/hooks/usePut";

export default function PersonalInfo() {
  const { data, loading, error } = useGet("/profile");
  const { putData, loading: updating } = usePut("/profile/update");

  // ✅ FIX: form state (missing tha)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    avatar: null,
  });

  const [preview, setPreview] = useState("https://i.pravatar.cc/150");
  const [editing, setEditing] = useState(false);

  // ✅ API DATA SET
  useEffect(() => {
    if (data?.user) {
      const user = data.user;

      const nameParts = user.name ? user.name.split(" ") : [];

      setForm({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
        dob: user.profile?.dob || "",
        gender: user.profile?.gender || "",
        avatar: null,
      });

      setPreview(user.profile?.avatar || "https://i.pravatar.cc/150");
    }
  }, [data]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({ ...form, avatar: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      // 👇 merge name
      formData.append("name", `${form.firstName} ${form.lastName}`);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("dob", form.dob);
      formData.append("gender", form.gender);

      if (form.avatar) {
        formData.append("avatar", form.avatar);
      }

      await putData(formData);

      alert("Profile updated successfully ✅");

      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile ❌");
    }
  };

  // ✅ LOADING
  if (loading) {
    return <p className="text-sm text-gray-500">Loading profile...</p>;
  }

  // ❌ ERROR
  if (error) {
    return <p className="text-red-500">Failed to load profile</p>;
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* 🔥 Background Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#7A1C3D]/10 blur-3xl rounded-full -z-10"></div>

      {/* 💎 Card */}
      <div className="bg-white/80 backdrop-blur-xl border border-[#ead9e0] rounded-2xl p-6 md:p-8 shadow-sm">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-[#2d0f1f]">
              Personal Info
            </h2>
            <p className="text-sm text-gray-500">
              Manage your personal details
            </p>
          </div>

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-5 py-2 rounded-lg border border-[#e7d3dc] text-sm hover:bg-[#f9f3f6] transition"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={updating}
              className="bg-[#7A1C3D] text-white px-5 py-2 rounded-lg text-sm shadow-md hover:shadow-lg transition disabled:opacity-50"
            >
              {updating ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>

        {/* PROFILE */}
        <div className="flex items-center gap-6 mb-10">
          <div className="relative">
            <img
              src={preview}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover border"
            />

            {editing && (
              <label className="absolute bottom-0 right-0 bg-[#7A1C3D] text-white p-2 rounded-full cursor-pointer text-xs">
                ✎
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div>
            <h3 className="text-base font-medium text-[#2d0f1f]">
              {form.firstName} {form.lastName}
            </h3>
            <p className="text-sm text-gray-500">{form.email}</p>
          </div>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { label: "First Name", name: "firstName", type: "text" },
            { label: "Last Name", name: "lastName", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone", name: "phone", type: "text" },
            { label: "Date of Birth", name: "dob", type: "date" },
          ].map((field, i) => (
            <motion.div key={i}>
              <label className="text-xs text-gray-500 block mb-1">
                {field.label}
              </label>

              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                disabled={!editing}
                className={`w-full px-3 py-2.5 text-sm rounded-lg border
                  ${
                    editing
                      ? "border-[#e7d3dc] focus:ring-1 focus:ring-[#7A1C3D]/30"
                      : "bg-[#f8f5f7] border-transparent text-gray-500"
                  }
                `}
              />
            </motion.div>
          ))}

          {/* GENDER */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Gender</label>

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full px-3 py-2.5 text-sm rounded-lg border
                ${
                  editing
                    ? "border-[#e7d3dc] focus:ring-1 focus:ring-[#7A1C3D]/30"
                    : "bg-[#f8f5f7] border-transparent text-gray-500"
                }
              `}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
