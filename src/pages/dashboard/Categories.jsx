import { useState } from "react";
import useGet from "../../api/hooks/useGet";
import useDelete from "../../api/hooks/useDelete";

import CategoryTable from "../../components/dashboard/CategoryTable";
import CategoryForm from "../../components/dashboard/CategoryForm";

const Categories = () => {
  const { data, loading, refetch } = useGet("/categories");
  const { deleteData } = useDelete();

  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const categories = data?.data || [];

  const handleDelete = async (item) => {
    try {
      if (!window.confirm(`Delete "${item.name}"?`)) return;

      if (item.parent_id) {
        await deleteData({ url: `/admin/subcategories/${item.id}` });
      } else {
        await deleteData({ url: `/admin/categories/${item.id}` });
      }

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
            Manage all categories and subcategories
          </p>
        </div>

        <button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          className="bg-[#7a1c3d] text-white px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
        >
          + Add Category
        </button>
      </div>

      {/* CARD CONTAINER */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

        {/* LOADING */}
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 bg-gray-200 animate-pulse rounded"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          /* EMPTY STATE */
          <div className="p-10 text-center">
            <p className="text-gray-500 mb-4">
              No categories found
            </p>
            <button
              onClick={() => setOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Create First Category
            </button>
          </div>
        ) : (
          <CategoryTable
            data={categories}
            onEdit={(item) => {
              setSelected(item);
              setOpen(true);
            }}
            onDelete={handleDelete}
          />
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