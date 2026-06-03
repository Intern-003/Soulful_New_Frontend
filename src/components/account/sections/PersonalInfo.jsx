import { useState, useEffect } from "react";
import useGet from "../../../api/hooks/useGet";
import usePut from "../../../api/hooks/usePut";
import usePost from "../../../api/hooks/usePost";
import { getImageUrl } from "../../../utils/getImageUrl";

export default function PersonalInfo() {
  const { data, loading, error, refetch } = useGet("/profile");
  const { putData, loading: updating } = usePut("/profile/update");
  const { postData } = usePost();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
  });

  const [preview, setPreview] = useState("/placeholder.jpg");
  const [editing, setEditing] = useState(false);

  // ----------------------------
  // LOAD PROFILE
  // ----------------------------
  useEffect(() => {
    if (!data?.user) return;

    const user = data.user;
    const nameParts = user.name ? user.name.split(" ") : [];

    setForm({
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      email: user.email || "",
      phone: user.phone || "",
      dob: user.profile?.date_of_birth
        ? user.profile.date_of_birth.slice(0, 10)
        : "",
      gender: user.profile?.gender || "",
    });

   
    setPreview(
  user.profile?.avatar_url ||
  getImageUrl(user.profile?.avatar)
);
  }, [data]);

  // ----------------------------
  // FORM CHANGE
  // ----------------------------
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImage = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const tempPreview = URL.createObjectURL(file);
  setPreview(tempPreview);

  try {
    const fd = new FormData();
    fd.append("avatar", file);

    const res = await postData({
      url: "/profile/avatar",
      data: fd,
    });

    // IMPORTANT: trust backend response first
    if (res?.avatar_url) {
      
      setPreview(getImageUrl(res.avatar_url));
    }

    // refresh profile after slight delay
    setTimeout(() => {
      refetch?.();
    }, 300);

  } catch (err) {
    console.error("Avatar Upload Error:", err);

    // rollback to old image
    setPreview("/placeholder.jpg");
  }
};

  // ----------------------------
  // PROFILE UPDATE
  // ----------------------------
  const handleSave = async () => {
    try {
      await putData({
        url: "/profile/update",
        data: {
          name: `${form.firstName} ${form.lastName}`.trim(),
          phone: form.phone || null,
          gender: form.gender || null,
          date_of_birth: form.dob || null,
        },
      });

      await refetch?.({force:true});
      setEditing(false);
    } catch (err) {
      console.error("Profile Update Error:", err);
    }
  };

  // ----------------------------
  // LOADING / ERROR
  // ----------------------------
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 animate-pulse">
        <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>
        <div className="h-24 w-24 bg-gray-200 rounded-full mb-6"></div>
        <div className="grid grid-cols-2 gap-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
        </div>
      </div>
    );
  }

  if (error)
    return (
      <p className="text-red-500 text-sm">Failed to load profile</p>
    );

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div className="relative max-w-5xl mx-auto px-3 sm:px-6">
      {/* glow */}
      <div className="absolute top-0 right-0 w-60 sm:w-72 h-60 sm:h-72 bg-[#7A1C3D]/10 blur-3xl rounded-full -z-10"></div>

      <div className="bg-white/80 backdrop-blur-xl border border-[#ead9e0] rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#2d0f1f]">
              Personal Info
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Manage your personal details
            </p>
          </div>

          <button
            onClick={() => (editing ? handleSave() : setEditing(true))}
            disabled={updating}
            className={`w-full sm:w-auto px-5 py-2 rounded-lg text-sm transition
              ${
                editing
                  ? "bg-[#7A1C3D] text-white"
                  : "border border-[#e7d3dc] hover:bg-[#f9f3f6]"
              }`}
          >
            {editing ? (updating ? "Saving..." : "Save Changes") : "Edit Profile"}
          </button>
        </div>

        {/* PROFILE */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">

          <div className="relative">
            <img
              src={preview}
              alt="avatar"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border"
              onError={(e) => (e.target.src = "/placeholder.jpg")}
            />

            {editing && (
              <label className="absolute bottom-0 right-0 bg-[#7A1C3D] text-white p-1.5 rounded-full cursor-pointer text-xs">
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

          <div className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-medium text-[#2d0f1f]">
              {form.firstName} {form.lastName}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 break-all">
              {form.email}
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

          {[
            { label: "First Name", name: "firstName", type: "text" },
            { label: "Last Name", name: "lastName", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone", name: "phone", type: "text" },
            { label: "Date of Birth", name: "dob", type: "date" },
          ].map((field, i) => (
            <div key={i}>
              <label className="text-xs text-gray-500 block mb-1">
                {field.label}
              </label>

              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                disabled={field.name === "email" || !editing}
                className={`w-full px-3 py-2.5 text-sm rounded-lg border
                  ${
                    editing
                      ? "border-[#e7d3dc] focus:ring-1 focus:ring-[#7A1C3D]/30"
                      : "bg-[#f8f5f7] text-gray-500 cursor-not-allowed"
                  }`}
              />
            </div>
          ))}

          {/* GENDER */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">
              Gender
            </label>

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full px-3 py-2.5 text-sm rounded-lg border
                ${
                  editing
                    ? "border-[#e7d3dc] focus:ring-1 focus:ring-[#7A1C3D]/30"
                    : "bg-[#f8f5f7] text-gray-500 cursor-not-allowed"
                }`}
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