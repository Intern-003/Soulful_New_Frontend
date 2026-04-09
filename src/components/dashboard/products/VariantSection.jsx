import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import usePost from "../../../api/hooks/usePost";
import useDelete from "../../../api/hooks/useDelete";
import useGet from "../../../api/hooks/useGet";
import toast from "react-hot-toast";

const VariantSection = forwardRef(({ productId, onVariantsLoaded }, ref) => {
  const { data, refetch } = useGet(`/vendor/products/${productId}`);
  const { postData } = usePost();
  const { deleteData } = useDelete();

  const [variants, setVariants] = useState([]);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Load existing variants
  useEffect(() => {
  if (data?.data?.variants) {
    const mapped = data.data.variants.map((v) => ({
      ...v,
      image: null,
      preview: v.image_url || null,
    }));

    setVariants((prev) => {
      if (prev.length > 0) return prev;

      onVariantsLoaded?.(mapped); // ✅ send to parent

      return mapped;
    });
  }
}, [data]);

  // 👇 expose method to parent
  useImperativeHandle(ref, () => {
    const addVariants = (newVariants) => {
  setVariants((prev) => {
    const existingSkuSet = new Set(
      prev.map((v) => v.sku.toLowerCase())
    );

    const unique = newVariants.filter(
      (v) => !existingSkuSet.has(v.sku.toLowerCase())
    );

    const duplicates = newVariants.filter((v) =>
      existingSkuSet.has(v.sku.toLowerCase())
    );

    if (duplicates.length > 0) {
      toast.error(`${duplicates.length} duplicate variant(s) removed`);
    }

    if (unique.length === 0) return prev;

    return [...prev, ...unique];
  });

      // ✅ side-effects AFTER state update
      setTimeout(() => {
        if (addVariants._hasDuplicates) {
          toast.error("Some variants already exist");
        }

        if (addVariants._pendingUnique?.length > 0) {
          toast.success(`${addVariants._pendingUnique.length} new variants added`);
        }
      }, 0);
    };

    return { addVariants };
  });

  const handleChange = (i, field, value) => {
    const updated = [...variants];
    updated[i][field] = value;
    setVariants(updated);
  };

  const handleImageChange = (i, file) => {
    const updated = [...variants];
    updated[i].image = file;
    updated[i].preview = URL.createObjectURL(file);
    setVariants(updated);
  };

  const handleDelete = async (i, id) => {
    if (id) {
      setDeletingId(id);
      try {
        await deleteData({
          url: `/vendor/products/${productId}/variants/${id}`,
        });

        toast.success("Deleted");
        await refetch();
      } catch {
        toast.error("Delete failed");
      } finally {
        setDeletingId(null);
      }
    }

    setVariants((prev) => prev.filter((_, index) => index !== i));
  };

  const handleSave = async () => {
    if (!variants.length) {
      toast.error("No variants");
      return;
    }

    setSaving(true);

    try {
      await Promise.all(
        variants.map((v) => {
          const fd = new FormData();

          fd.append("sku", v.sku);
          fd.append("price", v.price || 0);
          fd.append("discount_price", v.discount_price || 0);
          fd.append("stock", v.stock || 0);
          fd.append("weight", v.weight || 0);
          fd.append("barcode", v.barcode || "");

          if (v.image) fd.append("image", v.image);
          if (v.id) fd.append("variant_id", v.id);

          v.attribute_value_ids.forEach((id) =>
            fd.append("attribute_value_ids[]", id)
          );

          return postData({
            url: `/vendor/products/${productId}/variants`,
            data: fd,
            headers: { "Content-Type": "multipart/form-data" },
          });
        })
      );

      toast.success("Variants saved 🚀");
      await refetch();
      setIsEditMode(true);
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="font-bold text-lg mb-3">Variants</h3>

      {variants.length === 0 ? (
        <p className="text-gray-500">No variants yet</p>
      ) : (
        <>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {variants.map((v, i) => (
              <div key={v.id || i} className="border p-4 rounded-lg">
                <button
                  onClick={() => handleDelete(i, v.id)}
                  disabled={deletingId === v.id}
                  className="text-red-500 text-sm float-right"
                >
                  Delete
                </button>

                <div className="grid md:grid-cols-4 gap-3 mt-6">
                  <input value={v.sku} readOnly className="border p-2" />

                  <input
                    placeholder="Price"
                    value={v.price}
                    onChange={(e) =>
                      handleChange(i, "price", e.target.value)
                    }
                    className="border p-2"
                  />

                  <input
                    placeholder="Stock"
                    value={v.stock}
                    onChange={(e) =>
                      handleChange(i, "stock", e.target.value)
                    }
                    className="border p-2"
                  />

                  <input
                    placeholder="Weight"
                    value={v.weight}
                    onChange={(e) =>
                      handleChange(i, "weight", e.target.value)
                    }
                    className="border p-2"
                  />

                  <input
                    placeholder="Barcode"
                    value={v.barcode}
                    onChange={(e) =>
                      handleChange(i, "barcode", e.target.value)
                    }
                    className="border p-2"
                  />

                  {/* IMAGE */}
                  <div>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleImageChange(i, e.target.files[0])
                      }
                    />

                    {v.preview && (
                      <img
                        src={v.preview}
                        className="h-16 mt-2 rounded"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 text-white px-4 py-2 mt-4 rounded disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : isEditMode
                ? "Update Variants"
                : "Save Variants"}
          </button>
        </>
      )}
    </div>
  );
});

export default VariantSection;