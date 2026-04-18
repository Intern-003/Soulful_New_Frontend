import BrandTableRow from "./BrandTableRow";

const BrandList = ({ brands, loading, onEdit, onDelete }) => {
  // 🔥 HANDLE PAGINATED OR NORMAL DATA
  const brandList = Array.isArray(brands)
    ? brands
    : brands?.data || [];

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading brands...
      </div>
    );
  }

  if (!brandList.length) {
    return (
      <div className="bg-white shadow-sm rounded-2xl mt-4 p-10 text-center text-gray-400">
        No brands found
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-2xl mt-4 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          {/* HEADER */}
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="px-4">Logo</th>
              <th className="px-4">Name</th>
              <th className="px-4">Slug</th>
              <th className="px-4">Subcategories</th>
              <th className="px-4">Status</th>
              <th className="px-4 text-right">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y">
            {brandList.map((brand, index) => (
              <BrandTableRow
                key={brand.id}
                brand={brand}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default BrandList;