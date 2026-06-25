import React, {
  useState,
} from "react";

import {
  Plus,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";

import useGet from "../../../api/hooks/useGet";
import usePost from "../../../api/hooks/usePost";
import useDelete from "../../../api/hooks/useDelete";

import { getImageUrl } from "../../../utils/getImageUrl";

const StoreBannerManager = () => {
  const {
    data,
    loading,
    refetch,
  } = useGet(
    "/vendor/store-banners"
  );

  const {
    postData,
    loading: createLoading,
  } = usePost();

  const {
    deleteData,
  } = useDelete();

  const banners =
    data?.data || [];

  const [title, setTitle] =
    useState("");

  const [
    buttonText,
    setButtonText,
  ] = useState("");

  const [
    buttonLink,
    setButtonLink,
  ] = useState("");

  const [image, setImage] =
    useState(null);

  const [
    imagePreview,
    setImagePreview,
  ] = useState("");

  const handleImage =
    (e) => {
      const file =
        e.target.files?.[0];

      if (!file)
        return;

      setImage(file);

      setImagePreview(
        URL.createObjectURL(
          file
        )
      );
    };

const handleCreate = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("button_text", buttonText);
    formData.append("button_link", buttonLink);

if (image) {
  formData.append("image", image);
}

    await postData({
      url: "/vendor/store-banners",
      data: formData,
    });

    setTitle("");
    setButtonText("");
    setButtonLink("");
    setImage(null);
    setImagePreview("");

    refetch({ force: true });

  } catch (error) {
    console.error(error);
  }
};

  const handleDelete =
    async (id) => {
      if (
        !window.confirm(
          "Delete banner?"
        )
      )
        return;

      await deleteData({
        url: `/vendor/store-banners/${id}`,
      });

      refetch({
        force: true,
      });
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
      {/* HEADER */}

      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">
          Store Banners
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Manage homepage banners.
        </p>
      </div>

      {/* CREATE */}

      <form
        onSubmit={
          handleCreate
        }
        className="p-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium mb-2">
            Banner Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            className="
              w-full
              h-11
              border
              rounded-xl
              px-4
            "
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Button Text
          </label>

          <input
            type="text"
            value={
              buttonText
            }
            onChange={(e) =>
              setButtonText(
                e.target.value
              )
            }
            className="
              w-full
              h-11
              border
              rounded-xl
              px-4
            "
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Button Link
          </label>

          <input
            type="text"
            value={
              buttonLink
            }
            onChange={(e) =>
              setButtonLink(
                e.target.value
              )
            }
            className="
              w-full
              h-11
              border
              rounded-xl
              px-4
            "
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Banner Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={
              handleImage
            }
          />
        </div>

        {imagePreview && (
          <div
            className="
              h-48
              rounded-2xl
              overflow-hidden
              border
            "
          >
            <img
              src={
                imagePreview
              }
              alt=""
              className="
                w-full
                h-full
                object-cover
              "
            />
          </div>
        )}

        <button
          disabled={
            createLoading
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
          "
        >
          <Plus
            size={18}
          />

          {createLoading
            ? "Creating..."
            : "Create Banner"}
        </button>
      </form>

      {/* LIST */}

      <div className="border-t p-6">

        <h3
          className="
            text-base
            font-semibold
            mb-4
          "
        >
          Existing Banners
        </h3>

        {loading ? (
          <div>
            Loading...
          </div>
        ) : banners.length ===
          0 ? (
          <div
            className="
              py-10
              text-center
              text-slate-500
            "
          >
            No banners found
          </div>
        ) : (
          <div className="space-y-5">

            {banners.map(
              (
                banner
              ) => (
                <div
                  key={
                    banner.id
                  }
                  className="
                    border
                    rounded-2xl
                    overflow-hidden
                  "
                >
                  <div className="h-44 bg-slate-50">
                    {banner.image ? (
                      <img
                        src={getImageUrl(
                          banner.image
                        )}
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
                          h-full
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <ImageIcon />
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex items-center justify-between">

                    <div>
                      <h4 className="font-semibold">
                        {
                          banner.title
                        }
                      </h4>

                      <p className="text-sm text-slate-500">
                        {
                          banner.button_text
                        }
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        handleDelete(
                          banner.id
                        )
                      }
                      className="
                        w-10
                        h-10
                        rounded-xl
                        border
                        flex
                        items-center
                        justify-center
                        text-red-600
                      "
                    >
                      <Trash2
                        size={18}
                      />
                    </button>

                  </div>
                </div>
              )
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default StoreBannerManager;