import React, { useState, useEffect } from "react";

const StoreProfileForm = ({
  profile,
  onSubmit,
  loading,
}) => {
  const [form, setForm] =
    useState({
      store_name: "",
      description: "",
      store_about: "",
      theme_color: "#7a1c3d",
    });

  useEffect(() => {
    if (!profile) return;

    setForm({
      store_name:
        profile.store_name || "",
      description:
        profile.description || "",
      store_about:
        profile.store_about || "",
      theme_color:
        profile.theme_color ||
        "#7a1c3d",
    });
  }, [profile]);

  const handleChange = (
    e
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = (
    e
  ) => {
    e.preventDefault();

    const formData =
      new FormData();

    Object.entries(
      form
    ).forEach(
      ([key, value]) => {
        formData.append(
          key,
          value
        );
      }
    );

    onSubmit(formData);
  };

  return (
    <div
      className="
        bg-white
        rounded-3xl
        border
        border-slate-200
        shadow-sm
      "
    >
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">
          Store Information
        </h2>
      </div>

      <form
        onSubmit={
          handleSubmit
        }
        className="p-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium mb-2">
            Store Name
          </label>

          <input
            type="text"
            name="store_name"
            value={
              form.store_name
            }
            onChange={
              handleChange
            }
            className="
              w-full
              h-11
              px-4
              border
              rounded-xl
            "
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Description
          </label>

          <textarea
            rows="4"
            name="description"
            value={
              form.description
            }
            onChange={
              handleChange
            }
            className="
              w-full
              p-4
              border
              rounded-xl
            "
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            About Store
          </label>

          <textarea
            rows="6"
            name="store_about"
            value={
              form.store_about
            }
            onChange={
              handleChange
            }
            className="
              w-full
              p-4
              border
              rounded-xl
            "
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Theme Color
          </label>

          <input
            type="color"
            name="theme_color"
            value={
              form.theme_color
            }
            onChange={
              handleChange
            }
            className="
              w-20
              h-12
              border
              rounded-lg
            "
          />
        </div>

        <button
          disabled={loading}
          className="
            px-6
            py-3
            bg-[#7a1c3d]
            text-white
            rounded-xl
            font-medium
          "
        >
          {loading
            ? "Saving..."
            : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default StoreProfileForm;