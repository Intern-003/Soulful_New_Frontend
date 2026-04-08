import { useState, useEffect } from "react";
import usePost from "../../../api/hooks/usePost";
import useDelete from "../../../api/hooks/useDelete"; // Your existing hook
import useGet from "../../../api/hooks/useGet";
import toast from "react-hot-toast";

const VariantSection = ({ productId, generatedVariants, onVariantsChange }) => {
  const { data, refetch } = useGet(`/vendor/products/${productId}`);
  const { postData } = usePost();
  const { deleteData, loading: deleteLoading } = useDelete(); // Use your hook

  const [variants, setVariants] = useState([]);
  const [saving, setSaving] = useState(false);
  const [deletingVariantId, setDeletingVariantId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Load existing variants when product data is fetched
  useEffect(() => {
    if (data?.data?.variants?.length > 0) {
      const existing = data.data.variants.map(v => ({
        attribute_value_ids: v.attribute_value_ids || [],
        sku: v.sku || "",
        price: v.price || "",
        discount_price: v.discount_price || "",
        stock: v.stock || "",
        weight: v.weight || "",
        barcode: v.barcode || "",
        image: null,
        id: v.id,
        isExisting: true
      }));
      setVariants(existing);
      setIsEditMode(true);
    } else if (data?.data?.variants?.length === 0) {
      setVariants([]);
      setIsEditMode(false);
    }
  }, [data]);

  // Handle new generated variants - prevent duplicates
  useEffect(() => {
    if (generatedVariants?.length > 0) {
      // Filter out duplicates based on SKU
      const newVariants = generatedVariants.filter(newVariant => {
        const isDuplicate = variants.some(existingVariant => 
          existingVariant.sku === newVariant.sku
        );
        return !isDuplicate;
      });

      if (newVariants.length === 0 && generatedVariants.length > 0) {
        toast.error("All generated variants already exist!");
        return;
      }

      if (newVariants.length < generatedVariants.length) {
        toast.success(`${newVariants.length} new variants added (${generatedVariants.length - newVariants.length} duplicates skipped)`);
      } else if (newVariants.length > 0) {
        toast.success(`${newVariants.length} new variant(s) added`);
      }

      setVariants(prev => [...prev, ...newVariants]);
      if (onVariantsChange) onVariantsChange([...variants, ...newVariants]);
    }
  }, [generatedVariants]);

  // Handle delete variant
  const handleDeleteVariant = async (index, variantId) => {
    if (variantId) {
      // Delete from server if it's an existing variant
      setDeletingVariantId(variantId);
      try {
        await deleteData({
          url: `/vendor/products/${productId}/variants/${variantId}`
        });
        
        // Remove from local state
        const updatedVariants = variants.filter((_, i) => i !== index);
        setVariants(updatedVariants);
        
        toast.success("Variant deleted successfully");
        
        // Refetch to update parent component
        await refetch();
        if (onVariantsChange) onVariantsChange(updatedVariants);
        
        // If no variants left, reset edit mode
        if (updatedVariants.length === 0) {
          setIsEditMode(false);
        }
      } catch (err) {
        toast.error("Failed to delete variant");
        console.error(err);
      } finally {
        setDeletingVariantId(null);
      }
    } else {
      // Just remove from local state for new unsaved variants
      const updatedVariants = variants.filter((_, i) => i !== index);
      setVariants(updatedVariants);
      toast.success("Variant removed");
      if (onVariantsChange) onVariantsChange(updatedVariants);
    }
  };

  // Handle delete all variants
  const handleDeleteAll = async () => {
    const existingVariantsCount = variants.filter(v => v.id).length;
    const newVariantsCount = variants.filter(v => !v.id).length;
    
    let message = `Are you sure you want to delete all ${variants.length} variants?`;
    if (existingVariantsCount > 0) {
      message += `\n\nThis will permanently delete ${existingVariantsCount} existing variant(s) from the server.`;
    }
    
    if (!confirm(message)) {
      return;
    }

    try {
      // Delete existing variants from server one by one
      const existingVariants = variants.filter(v => v.id);
      
      for (let variant of existingVariants) {
        await deleteData({
          url: `/vendor/products/${productId}/variants/${variant.id}`
        });
      }
      
      // Clear all variants
      setVariants([]);
      setIsEditMode(false);
      
      toast.success(`Deleted ${existingVariantsCount} variant(s) successfully`);
      await refetch();
      if (onVariantsChange) onVariantsChange([]);
    } catch (err) {
      toast.error("Failed to delete some variants");
      console.error(err);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
    if (onVariantsChange) onVariantsChange(updated);
  };

  const handleImageChange = (index, file) => {
    const updated = [...variants];
    updated[index].image = file;
    setVariants(updated);
    if (onVariantsChange) onVariantsChange(updated);
  };

  const handleSave = async () => {
    if (variants.length === 0) {
      toast.error("No variants to save");
      return;
    }

    setSaving(true);

    try {
      let savedCount = 0;
      
      for (let v of variants) {
        const fd = new FormData();

        fd.append("sku", v.sku);
        fd.append("price", v.price || 0);
        fd.append("discount_price", v.discount_price || 0);
        fd.append("stock", v.stock || 0);
        fd.append("weight", v.weight || 0);
        fd.append("barcode", v.barcode || "");

        if (v.image) fd.append("image", v.image);
        
        // For existing variants, include the ID for update
        if (v.id) fd.append("variant_id", v.id);

        v.attribute_value_ids.forEach((id) => {
          fd.append("attribute_value_ids[]", id);
        });

        await postData({
          url: `/vendor/products/${productId}/variants`,
          data: fd,
          headers: { "Content-Type": "multipart/form-data" },
        });
        
        savedCount++;
      }

      toast.success(`${savedCount} variant(s) ${isEditMode ? "updated" : "saved"} successfully 🚀`);
      await refetch();
      
      // Reset the edit mode flag after successful save
      if (!isEditMode && variants.length > 0) {
        setIsEditMode(true);
      }
    } catch (err) {
      toast.error("Failed to save variants");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">Product Variants</h3>
        {variants.length > 0 && (
          <button
            onClick={handleDeleteAll}
            disabled={deleteLoading || saving}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded disabled:opacity-50 transition-colors"
          >
            {deleteLoading ? "Deleting..." : "Delete All"}
          </button>
        )}
      </div>

      {variants.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500">
            No variants generated yet. 
            <br />
            Select attribute values above and click "Generate Variants".
          </p>
        </div>
      ) : (
        <>
          <div className="max-h-[500px] overflow-y-auto space-y-3">
            {variants.map((v, i) => (
              <div key={v.id || i} className="border border-gray-200 p-4 rounded-lg relative bg-white shadow-sm">
                {/* Delete button for individual variant */}
                <button
                  onClick={() => handleDeleteVariant(i, v.id)}
                  disabled={deleteLoading === v.id || saving}
                  className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded disabled:opacity-50 transition-colors"
                >
                  {deleteLoading === v.id ? "Deleting..." : "Delete"}
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                  <div>
                    <label className="text-xs text-gray-600 font-medium">SKU</label>
                    <input 
                      value={v.sku} 
                      readOnly 
                      className="border border-gray-300 rounded p-2 w-full bg-gray-50 text-sm" 
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-600 font-medium">Price *</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={v.price}
                      onChange={(e) => handleChange(i, "price", e.target.value)}
                      className="border border-gray-300 rounded p-2 w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 font-medium">Discount Price</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={v.discount_price}
                      onChange={(e) => handleChange(i, "discount_price", e.target.value)}
                      className="border border-gray-300 rounded p-2 w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 font-medium">Stock *</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={v.stock}
                      onChange={(e) => handleChange(i, "stock", e.target.value)}
                      className="border border-gray-300 rounded p-2 w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 font-medium">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={v.weight}
                      onChange={(e) => handleChange(i, "weight", e.target.value)}
                      className="border border-gray-300 rounded p-2 w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 font-medium">Barcode</label>
                    <input
                      placeholder="Optional"
                      value={v.barcode}
                      onChange={(e) => handleChange(i, "barcode", e.target.value)}
                      className="border border-gray-300 rounded p-2 w-full"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-600 font-medium">Variant Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(i, e.target.files[0])}
                      className="border border-gray-300 rounded p-2 w-full"
                    />
                    {v.id && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ Existing variant (will be updated)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSave}
              disabled={saving || deleteLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 transition-colors font-medium"
            >
              {saving ? "Saving..." : (isEditMode ? "Update All Variants" : "Save All Variants")}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VariantSection;