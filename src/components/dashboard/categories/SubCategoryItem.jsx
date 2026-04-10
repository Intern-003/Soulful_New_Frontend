import { getImageUrl } from "../../../utils/getImageUrl";

const SubCategoryItem = ({ item, onClick, onEdit, onDelete }) => {
  return (
    <div className="flex justify-between items-center p-4 border rounded-xl bg-white hover:shadow-sm hover:bg-gray-50 transition-all">

      {/* LEFT SIDE */}
      <div
        onClick={() => onClick?.(item)}
        className="flex items-center gap-4 cursor-pointer"
      >
        <div className="h-12 w-12 rounded-lg overflow-hidden border bg-gray-100 flex items-center justify-center">
          <img
            src={getImageUrl(item?.image) || "/no-image.png"}
            alt="category"
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(e) => {
              if (e.currentTarget.src.includes("no-image.png")) return;
              e.currentTarget.src = "/no-image.png";
            }}
          />
        </div>

        <div>
          <p className="text-gray-800 font-semibold text-sm">
            {item?.name || "No Name"}
          </p>

          <p className="text-xs text-gray-500">
            Click to view products
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">

        {/* POSITION */}
        <span className="text-xs text-gray-400">
          #{item?.position ?? "-"}
        </span>

        {/* STATUS */}
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            item?.status
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {item?.status ? "Active" : "Inactive"}
        </span>

        {/* EDIT */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(item);
          }}
          className="px-3 py-1 text-xs font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Edit
        </button>

        {/* DELETE */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(item);
          }}
          className="px-3 py-1 text-xs font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default SubCategoryItem;