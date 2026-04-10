import { useState } from "react";

export default function PersonalInfo() {
  const [form, setForm] = useState({
    firstName: "Sarah",
    lastName: "Anderson",
    email: "sarah@example.com",
    phone: "+91 9876543210",
    dob: "1998-05-12",
    gender: "female",
    avatar: null,
  });

  const [preview, setPreview] = useState("https://i.pravatar.cc/150?img=32");

  const [editing, setEditing] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({ ...form, avatar: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    console.log("Saving:", form);
    setEditing(false);
    alert("Profile updated ✅");
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Personal Info</h2>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="border px-4 py-2 rounded-lg text-sm"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="bg-[#7a1c3d] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#5a142c]"
          >
            Save Changes
          </button>
        )}
      </div>

      {/* PROFILE IMAGE */}
      <div className="flex items-center gap-5 mb-8">
        <img
          src={preview}
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover border"
        />

        {editing && (
          <label className="cursor-pointer text-sm text-[#7a1c3d] hover:underline">
            Change photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* FORM */}
      <div className="grid grid-cols-2 gap-6">
        {/* FIRST NAME */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">First Name</label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            disabled={!editing}
            className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#7a1c3d]/20"
          />
        </div>

        {/* LAST NAME */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">Last Name</label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            disabled={!editing}
            className="w-full border px-4 py-3 rounded-xl"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={!editing}
            className="w-full border px-4 py-3 rounded-xl"
          />
        </div>

        {/* PHONE */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            disabled={!editing}
            className="w-full border px-4 py-3 rounded-xl"
          />
        </div>

        {/* DOB */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            disabled={!editing}
            className="w-full border px-4 py-3 rounded-xl"
          />
        </div>

        {/* GENDER */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            disabled={!editing}
            className="w-full border px-4 py-3 rounded-xl"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
}
