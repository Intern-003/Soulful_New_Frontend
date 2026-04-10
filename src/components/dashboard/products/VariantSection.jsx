import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
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

  useEffect(() => {
    if (data?.data?.variants && !hasInitialized.current) {
      hasInitialized.current = true;
      const mapped = data.data.variants.map((v) => ({
        ...v,
        image: null,
        preview: v.image_url || null,
        isNew: false,
        isSaved: true,
      }));
      setVariants(mapped);
      setSavedVariants(new Set(mapped.map(v => v.sku?.toLowerCase())));
      onVariantsLoaded?.(mapped);
    }
  }, [data]);

  useImperativeHandle(ref, () => ({
    addVariants: (newVariants) => {
      setVariants((prev) => {
        const existingSkuSet = new Set(prev.map((v) => v.sku?.toLowerCase()));
        const savedSkuSet = savedVariants;
        
        const unique = newVariants.filter((v) => {
          const sku = v.sku?.toLowerCase();
          return sku && !existingSkuSet.has(sku) && !savedSkuSet.has(sku);
        });
        
        const duplicates = newVariants.filter((v) => {
          const sku = v.sku?.toLowerCase();
          return sku && (existingSkuSet.has(sku) || savedSkuSet.has(sku));
        });
        
        if (duplicates.length > 0) {
          toast.error(`${duplicates.length} duplicate variant(s) skipped (already exist)`);
        }
        
        if (unique.length === 0) {
          toast.error("No new variants to add");
          return prev;
        }
        
        toast.success(`${unique.length} new variant(s) added`);
        return [...prev, ...unique.map(v => ({ ...v, isNew: true, isSaved: false }))];
      });
    },
    hasVariants: () => variants.length > 0,
    getVariantsCount: () => variants.length,
    getUnsavedVariants: () => variants.filter(v => !v.isSaved && (v.price || v.stock)),
  }));

  const handleChange = (i, field, value) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[i][field] = value;
      updated[i].isModified = true;
      return updated;
    });
  };

  const handleImageChange = (i, file) => {
    if (file) {
      setVariants((prev) => {
        const updated = [...prev];
        if (updated[i].preview && !updated[i].id) {
          URL.revokeObjectURL(updated[i].preview);
        }
        updated[i].image = file;
        updated[i].preview = URL.createObjectURL(file);
        updated[i].isModified = true;
        return updated;
      });
    }
  };

  const handleDelete = async (i, id) => {
    if (id) {
      setDeletingId(id);
      try {
        await deleteData({ url: `/vendor/product-variants/${id}` });
        toast.success("Variant deleted");
        setVariants((prev) => prev.filter((_, index) => index !== i));
        setSavedVariants(prev => {
          const newSet = new Set(prev);
          const deletedSku = variants[i]?.sku?.toLowerCase();
          if (deletedSku) newSet.delete(deletedSku);
          return newSet;
        });
      } catch {
        toast.error("Delete failed");
      } finally {
        setDeletingId(null);
      }
    } else {
      if (variants[i]?.preview && !variants[i].id) {
        URL.revokeObjectURL(variants[i].preview);
      }
      setVariants((prev) => prev.filter((_, index) => index !== i));
      toast.success("Variant removed");
    }
  };

  const isVariantDuplicate = (variant, currentIndex) => {
    const currentSku = variant.sku?.toLowerCase();
    if (!currentSku) return false;
    
    // Check against saved variants
    if (savedVariants.has(currentSku)) return true;
    
    // Check against other variants in the list
    const duplicateInList = variants.some((v, idx) => 
      idx !== currentIndex && v.sku?.toLowerCase() === currentSku
    );
    
    return duplicateInList;
  };

  const handleSaveSingle = async (variant, index) => {
    // Check for duplicate before saving
    if (isVariantDuplicate(variant, index)) {
      toast.error(`Variant with SKU "${variant.sku}" already exists`);
      return;
    }

    if (!variant.price && !variant.stock) {
      toast.error("Please enter price and stock for this variant");
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
      if (variant.image) fd.append("image", variant.image);
      if (variant.id) fd.append("variant_id", variant.id);
      variant.attribute_value_ids?.forEach((id) => fd.append("attribute_value_ids[]", id));

      await postData({
        url: `/vendor/products/${productId}/variants`,
        data: fd,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Variant saved successfully");
      
      setSavedVariants(prev => new Set([...prev, variant.sku?.toLowerCase()]));
      setVariants(prev => {
        const updated = [...prev];
        updated[index].isSaved = true;
        updated[index].isNew = false;
        updated[index].isModified = false;
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
    const unsavedVariants = variants.filter((v, idx) => !v.isSaved && (v.price || v.stock));
    
    if (unsavedVariants.length === 0) {
      toast.error("No unsaved variants to save");
      return;
    }

    // Check for duplicates before saving
    const duplicates = unsavedVariants.filter((v, idx) => {
      const originalIndex = variants.findIndex(orig => orig === v);
      return isVariantDuplicate(v, originalIndex);
    });
    
    if (duplicates.length > 0) {
      toast.error(`${duplicates.length} variant(s) have duplicate SKUs. Please fix them first.`);
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
        if (v.image) fd.append("image", v.image);
        if (v.id) fd.append("variant_id", v.id);
        v.attribute_value_ids?.forEach((id) => fd.append("attribute_value_ids[]", id));
        
        return postData({
          url: `/vendor/products/${productId}/variants`,
          data: fd,
          headers: { "Content-Type": "multipart/form-data" },
        });
      });
      
      await Promise.all(savePromises);
      
      toast.success(`${unsavedVariants.length} variant(s) saved successfully`);
      
      setSavedVariants(prev => {
        const newSet = new Set(prev);
        unsavedVariants.forEach(v => newSet.add(v.sku?.toLowerCase()));
        return newSet;
      });
      
      setVariants(prev => prev.map(v => ({
        ...v,
        isSaved: v.isSaved || unsavedVariants.includes(v),
        isNew: false,
        isModified: false,
      })));
      
      await refetch();
    } catch (e) {
      console.error(e);
      toast.error("Failed to save some variants. Check for duplicates.");
    } finally {
      setSaving(false);
    }
  };

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
            const isDuplicate = isVariantDuplicate(v, i);
            const needsSave = !v.isSaved && (v.price || v.stock);
            
            return (
              <div key={v.id || i} className={`border rounded-xl p-3 sm:p-4 transition bg-white ${isDuplicate ? 'border-red-300 bg-red-50' : 'hover:shadow-lg'}`}>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded">SKU: {v.sku}</span>
                      {v.isSaved && <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle size={12} /> Saved</span>}
                      {needsSave && !isDuplicate && <span className="text-xs text-yellow-600">⚠️ Unsaved</span>}
                      {isDuplicate && <span className="text-xs text-red-600">❌ Duplicate SKU</span>}
                      {v.isModified && <span className="text-xs text-blue-600">● Modified</span>}
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
                  <input 
                    placeholder="Price *" 
                    value={v.price} 
                    onChange={(e) => handleChange(i, "price", e.target.value)} 
                    className={`border rounded-lg p-2 text-sm ${isDuplicate ? 'border-red-300' : ''}`}
                  />
                  <input 
                    placeholder="Stock *" 
                    value={v.stock} 
                    onChange={(e) => handleChange(i, "stock", e.target.value)} 
                    className={`border rounded-lg p-2 text-sm ${isDuplicate ? 'border-red-300' : ''}`}
                  />
                  <input 
                    placeholder="Weight (kg)" 
                    value={v.weight} 
                    onChange={(e) => handleChange(i, "weight", e.target.value)} 
                    className="border rounded-lg p-2 text-sm"
                  />
                  <input 
                    placeholder="Barcode" 
                    value={v.barcode} 
                    onChange={(e) => handleChange(i, "barcode", e.target.value)} 
                    className="border rounded-lg p-2 text-sm"
                  />
                  
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 text-sm">
                      <Upload size={12} className="sm:w-3 sm:h-3" />
                      Upload
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(i, e.target.files[0])} />
                    </label>
                    {v.preview && (
                      <div className="relative">
                        <img src={v.preview} className="h-8 w-8 sm:h-10 sm:w-10 object-cover rounded" alt="preview" />
                        {!v.id && (
                          <button 
                            onClick={() => {
                              URL.revokeObjectURL(v.preview);
                              setVariants(prev => {
                                const updated = [...prev];
                                updated[i].preview = null;
                                updated[i].image = null;
                                return updated;
                              });
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                          >
                            <X size={10} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => handleSaveSingle(v, i)} 
                    disabled={savingId === (v.id || i) || isDuplicate || v.isSaved}
                    className={`px-3 sm:px-4 py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm
                      ${v.isSaved 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : isDuplicate 
                          ? 'bg-red-300 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                  >
                    {savingId === (v.id || i) ? (
                      <><RefreshCw size={12} className="animate-spin" /> Saving...</>
                    ) : v.isSaved ? (
                      <><CheckCircle size={12} /> Saved</>
                    ) : (
                      <><Save size={12} /> Save</>
                    )}
                  </button>
                </div>
                
                {isDuplicate && (
                  <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} />
                    This SKU already exists. Please remove or modify this variant.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

export default VariantSection;