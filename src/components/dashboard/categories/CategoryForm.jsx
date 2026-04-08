import { useEffect, useState } from "react";
import usePost from "../../../api/hooks/usePost";
import usePut from "../../../api/hooks/usePut";
import axios from "axios";

const CategoryForm = ({ data, parentId = null, onClose, onSuccess }) => {
  const { postData } = usePost();
  const { putData } = usePut();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState({
    name: data?.name || "",
    description: data?.description || "",
    position: data?.position || "",
    parent_id: data?.parent_id || parentId || "",
    image: null,
  });

  const [preview, setPreview] = useState(
    data?.image ? `http://127.0.0.1:8000/storage/${data.image}` : null
  );

  // ✅ Fetch only main categories (for parent dropdown)
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/categories"
      );

      // only parent categories
      const parents = res.data.data.filter((c) => !c.parent_id);
      setCategories(parents);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // ✅ image handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ validation
  const validate = () => {
    let newErrors = {};

    if (!form.name) newErrors.name = "Name is required";

    // only category needs position
    if (!form.parent_id && !form.position) {
      newErrors.position = "Position is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");

    if (!validate()) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);

      if (!form.parent_id) {
        formData.append("position", form.position);
      }

      if (form.parent_id) {
        formData.append("parent_id", form.parent_id);
      }

      if (form.image) {
        formData.append("image", form.image);
      }

      const isSub = !!form.parent_id;

      if (data) {
        await putData({
          url: isSub
            ? `/admin/subcategories/${data.id}`
            : `/admin/categories/${data.id}`,
          data: formData,
          isFormData: true,
        });
        setSuccessMsg("Updated successfully");
      } else {
        await postData({
          url: isSub
            ? "/admin/subcategories"
            : "/admin/categories",
          data: formData,
          isFormData: true,
        });
        setSuccessMsg("Created successfully");
      }

      onSuccess();

      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      console.error(err);

      if (err?.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: "Something went wrong" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl w-[420px] shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {data ? "Edit" : "Create"}{" "}
          {form.parent_id ? "Subcategory" : "Category"}
        </h2>

        {/* SUCCESS */}
        {successMsg && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-3 text-sm">
            {successMsg}
          </div>
        )}

        {/* ERROR */}
        {errors.general && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-3 text-sm">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="border w-full p-2 rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* DESCRIPTION */}
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border w-full p-2 rounded"
          />

          {/* POSITION (ONLY FOR CATEGORY) */}
          {!form.parent_id && (
            <div>
              <input
                type="number"
                name="position"
                placeholder="Position"
                value={form.position}
                onChange={handleChange}
                className="border w-full p-2 rounded"
              />
              {errors.position && (
                <p className="text-red-500 text-sm">
                  {errors.position}
                </p>
              )}
            </div>
          )}

          {/* PARENT SELECT */}
          <select
            name="parent_id"
            value={form.parent_id}
            onChange={handleChange}
            className="border w-full p-2 rounded"
          >
            <option value="">Main Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* IMAGE */}
          <div>
            <input type="file" onChange={handleImageChange} />
            {preview && (
              <img
                src={preview}
                className="h-20 w-20 mt-2 object-cover rounded"
              />
            )}
          </div>

          {/* BUTTON */}
          <button
            disabled={loading}
            className="bg-blue-600 text-white w-full py-2 rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>

        <button
          onClick={onClose}
          className="mt-3 text-red-500 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CategoryForm;