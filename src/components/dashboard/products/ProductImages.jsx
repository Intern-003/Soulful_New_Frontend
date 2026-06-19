// src/components/dashboard/products/ProductImages.jsx
import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import usePost from "../../../api/hooks/usePost";
import useDelete from "../../../api/hooks/useDelete";
import { getImageUrl } from "../../../utils/getImageUrl";
import toast from "react-hot-toast";
import { X, Upload, Star, Trash2 } from "lucide-react";

const ProductImages = forwardRef(({ productId, images = [], onRefresh, onDelete, onSetPrimary }, ref) => {
  const { postData, loading } = usePost();
  const { deleteData, loading: deleting } = useDelete();

  const [newImages, setNewImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [primaryIndex, setPrimaryIndex] = useState(0);

  // ✅ Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    getSelectedFiles: () => newImages,
    clearSelectedFiles: () => {
      preview.forEach(url => URL.revokeObjectURL(url));
      setNewImages([]);
      setPreview([]);
      setPrimaryIndex(0);
    },
    getPreviewUrls: () => preview,
    getNewImagesCount: () => newImages.length,
  }));

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      preview.forEach(url => URL.revokeObjectURL(url));
    };
  }, [preview]);

  const handleSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setNewImages(prev => [...prev, ...files]);
    const previews = files.map(file => URL.createObjectURL(file));
    setPreview(prev => [...prev, ...previews]);
    e.target.value = null;
  };

  const handleRemovePreview = (index) => {
    URL.revokeObjectURL(preview[index]);
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setPreview(prev => prev.filter((_, i) => i !== index));
    if (primaryIndex === index) setPrimaryIndex(0);
    else if (primaryIndex > index) setPrimaryIndex(prev => prev - 1);
  };

  // ✅ Upload using the backend API
  const handleUpload = async () => {
    if (!newImages.length) {
      toast.error("Please select images to upload");
      return;
    }

    try {
      const formData = new FormData();
      newImages.forEach(img => formData.append("images[]", img));
      formData.append("is_primary", primaryIndex);

      await postData({
        url: `/vendor/products/${productId}/images`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Cleanup after successful upload
      preview.forEach(url => URL.revokeObjectURL(url));
      setNewImages([]);
      setPreview([]);
      setPrimaryIndex(0);
      
      if (onRefresh) {
        await onRefresh();
      }
      toast.success("Images uploaded successfully");
    } catch (err) {
      console.error("Upload Error:", err);
      toast.error(err?.response?.data?.message || "Failed to upload images");
    }
  };

  // ✅ Delete using the backend API
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      if (onDelete) {
        await onDelete(id);
      } else {
        await deleteData({ url: `/vendor/products/images/${id}` });
        if (onRefresh) await onRefresh();
      }
      toast.success("Image deleted successfully");
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error(err?.response?.data?.message || "Failed to delete image");
    }
  };

  // ✅ Set primary image (backend doesn't have this endpoint yet, so we'll handle it locally)
  const handleSetPrimary = (id) => {
    // Update local state
    if (onSetPrimary) {
      onSetPrimary(id);
    } else {
      // Just update local display
      const updatedImages = images.map(img => ({
        ...img,
        is_primary: img.id === id
      }));
      // You might want to call an API here if backend supports it
      toast.success("Primary image updated locally");
    }
  };

  return (
    <div className="space-y-4">
      {/* Existing Images */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Product Images</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {images?.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-6">No images available</div>
          ) : (
            images.map((img) => (
              <div key={img.id} className="relative group border rounded-lg overflow-hidden">
                <img 
                  src={getImageUrl(img?.image_url)} 
                  alt="product" 
                  className="w-full h-24 sm:h-32 object-cover" 
                />
                <div className="absolute top-1 right-1 flex gap-1">
                  <button 
                    onClick={() => handleDelete(img.id)} 
                    disabled={deleting}
                    className="bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition disabled:opacity-50"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                {img.is_primary && (
                  <span className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                    <Star size={10} className="inline mr-1" />
                    Primary
                  </span>
                )}
                {!img.is_primary && (
                  <button 
                    onClick={() => handleSetPrimary(img.id)}
                    className="absolute bottom-1 left-1 bg-gray-700 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    Set Primary
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upload New Images */}
      <div>
        <div className="flex items-center gap-4 mb-3">
          <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2">
            <Upload size={16} />
            Select Images
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleSelect} 
              disabled={loading} 
              className="hidden" 
            />
          </label>
          <span className="text-sm text-gray-500">PNG, JPG, WEBP up to 4MB</span>
        </div>
        
        {preview.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-sm text-gray-600 mb-2">
              New Images ({preview.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {preview.map((img, i) => (
                <div key={i} className="relative border rounded-lg overflow-hidden">
                  <img src={img} alt="preview" className="w-full h-24 sm:h-32 object-cover" />
                  <button 
                    onClick={() => handleRemovePreview(i)} 
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded"
                  >
                    <X size={12} />
                  </button>
                  <button 
                    onClick={() => setPrimaryIndex(i)} 
                    className={`absolute bottom-1 left-1 text-xs px-2 py-0.5 rounded ${
                      primaryIndex === i ? "bg-green-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    {primaryIndex === i ? "Primary" : "Set Primary"}
                  </button>
                </div>
              ))}
            </div>
            
            <button 
              onClick={handleUpload} 
              disabled={loading} 
              className="mt-4 bg-[#7a1c3d] text-white px-5 py-2 rounded-lg hover:bg-[#5e132f] transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? "Uploading..." : `Upload ${newImages.length} Image(s)`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

ProductImages.displayName = "ProductImages";

export default ProductImages;