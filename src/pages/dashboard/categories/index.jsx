import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useGet from "../../../api/hooks/useGet";
import useDelete from "../../../api/hooks/useDelete";

import CategoryItem from "../../../components/dashboard/categories/CategoryItem";
import CategoryForm from "../../../components/dashboard/categories/CategoryForm";

const Categories = () => {
  const navigate = useNavigate();

  const { data, loading, refetch } = useGet("/categories");
  const { deleteData } = useDelete();

  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const categories = data?.data || [];

  // ✅ DELETE
  const handleDelete = async (item) => {
    try {
      if (!window.confirm(`Delete "${item.name}"?`)) return;

      const url = item.parent_id
        ? `/admin/subcategories/${item.id}`
        : `/admin/categories/${item.id}`;

      await deleteData({ url });
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Categories
          </h1>
          <p className="text-sm text-gray-500">
            Manage all categories
          </p>
        </div>

        <button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          className="bg-[#7a1c3d] text-white px-4 py-2 rounded-lg"
        >
          + Add Category
        </button>
      </div>

      {/* LIST */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 bg-gray-200 animate-pulse rounded"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No categories found
          </div>
        ) : (
          categories.map((cat) => (
            <CategoryItem
              key={cat.id}
              item={cat}
              onClick={() =>
                navigate(`/dashboard/categories/${cat.id}`)
              }
              onEdit={(item) => {
                setSelected(item);
                setOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* MODAL */}
      {open && (
        <CategoryForm
          data={selected}
          onClose={() => setOpen(false)}
          onSuccess={refetch}
        />
      )}
    </div>
  );
};

export default Categories;