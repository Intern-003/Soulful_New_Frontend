// src/components/dashboard/products/ProductImages.jsx

import React, { useState, useEffect } from "react";
import usePost from "../../../api/hooks/usePost";
import useDelete from "../../../api/hooks/useDelete";
import { getImageUrl } from "../../../utils/getImageUrl";

const ProductImages = ({ productId, images = [], onRefresh }) => {
  const { postData, loading } = usePost();
  const { deleteData, loading: deleting } = useDelete();

  const [newImages, setNewImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [primaryIndex, setPrimaryIndex] = useState(0);

  // ✅ ADD IMAGES ONE BY ONE (NOT REPLACE)
  const handleSelect = (e) => {
    const files = Array.from(e.target.files || []);

    const updatedImages = [...newImages, ...files];
    setNewImages(updatedImages);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreview((prev) => [...prev, ...previews]);

    e.target.value = null; // allow re-select same file
  };

  // ✅ REMOVE SELECTED IMAGE BEFORE UPLOAD
  const handleRemovePreview = (index) => {
    const updatedImages = [...newImages];
    const updatedPreview = [...preview];

    URL.revokeObjectURL(updatedPreview[index]);

    updatedImages.splice(index, 1);
    updatedPreview.splice(index, 1);

    setNewImages(updatedImages);
    setPreview(updatedPreview);

    if (primaryIndex === index) setPrimaryIndex(0);
  };

  // ✅ CLEANUP MEMORY
  useEffect(() => {
    return () => {
      preview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // ✅ UPLOAD IMAGES
  const handleUpload = async () => {
    if (!newImages.length) return;

    try {
      const formData = new FormData();

      newImages.forEach((img) => {
        formData.append("images[]", img);
      });

      formData.append("is_primary", primaryIndex);

      await postData({
        url: `/vendor/products/${productId}/images`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setNewImages([]);
      setPreview([]);
      setPrimaryIndex(0);

      onRefresh();
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Failed to upload images");
    }
  };

  // ✅ DELETE IMAGE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      await deleteData({
        url: `/vendor/products/images/${id}`,
      });

      onRefresh();
    } catch (err) {
      console.error("Delete Image Error:", err);
      alert("Failed to delete image");
    }
  };

  return (
    <div className="mt-6">

      <h3 className="text-lg font-semibold mb-3">
        Product Images
      </h3>

      {/* 🔹 EXISTING IMAGES */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">

        {images?.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-6">
            No images available
          </div>
        ) : (
          images.map((img) => (
            <div key={img.id} className="relative group">

              <img
                src={getImageUrl(img?.image_url)}
                alt="product"
                className="w-full h-24 object-cover rounded"
              />

              {/* DELETE */}
              <button
                onClick={() => handleDelete(img.id)}
                disabled={deleting}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>

              {/* PRIMARY */}
              {img.is_primary && (
                <span className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-2 py-1 rounded">
                  Primary
                </span>
              )}

            </div>
          ))
        )}

      </div>

      {/* 🔹 UPLOAD SECTION */}
      <div className="mt-6">

        <input
          type="file"
          accept="image/*"
          onChange={handleSelect}
          disabled={loading}
          className="mb-3"
        />

        {/* 🔹 PREVIEW */}
        {preview.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">

            {preview.map((img, i) => (
              <div key={i} className="relative border rounded p-1">

                <img
                  src={img}
                  alt="preview"
                  className="h-24 w-full object-cover rounded"
                />

                {/* REMOVE */}
                <button
                  onClick={() => handleRemovePreview(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
                >
                  ✕
                </button>

                {/* SET PRIMARY */}
                <button
                  onClick={() => setPrimaryIndex(i)}
                  className={`absolute bottom-1 left-1 text-xs px-2 py-1 rounded ${
                    primaryIndex === i
                      ? "bg-green-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {primaryIndex === i ? "Primary" : "Set Primary"}
                </button>

              </div>
            ))}

          </div>
        )}

        {/* 🔹 UPLOAD BUTTON */}
        {newImages.length > 0 && (
          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-4 bg-[#7a1c3d] text-white px-5 py-2 rounded hover:opacity-90"
          >
            {loading ? "Uploading..." : "Upload Images"}
          </button>
        )}

      </div>

    </div>
  );
};

export default ProductImages;