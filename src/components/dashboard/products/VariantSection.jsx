import { useState, useEffect, forwardRef, useImperativeHandle, useRef, useCallback } from "react";
import usePost from "../../../api/hooks/usePost";
import useDelete from "../../../api/hooks/useDelete";
import useGet from "../../../api/hooks/useGet";
import toast from "react-hot-toast";
import { Save, Trash2, Upload, CheckCircle, AlertCircle, Package, RefreshCw, X } from "lucide-react";

const VariantSection = forwardRef(({ productId, onVariantsLoaded }, ref) => {
  const { data, refetch } = useGet(`/vendor/products/${productId}`);
  const { postData } = usePost();
  const { deleteData } = useDelete();

  const [variants, setVariants] = useState([]);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [savedVariants, setSavedVariants] = useState(new Set());
  const hasInitialized = useRef(false);
  const fileInputRefs = useRef({});
  const blobUrlsRef = useRef({});
  const processingRef = useRef({}); // Track processing state per variant

  // Load existing variants from backend
  useEffect(() => {
    if (data?.data?.variants && !hasInitialized.current) {
      hasInitialized.current = true;
      const mapped = data.data.variants.map((v) => {
        const existingImages = v.images || [];
        const previews = existingImages.map(img => {
          const url = img.image_url || img.image;
          return url ? (url.startsWith('http') ? url : `${BASE_URL}${url}`) : null;
        }).filter(Boolean);

        return {
          id: v.id,
          sku: v.sku,
          price: v.price || '',
          stock: v.stock || '',
          weight: v.weight || '',
          barcode: v.barcode || '',
          discount_price: v.discount_price || '',
          attribute_value_ids: v.attribute_value_ids || v.attribute_values?.map(av => av.id) || [],
          newImages: [],
          existingImages: existingImages,
          previews: previews,
          isSaved: true,
          isModified: false,
        };
      });
      setVariants(mapped);
      setSavedVariants(
        new Set(mapped.map(v => v.sku?.toLowerCase()).filter(Boolean))
      );
      onVariantsLoaded?.(mapped);
    }
  }, [data]);

  useImperativeHandle(ref, () => ({
    addVariants: (newVariants) => {
      setVariants((prev) => {
        // Create a map of existing SKUs for quick lookup
        const existingSkuMap = new Map();
        prev.forEach(v => {
          existingSkuMap.set(v.sku?.toLowerCase(), v);
        });

        // Separate existing and new variants
        const updatedVariants = [...prev];
        const variantsToAdd = [];

        newVariants.forEach(newVariant => {
          const skuKey = newVariant.sku?.toLowerCase();
          const existingVariant = existingSkuMap.get(skuKey);

          if (existingVariant) {
            // Update existing variant with new values while preserving saved data
            const index = updatedVariants.findIndex(v => v.id === existingVariant.id);
            if (index !== -1) {
              updatedVariants[index] = {
                ...existingVariant,
                ...newVariant,
                id: existingVariant.id,
                isSaved: existingVariant.isSaved,
                existingImages: existingVariant.existingImages,
                previews: existingVariant.previews,
                price: existingVariant.price || newVariant.price,
                stock: existingVariant.stock || newVariant.stock,
                weight: existingVariant.weight || newVariant.weight,
                barcode: existingVariant.barcode || newVariant.barcode,
              };
            }
          } else {
            // Add new variant - ensure unique SKU
            if (!variantsToAdd.some(v => v.sku?.toLowerCase() === skuKey)) {
              variantsToAdd.push(newVariant);
            }
          }
        });

        return [...updatedVariants, ...variantsToAdd];
      });
    },
    hasVariants: () => variants.length > 0,
    getVariantsCount: () => variants.length,
    getUnsavedVariants: () => variants.filter(v => !v.isSaved && (v.price || v.stock)),
  }));

  const handleChange = (i, field, value) => {
    setVariants((prev) => {
      const updated = [...prev];
      if (updated[i]) {
        updated[i][field] = value;
        updated[i].isModified = true;
      }
      return updated;
    });
  };

  const handleImageChange = useCallback((i, event) => {
    // CRITICAL: Prevent multiple simultaneous uploads for the same variant
    if (processingRef.current[i]) {
      event.target.value = ''; // Clear the input
      return;
    }

    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Mark as processing immediately
    processingRef.current[i] = true;

    // Store files in a variable before resetting input
    const fileArray = Array.from(files);

    // CRITICAL: Clear the input IMMEDIATELY to prevent re-trigger
    if (fileInputRefs.current[`variant-${i}`]) {
      fileInputRefs.current[`variant-${i}`].value = '';
    }

    // Use requestAnimationFrame to ensure this runs after the current event loop
    requestAnimationFrame(() => {
      setVariants(prev => {
        const updated = [...prev];
        if (!updated[i]) return updated;

        // Store new images for upload (prevent duplicates within same batch)
        const existingNewImages = updated[i].newImages || [];
        const uniqueNewImages = fileArray.filter(
          file => !existingNewImages.some(existing => existing.name === file.name && existing.size === file.size)
        );
        
        updated[i].newImages = [...existingNewImages, ...uniqueNewImages];

        // Create preview URLs for new images
        const newPreviews = uniqueNewImages.map(file => {
          const blobUrl = URL.createObjectURL(file);
          if (!blobUrlsRef.current[`variant-${i}`]) {
            blobUrlsRef.current[`variant-${i}`] = [];
          }
          blobUrlsRef.current[`variant-${i}`].push(blobUrl);
          return blobUrl;
        });

        updated[i].previews = [...(updated[i].previews || []), ...newPreviews];
        updated[i].isModified = true;

        return updated;
      });

      // Release the lock after a delay
      setTimeout(() => {
        delete processingRef.current[i];
      }, 200);
    });
  }, []);

  const removeImage = useCallback((i, imageIndex) => {
    setVariants(prev => {
      const updated = [...prev];
      if (!updated[i] || !updated[i].previews[imageIndex]) return updated;

      const previewUrl = updated[i].previews[imageIndex];

      if (previewUrl && previewUrl.startsWith('blob:')) {
        // Remove new image
        URL.revokeObjectURL(previewUrl);

        if (blobUrlsRef.current[`variant-${i}`]) {
          blobUrlsRef.current[`variant-${i}`] = blobUrlsRef.current[`variant-${i}`].filter(url => url !== previewUrl);
        }

        const existingImagesCount = updated[i].existingImages?.length || 0;
        const newImageIndex = imageIndex - existingImagesCount;

        if (newImageIndex >= 0 && updated[i].newImages && updated[i].newImages[newImageIndex]) {
          updated[i].newImages = updated[i].newImages.filter((_, idx) => idx !== newImageIndex);
        }
      } else {
        // This is an existing image - mark for deletion
        if (!updated[i].imagesToDelete) {
          updated[i].imagesToDelete = [];
        }
        const imageId = updated[i].existingImages?.[imageIndex]?.id;
        if (imageId && !updated[i].imagesToDelete.includes(imageId)) {
          updated[i].imagesToDelete.push(imageId);
        }
      }

      updated[i].previews = updated[i].previews.filter((_, idx) => idx !== imageIndex);
      updated[i].isModified = true;

      return updated;
    });
  }, []);

  const handleDelete = async (i, id) => {
    if (blobUrlsRef.current[`variant-${i}`]) {
      blobUrlsRef.current[`variant-${i}`].forEach(url => {
        URL.revokeObjectURL(url);
      });
      delete blobUrlsRef.current[`variant-${i}`];
    }

    if (id) {
      setDeletingId(id);
      try {
        await deleteData({ url: `/vendor/product-variants/${id}` });
        toast.success("Variant deleted");

        const deletedSku = variants[i]?.sku?.toLowerCase();
        setVariants((prev) => prev.filter((_, index) => index !== i));
        setSavedVariants(prev => {
          const newSet = new Set(prev);
          if (deletedSku) newSet.delete(deletedSku);
          return newSet;
        });
      } catch {
        toast.error("Delete failed");
      } finally {
        setDeletingId(null);
      }
    } else {
      // Clean up blob URLs
      if (blobUrlsRef.current[`variant-${i}`]) {
        blobUrlsRef.current[`variant-${i}`].forEach(url => URL.revokeObjectURL(url));
        delete blobUrlsRef.current[`variant-${i}`];
      }
      setVariants((prev) => prev.filter((_, index) => index !== i));
      toast.success("Variant removed");
    }
  };

  const handleSaveSingle = async (variant, index) => {
    if (!variant.price && !variant.stock) {
      toast.error("Please enter price and stock for this variant");
      return;
    }

    if (!variant.attribute_value_ids || variant.attribute_value_ids.length === 0) {
      toast.error("Variant must have attribute values");
      return;
    }

    setSavingId(variant.id || index);
    try {
      const fd = new FormData();
      fd.append("sku", variant.sku);
      fd.append("price", variant.price || 0);
      fd.append("stock", variant.stock || 0);
      fd.append("weight", variant.weight || 0);
      fd.append("barcode", variant.barcode || "");

      if (variant.discount_price) {
        fd.append("discount_price", variant.discount_price || 0);
      }

      if (variant.attribute_value_ids && variant.attribute_value_ids.length) {
        variant.attribute_value_ids.forEach((id) => {
          fd.append("attribute_value_ids[]", id);
        });
      }

      if (variant.newImages && variant.newImages.length) {
        variant.newImages.forEach(img => {
          fd.append("images[]", img);
        });
      }

      if (variant.id) {
        fd.append("_method", "PUT");
        await postData({
          url: `/vendor/product-variants/${variant.id}`,
          data: fd,
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await postData({
          url: `/vendor/products/${productId}/variants`,
          data: fd,
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success("Variant saved successfully");

      if (blobUrlsRef.current[`variant-${index}`]) {
        blobUrlsRef.current[`variant-${index}`].forEach(url => {
          URL.revokeObjectURL(url);
        });
        delete blobUrlsRef.current[`variant-${index}`];
      }

      setSavedVariants(prev => new Set([...prev, variant.sku?.toLowerCase()]));

      setVariants(prev => {
        const updated = [...prev];
        if (updated[index]) {
          updated[index].isSaved = true;
          updated[index].isModified = false;
          updated[index].newImages = [];
          updated[index].imagesToDelete = [];
        }
        return updated;
      });

      await refetch();
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Save failed - duplicate SKU or invalid data");
    } finally {
      setSavingId(null);
    }
  };

  const handleSaveAll = async () => {
    const unsavedVariants = variants.filter((v) => !v.isSaved && (v.price || v.stock));

    if (unsavedVariants.length === 0) {
      toast.error("No unsaved variants to save");
      return;
    }

    const invalidVariants = unsavedVariants.filter(v => !v.attribute_value_ids || v.attribute_value_ids.length === 0);
    if (invalidVariants.length > 0) {
      toast.error("Some variants are missing attribute values");
      return;
    }

    setSaving(true);

    try {
      const savePromises = unsavedVariants.map(async (v) => {
        const fd = new FormData();
        fd.append("sku", v.sku);
        fd.append("price", v.price || 0);
        fd.append("stock", v.stock || 0);
        fd.append("weight", v.weight || 0);
        fd.append("barcode", v.barcode || "");

        if (v.discount_price) {
          fd.append("discount_price", v.discount_price || 0);
        }

        if (v.attribute_value_ids && v.attribute_value_ids.length) {
          v.attribute_value_ids.forEach((id) => {
            fd.append("attribute_value_ids[]", id);
          });
        }

        if (v.newImages && v.newImages.length) {
          v.newImages.forEach(img => {
            fd.append("images[]", img);
          });
        }

        if (v.id) {
          fd.append("_method", "PUT");
          return postData({
            url: `/vendor/product-variants/${v.id}`,
            data: fd,
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          return postData({
            url: `/vendor/products/${productId}/variants`,
            data: fd,
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      });

      await Promise.all(savePromises);

      toast.success(`${unsavedVariants.length} variant(s) saved successfully`);

      Object.keys(blobUrlsRef.current).forEach(key => {
        blobUrlsRef.current[key].forEach(url => {
          URL.revokeObjectURL(url);
        });
      });
      blobUrlsRef.current = {};

      setSavedVariants(prev => {
        const newSet = new Set(prev);
        unsavedVariants.forEach(v => newSet.add(v.sku?.toLowerCase()));
        return newSet;
      });

      setVariants(prev => prev.map(v => ({
        ...v,
        isSaved: v.isSaved || unsavedVariants.includes(v),
        isModified: false,
        newImages: [],
        imagesToDelete: [],
      })));

      await refetch();
    } catch (e) {
      console.error(e);
      toast.error("Failed to save some variants. Check for duplicates.");
    } finally {
      setSaving(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.keys(blobUrlsRef.current).forEach(key => {
        blobUrlsRef.current[key].forEach(url => {
          URL.revokeObjectURL(url);
        });
      });
      blobUrlsRef.current = {};
    };
  }, []);

  const unsavedCount = variants.filter(v => !v.isSaved && (v.price || v.stock)).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <Package size={18} className="sm:w-5 sm:h-5 text-gray-600" />
          <h3 className="font-bold text-base sm:text-lg">Product Variants</h3>
          <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">
            {variants.length} total
          </span>
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
            {savedVariants.size} saved
          </span>
          {unsavedCount > 0 && (
            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
              {unsavedCount} unsaved
            </span>
          )}
        </div>

        {unsavedCount > 0 && (
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
          >
            <Save size={14} className="sm:w-4 sm:h-4" />
            {saving ? "Saving All..." : `Save All (${unsavedCount})`}
          </button>
        )}
      </div>

      {variants.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <AlertCircle size={32} className="sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm sm:text-base text-gray-500">No variants yet. Generate variants from attributes above.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {variants.map((v, i) => {
            // Generate a unique key that changes when images are added/removed
            const imageKey = `${v.id || i}-${v.previews?.length || 0}-${v.newImages?.length || 0}`;
            
            return (
              <div key={v.id || i} className={`border rounded-xl p-3 sm:p-4 transition bg-white`}>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded">
                        SKU: {v.sku}
                      </span>
                      {v.isSaved && (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle size={12} /> Saved
                        </span>
                      )}
                      {v.isModified && (
                        <span className="text-xs text-blue-600">● Modified</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(i, v.id)}
                    disabled={deletingId === v.id}
                    className="text-red-500 hover:text-red-700 transition p-1"
                  >
                    <Trash2 size={16} className="sm:w-4 sm:h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Price *"
                      value={v.price || ''}
                      onChange={(e) => handleChange(i, "price", parseFloat(e.target.value) || 0)}
                      className="border rounded-lg p-2 text-sm w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Stock</label>
                    <input
                      type="number"
                      placeholder="Stock *"
                      value={v.stock || ''}
                      onChange={(e) => handleChange(i, "stock", parseInt(e.target.value) || 0)}
                      className="border rounded-lg p-2 text-sm w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Weight (kg)"
                      value={v.weight || ''}
                      onChange={(e) => handleChange(i, "weight", parseFloat(e.target.value) || 0)}
                      className="border rounded-lg p-2 text-sm w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Barcode</label>
                    <input
                      placeholder="Barcode"
                      value={v.barcode || ''}
                      onChange={(e) => handleChange(i, "barcode", e.target.value)}
                      className="border rounded-lg p-2 text-sm w-full"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Variant Images</label>
                    <label className="cursor-pointer bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 text-sm w-fit">
                      <Upload size={12} />
                      Upload Images
                      <input
                        key={imageKey}
                        ref={el => fileInputRefs.current[`variant-${i}`] = el}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange(i, e)}
                      />
                    </label>

                    {(v.previews && v.previews.length > 0) && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-2">
                          {v.previews.map((preview, imgIdx) => (
                            preview && (
                              <div key={`${v.id || i}-img-${imgIdx}`} className="relative group">
                                <img
                                  src={preview}
                                  className="h-16 w-16 object-cover rounded border"
                                  alt={`Variant ${imgIdx}`}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                                <button
                                  onClick={() => removeImage(i, imgIdx)}
                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                                  type="button"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            )
                          ))}
                        </div>
                        {v.newImages && v.newImages.length > 0 && (
                          <p className="text-xs text-blue-600 mt-1">
                            {v.newImages.length} new image(s) pending upload
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => handleSaveSingle(v, i)}
                      disabled={savingId === (v.id || i) || (v.isSaved && !v.isModified)}
                      className={`px-3 sm:px-4 py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm w-full
                        ${(v.isSaved && !v.isModified)
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                    >
                      {savingId === (v.id || i) ? (
                        <><RefreshCw size={12} className="animate-spin" /> Saving...</>
                      ) : (v.isSaved && !v.isModified) ? (
                        <><CheckCircle size={12} /> Saved</>
                      ) : (
                        <><Save size={12} /> Save Changes</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

export default VariantSection;