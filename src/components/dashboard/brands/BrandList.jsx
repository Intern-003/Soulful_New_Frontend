// ===============================
// ✅ BrandList.jsx (MODERN UI - TAILWIND)
// ===============================
import BrandTableRow from "./BrandTableRow";

const BrandList = ({ brands, loading, onEdit, onDelete }) => {
  if (loading) {
    return <div className="text-center py-10">Loading brands...</div>;
  }

  if (!brands || brands.length === 0) {
    return <div className="text-center py-10">No brands found</div>;
  }

  return (
    <div className="bg-white shadow rounded-2xl p-4 mt-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-3">#</th>
              <th>Logo</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {brands.map((brand, index) => (
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

