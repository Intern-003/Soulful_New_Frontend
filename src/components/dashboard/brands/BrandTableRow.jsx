import { getImageUrl } from "../../../utils/getImageUrl";

const BrandTableRow = ({
  brand,
  index,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const subcategories = brand?.subcategories || [];

  // 🔥 LIMIT DISPLAY
  const visibleSubs = subcategories.slice(0, 2);
  const extraCount = subcategories.length - visibleSubs.length;

  return (
    <tr className="hover:bg-gray-50 transition">

      {/* INDEX */}
      <td className="py-3 px-4">{index + 1}</td>

      {/* LOGO */}
      <td className="px-4">
        <img
  src={brand?.logo ? getImageUrl(brand.logo) : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5' fill='%23999'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E"}
  alt={brand?.name || "brand"}
  className="w-10 h-10 object-contain rounded"
  onError={(e) => {
    // Prevent infinite loop by removing onError after first failure
    e.currentTarget.onerror = null;
    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='1'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5' fill='%23999'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
  }}
/>
      </td>

      {/* NAME */}
      <td className="px-4 font-medium">
        {brand?.name || "-"}
      </td>

      {/* SLUG */}
      <td className="px-4 text-gray-500 text-xs">
        {brand?.slug || "-"}
      </td>

      {/* SUBCATEGORIES */}
      <td className="px-4">
        <div className="flex flex-wrap gap-1">
          {subcategories.length > 0 ? (
            <>
              {visibleSubs.map((sub) => (
                <span
                  key={sub.id}
                  className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
                >
                  {sub.name}
                </span>
              ))}

              {extraCount > 0 && (
                <span
                  className="text-[10px] text-gray-500 cursor-pointer"
                  title={subcategories.map((s) => s.name).join(", ")}
                >
                  +{extraCount} more
                </span>
              )}
            </>
          ) : (
            <span className="text-gray-400 text-xs">
              No subcategories
            </span>
          )}
        </div>
      </td>

      {/* STATUS */}
      <td className="px-4">
        <span
          className={`px-2 py-1 text-xs rounded-full text-white ${
            brand?.status ? "bg-green-500" : "bg-gray-400"
          }`}
        >
          {brand?.status ? "Active" : "Inactive"}
        </span>

        {/* OPTIONAL TOGGLE */}
        {onToggleStatus && (
          <button
            onClick={() => onToggleStatus(brand)}
            className="ml-2 text-xs text-blue-500 hover:underline"
          >
            Toggle
          </button>
        )}
      </td>

      {/* ACTIONS */}
      <td className="px-4 text-right space-x-2">
        <button
          onClick={() => onEdit(brand)}
          className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(brand)}
          className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default BrandTableRow;