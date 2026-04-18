import { getImageUrl } from "../../../utils/getImageUrl";

const BrandCard = ({ brand, onEdit, onDelete }) => {
  const subcategories = brand?.subcategories || [];

  // 🔥 LIMIT DISPLAY
  const visibleSubs = subcategories.slice(0, 3);
  const extraCount = subcategories.length - visibleSubs.length;

  const handleDelete = () => {
    const confirm = window.confirm(`Delete "${brand?.name}" brand?`);
    if (confirm) onDelete(brand.id);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col justify-between">

      {/* IMAGE */}
      <div className="flex justify-center mb-3">
        <img
          src={brand?.logo ? getImageUrl(brand.logo) : "/no-image.png"}
          alt={brand?.name || "brand"}
          className="w-20 h-20 object-contain"
          onError={(e) => {
            e.currentTarget.src = "/no-image.png";
          }}
        />
      </div>

      {/* CONTENT */}
      <div className="text-center">

        <h3 className="font-semibold text-lg truncate">
          {brand?.name || "-"}
        </h3>

        <p className="text-xs text-gray-500 truncate">
          {brand?.slug || "-"}
        </p>

        {/* STATUS */}
        <span
          className={`inline-block mt-2 px-2 py-1 text-xs rounded-full text-white ${
            brand?.status ? "bg-green-500" : "bg-gray-400"
          }`}
        >
          {brand?.status ? "Active" : "Inactive"}
        </span>

        {/* SUBCATEGORIES */}
        <div className="mt-3 flex flex-wrap justify-center gap-1 min-h-[24px]">
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
            <span className="text-[10px] text-gray-400">
              No subcategories
            </span>
          )}
        </div>

      </div>

      {/* ACTIONS */}
      <div className="flex justify-between mt-4 gap-2">
        <button
          onClick={() => onEdit(brand)}
          className="flex-1 text-sm bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
        >
          Edit
        </button>

        <button
          onClick={handleDelete}
          className="flex-1 text-sm bg-red-500 text-white py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default BrandCard;