// ✅ FINAL PRO CATEGORY FORM (FIXED FOR API + IMAGE URL + LOCAL/PRODUCTION READY)

import { useEffect, useState } from "react";
import usePost from "../../../api/hooks/usePost";
import usePut from "../../../api/hooks/usePut";
import toast from "react-hot-toast";
import { getImageUrl } from "../../../utils/getImageUrl";

const CategoryForm = ({ data, onClose, onSuccess }) => {
  const isEdit = !!data?.id;

  const { postData } = usePost();
  const { putData } = usePut();

  const [form, setForm] = useState({
    name: "",
    description: "",
    parent_id: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || "",
        description: data.description || "",
        parent_id: data.parent_id || "",
      });

      if (data.image) {
        setPreview(getImageUrl(data.image));
      } else {
        setPreview(null);
      }
    }
  }, [data]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const selected = e.target.files[0];
    setFile(selected);

    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);

      if (form.parent_id) {
        formData.append("parent_id", form.parent_id);
      }

      if (file) {
        formData.append("image", file);
      }

      if (isEdit) {
        await putData({
          url: form.parent_id
            ? `/admin/subcategories/${data.id}`
            : `/admin/categories/${data.id}`,
          data: formData,
        });

        toast.success("Category updated successfully");
      } else {
        await postData({
          url: form.parent_id
            ? "/admin/subcategories"
            : "/admin/categories",
          data: formData,
        });

        toast.success("Category created successfully");
      }

      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error(err);

      const msg =
        err?.message ||
        err?.errors?.image?.[0] ||
        "Something went wrong";

      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[420px] space-y-5">
        <h2 className="text-xl font-semibold text-gray-800">
          {isEdit ? "Edit Category" : "Create Category"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded text-sm">
            {error}
          </div>
        )}

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Category Name"
          className="w-full border p-2 rounded-lg"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded-lg"
        />

        <input
          type="file"
          onChange={handleFile}
          className="text-sm"
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="h-20 w-20 object-cover rounded-lg border"
          />
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          {loading ? "Saving..." : "Save"}
        </button>

        <button
          onClick={onClose}
          className="text-red-500 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CategoryForm;