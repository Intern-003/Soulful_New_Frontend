import { useState } from "react";
import usePost from "../../api/hooks/usePost";
import usePut from "../../api/hooks/usePut";

const CategoryForm = ({ data, onClose, onSuccess }) => {
  const { postData } = usePost();
  const { putData } = usePut();

  const [form, setForm] = useState({
    name: data?.name || "",
    description: data?.description || "",
    parent_id: data?.parent_id || null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (form.parent_id) {
        // SUBCATEGORY
        if (data) {
          await putData({
            url: `/admin/subcategories/${data.id}`,
            data: form,
          });
        } else {
          await postData({
            url: "/admin/subcategories",
            data: form,
          });
        }
      } else {
        // CATEGORY
        if (data) {
          await putData({
            url: `/admin/categories/${data.id}`,
            data: form,
          });
        } else {
          await postData({
            url: "/admin/categories",
            data: form,
          });
        }
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-lg font-bold mb-4">
          {data ? "Edit" : "Create"} Category
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="border w-full p-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            className="border w-full p-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <button className="bg-blue-600 text-white w-full py-2 rounded">
            Save
          </button>
        </form>

        <button onClick={onClose} className="mt-2 text-red-500">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CategoryForm;