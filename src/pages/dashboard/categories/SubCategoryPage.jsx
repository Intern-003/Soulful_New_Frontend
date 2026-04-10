import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import useGet from "../../../api/hooks/useGet";
import useDelete from "../../../api/hooks/useDelete";

import SubCategoryItem from "../../../components/dashboard/categories/SubCategoryItem";
import CategoryForm from "../../../components/dashboard/categories/CategoryForm";

const SubCategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ API
  const { data, loading, refetch } = useGet(`/categories/${id}`);
  const { deleteData } = useDelete();

  // ✅ LOCAL STATE
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  // ✅ SAFE DATA
  const category = data?.data || {};
  const subs = category?.children || [];

  // ✅ DELETE
  const handleDelete = async (item) => {
    try {
      if (!window.confirm(`Delete "${item.name}"?`)) return;

      await deleteData({
        url: `/admin/subcategories/${item.id}`,
      });

      await refetch(); // ✅ ensure UI updates
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-500 text-sm hover:underline"
          >
            ← Back
          </button>

          <h1 className="text-xl font-bold">
            {category.name || "Subcategories"}
          </h1>
        </div>

        <button
          onClick={() => {
            setSelected({ parent_id: id }); // ✅ ensures correct API (subcategory)
            setOpen(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:opacity-90"
        >
          + Add Subcategory
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 bg-gray-200 animate-pulse rounded"
            />
          ))}
        </div>
      ) : subs.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No subcategories found
        </div>
      ) : (
        subs.map((sub) => (
          <SubCategoryItem
            key={sub.id}
            item={sub}

            // ✅ NAVIGATE TO PRODUCTS
            onClick={() =>
              navigate(`/dashboard/subcategories/${sub.id}/products`)
            }

            // ✅ EDIT
            onEdit={(item) => {
              setSelected(item); // must contain id
              setOpen(true);
            }}

            // ✅ DELETE
            onDelete={handleDelete}
          />
        ))
      )}

      {/* MODAL */}
      {open && (
        <CategoryForm
          data={selected}
          parentId={id} // ✅ VERY IMPORTANT (fixes wrong API issue)
          onClose={() => {
            setOpen(false);
            setSelected(null); // ✅ reset state
          }}
          onSuccess={async () => {
            await refetch(); // ✅ refresh after create/update
          }}
        />
      )}
    </div>
  );
};

export default SubCategoryPage;