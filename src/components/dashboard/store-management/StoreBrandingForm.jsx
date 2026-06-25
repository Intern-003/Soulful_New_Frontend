import React, {
  useState,
  useEffect,
} from "react";

import {
  Upload,
  Image as ImageIcon,
} from "lucide-react";

import { getImageUrl } from "../../../utils/getImageUrl";

const StoreBrandingForm = ({
  profile,
  onSubmit,
  loading,
}) => {
  const [logoFile, setLogoFile] =
    useState(null);

  const [bannerFile, setBannerFile] =
    useState(null);

  const [logoPreview, setLogoPreview] =
    useState("");

  const [
    bannerPreview,
    setBannerPreview,
  ] = useState("");

  useEffect(() => {
    if (
      profile?.store_logo
    ) {
      setLogoPreview(
        getImageUrl(
          profile.store_logo
        )
      );
    }

    if (
      profile?.store_banner
    ) {
      setBannerPreview(
        getImageUrl(
          profile.store_banner
        )
      );
    }
  }, [profile]);

  const handleLogoChange = (
    e
  ) => {
    const file =
      e.target.files[0];

    if (!file) return;

    setLogoFile(file);

    setLogoPreview(
      URL.createObjectURL(
        file
      )
    );
  };

  const handleBannerChange =
    (e) => {
      const file =
        e.target.files[0];

      if (!file) return;

      setBannerFile(file);

      setBannerPreview(
        URL.createObjectURL(
          file
        )
      );
    };

  const handleSubmit = (
    e
  ) => {
    e.preventDefault();

    const formData =
      new FormData();

    if (logoFile) {
      formData.append(
        "store_logo",
        logoFile
      );
    }

    if (bannerFile) {
      formData.append(
        "store_banner",
        bannerFile
      );
    }

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
          Store Branding
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Upload your logo and
          store banner.
        </p>
      </div>

      <form
        onSubmit={
          handleSubmit
        }
        className="p-6 space-y-8"
      >
        {/* LOGO */}

        <div>
          <label className="block text-sm font-medium mb-3">
            Store Logo
          </label>

          <div className="flex items-center gap-5">
            <div
              className="
                w-24
                h-24
                rounded-full
                overflow-hidden
                border
                border-slate-200
                bg-slate-50
              "
            >
              {logoPreview ? (
                <img
                  src={
                    logoPreview
                  }
                  alt=""
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    w-full
                    h-full
                    flex
                    items-center
                    justify-center
                  "
                >
                  <ImageIcon
                    size={
                      30
                    }
                    className="text-slate-400"
                  />
                </div>
              )}
            </div>

            <label
              className="
                cursor-pointer
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                border
                rounded-xl
                hover:bg-slate-50
              "
            >
              <Upload
                size={18}
              />

              Upload Logo

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleLogoChange
                }
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* BANNER */}

        <div>
          <label className="block text-sm font-medium mb-3">
            Store Banner
          </label>

          <div
            className="
              h-52
              rounded-2xl
              overflow-hidden
              border
              border-slate-200
              bg-slate-50
            "
          >
            {bannerPreview ? (
              <img
                src={
                  bannerPreview
                }
                alt=""
                className="
                  w-full
                  h-full
                  object-cover
                "
              />
            ) : (
              <div
                className="
                  w-full
                  h-full
                  flex
                  items-center
                  justify-center
                "
              >
                <ImageIcon
                  size={40}
                  className="text-slate-400"
                />
              </div>
            )}
          </div>

          <label
            className="
              mt-4
              cursor-pointer
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              border
              rounded-xl
              hover:bg-slate-50
            "
          >
            <Upload
              size={18}
            />

            Upload Banner

            <input
              type="file"
              accept="image/*"
              onChange={
                handleBannerChange
              }
              className="hidden"
            />
          </label>
        </div>

        <button
          disabled={loading}
          className="
            px-6
            py-3
            rounded-xl
            bg-[#7a1c3d]
            text-white
            font-medium
          "
        >
          {loading
            ? "Uploading..."
            : "Save Branding"}
        </button>
      </form>
    </div>
  );
};

export default StoreBrandingForm;