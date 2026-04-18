import { useEffect, useState } from "react";
import usePost from "../../../api/hooks/usePost";
import usePut from "../../../api/hooks/usePut";
import useGet from "../../../api/hooks/useGet";

const BrandFormModal = ({ open, onClose, editData, refresh }) => {
  const { postData, loading: postLoading } = usePost();
  const { putData, loading: putLoading } = usePut();
  const { data: categoriesData } = useGet("/categories");

  const loading = postLoading || putLoading;

  const [form, setForm] = useState({
    name: "",
    slug: "",
    status: 1,
    logo: null,
  });

  const [preview, setPreview] = useState(null);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  // ================= FETCH =================
  useEffect(() => {
    if (categoriesData?.data) {
      setCategories(categoriesData.data);
    }
  }, [categoriesData]);

  // ================= PREFILL =================
  useEffect(() => {
    if (editData && categories.length) {
      setForm({
        name: editData.name || "",
        slug: editData.slug || "",
        status: editData.status ? 1 : 0,
        logo: null,
      });

      setPreview(
        editData.logo
          ? `http://localhost:8000/${editData.logo}`
          : null
      );

      const subIds = editData.subcategories?.map((s) => s.id) || [];
      setSelectedSubcategories(subIds);

      // 🔥 FIND CATEGORY FROM SUBCATEGORY
      let foundCategory = null;

      categories.forEach((cat) => {
        if (cat.children?.some((child) => subIds.includes(child.id))) {
          foundCategory = cat;
        }
      });

      if (foundCategory) {
        setSelectedCategory(foundCategory.id);
        setSubcategories(foundCategory.children || []);
      }

    } else {
      setForm({
        name: "",
        slug: "",
        status: 1,
        logo: null,
      });

      setPreview(null);
      setSelectedCategory("");
      setSubcategories([]);
      setSelectedSubcategories([]);
    }
  }, [editData, open, categories]);

  // ================= HANDLERS =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({ ...form, logo: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleCategoryChange = (e) => {
    const categoryId = parseInt(e.target.value);
    setSelectedCategory(categoryId);

    const selected = categories.find((c) => c.id === categoryId);

    setSubcategories(selected?.children || []);
    setSelectedSubcategories([]); // reset only on manual change
  };

  const handleSubcategoryChange = (id) => {
    setSelectedSubcategories((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!form.name) {
      alert("Brand name is required");
      return;
    }

    if (!selectedSubcategories.length) {
      alert("Please select at least one subcategory");
      return;
    }

    const data = new FormData();
    data.append("name", form.name);
    data.append("slug", form.slug);
    data.append("status", form.status);

    if (form.logo) {
      data.append("logo", form.logo);
    }

    selectedSubcategories.forEach((id) => {
      data.append("subcategory_ids[]", id);
    });

    try {
      if (editData) {
        await putData({
          url: `/admin/brands/${editData.id}`,
          data,
        });
      } else {
        await postData({
          url: "/admin/brands",
          data,
        });
      }

      refresh();
      onClose();
    } catch (err) {
      console.error("Brand Error:", err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {editData ? "Edit Brand" : "Add Brand"}
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="space-y-3">

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Brand Name"
            className="w-full border p-2 rounded"
          />

          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="Slug"
            className="w-full border p-2 rounded"
          />

          <input type="file" onChange={handleFile} />

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-16 h-16 object-cover rounded"
            />
          )}

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>

          {/* CATEGORY */}
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* SUBCATEGORIES */}
          {subcategories.length > 0 && (
            <div>
              <p className="text-sm font-medium mt-2">
                Select Subcategories
              </p>

              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded">
                {subcategories.map((sub) => (
                  <label key={sub.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedSubcategories.includes(sub.id)}
                      onChange={() => handleSubcategoryChange(sub.id)}
                    />
                    {sub.name}
                  </label>
                ))}
              </div>
            </div>
          )}

        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {loading ? "Saving..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandFormModal;