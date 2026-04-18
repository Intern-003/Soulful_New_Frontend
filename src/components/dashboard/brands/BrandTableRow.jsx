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
          src={brand?.logo ? getImageUrl(brand.logo) : "/no-image.png"}
          alt={brand?.name || "brand"}
          className="w-10 h-10 object-contain rounded"
          onError={(e) => {
            e.currentTarget.src = "/no-image.png";
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