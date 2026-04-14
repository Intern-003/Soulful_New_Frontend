import { useEffect, useState } from "react";
import usePost from "../../../api/hooks/usePost";
import usePut from "../../../api/hooks/usePut";

const BrandFormModal = ({ open, onClose, editData, refresh }) => {
  // ================= HOOKS =================
  const { postData, loading: postLoading } = usePost();
  const { putData, loading: putLoading } = usePut();

  const loading = postLoading || putLoading;

  // ================= STATE =================
  const [form, setForm] = useState({
    name: "",
    slug: "",
    status: 1,
    logo: null,
  });

  const [preview, setPreview] = useState(null);

  // ================= PREFILL =================
  useEffect(() => {
    if (editData) {
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
    } else {
      setForm({
        name: "",
        slug: "",
        status: 1,
        logo: null,
      });
      setPreview(null);
    }
  }, [editData, open]);

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

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!form.name) {
      alert("Brand name is required");
      return;
    }

    const data = new FormData();
    data.append("name", form.name);
    data.append("slug", form.slug);
    data.append("status", form.status);

    if (form.logo) {
      data.append("logo", form.logo);
    }

    try {
      if (editData) {
        // ✅ REAL PUT (REST)
        await putData({
          url: `/admin/brands/${editData.id}`,
          data,
        });
      } else {
        // CREATE
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

  // ⚠️ AFTER HOOKS
  if (!open) return null;

  // ================= UI =================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-scaleIn">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {editData ? "Edit Brand" : "Add Brand"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
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

          {/* IMAGE PREVIEW */}
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
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            {loading ? "Saving..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandFormModal;