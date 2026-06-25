import React, {
  useEffect,
  useState,
} from "react";

import { Save } from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

import {
  FaXTwitter,
} from "react-icons/fa6";

const StoreSocialLinksForm = ({
  profile,
  onSubmit,
  loading,
}) => {
  const [form, setForm] =
    useState({
      facebook_url: "",
      instagram_url: "",
      twitter_url: "",
      youtube_url: "",
    });

  useEffect(() => {
    if (!profile) return;

    setForm({
      facebook_url:
        profile.facebook_url || "",

      instagram_url:
        profile.instagram_url || "",

      twitter_url:
        profile.twitter_url || "",

      youtube_url:
        profile.youtube_url || "",
    });
  }, [profile]);

  const handleChange = (
    e
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const handleSubmit = (
    e
  ) => {
    e.preventDefault();

    const formData =
      new FormData();

    Object.entries(form)
      .forEach(
        ([key, value]) => {
          formData.append(
            key,
            value || ""
          );
        }
      );

    onSubmit(formData);
  };

  const inputClass =
    `
      w-full
      h-12
      px-4
      border
      border-slate-300
      rounded-xl
      outline-none
      transition-all
      duration-200
      bg-white
      focus:border-[#7a1c3d]
      focus:ring-4
      focus:ring-[#7a1c3d]/10
    `;

  return (
    <div
      className="
        bg-white
        rounded-3xl
        border
        border-slate-200
        shadow-sm
        overflow-hidden
      "
    >
      {/* Header */}

      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">
          Social Media Links
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Connect your store with
          Facebook, Instagram,
          X and YouTube.
        </p>
      </div>

      {/* Form */}

      <form
        onSubmit={
          handleSubmit
        }
        className="p-6 space-y-5"
      >
        {/* Facebook */}

        <div>
          <label
            className="
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-slate-700
              mb-2
            "
          >
            <FaFacebookF
              className="
                text-blue-600
                text-base
              "
            />

            Facebook
          </label>

          <input
            type="url"
            name="facebook_url"
            value={
              form.facebook_url
            }
            onChange={
              handleChange
            }
            placeholder="https://facebook.com/your-page"
            className={
              inputClass
            }
          />
        </div>

        {/* Instagram */}

        <div>
          <label
            className="
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-slate-700
              mb-2
            "
          >
            <FaInstagram
              className="
                text-pink-600
                text-base
              "
            />

            Instagram
          </label>

          <input
            type="url"
            name="instagram_url"
            value={
              form.instagram_url
            }
            onChange={
              handleChange
            }
            placeholder="https://instagram.com/your-page"
            className={
              inputClass
            }
          />
        </div>

        {/* X / Twitter */}

        <div>
          <label
            className="
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-slate-700
              mb-2
            "
          >
            <FaXTwitter
              className="
                text-base
              "
            />

            X (Twitter)
          </label>

          <input
            type="url"
            name="twitter_url"
            value={
              form.twitter_url
            }
            onChange={
              handleChange
            }
            placeholder="https://x.com/your-page"
            className={
              inputClass
            }
          />
        </div>

        {/* YouTube */}

        <div>
          <label
            className="
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-slate-700
              mb-2
            "
          >
            <FaYoutube
              className="
                text-red-600
                text-lg
              "
            />

            YouTube
          </label>

          <input
            type="url"
            name="youtube_url"
            value={
              form.youtube_url
            }
            onChange={
              handleChange
            }
            placeholder="https://youtube.com/@your-channel"
            className={
              inputClass
            }
          />
        </div>

        {/* Save Button */}

        <div className="pt-2">
          <button
            type="submit"
            disabled={
              loading
            }
            className="
              inline-flex
              items-center
              gap-2
              px-6
              py-3
              rounded-xl
              bg-[#7a1c3d]
              text-white
              font-medium
              hover:bg-[#651632]
              transition-all
              duration-200
              disabled:opacity-60
              disabled:cursor-not-allowed
            "
          >
            <Save size={18} />

            {loading
              ? "Saving..."
              : "Save Social Links"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoreSocialLinksForm;