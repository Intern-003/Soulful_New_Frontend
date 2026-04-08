const CategoryItem = ({ item, onClick, onEdit, onDelete }) => {
  return (
    <div className="flex justify-between items-center p-4 border-b hover:bg-gray-50">
      
      {/* LEFT SIDE (CLICKABLE) */}
      <div
        onClick={onClick}
        className="flex items-center gap-3 cursor-pointer"
      >
        <img
          src={
            item.image
              ? `http://127.0.0.1:8000/storage/${item.image}`
              : "/no-image.png"
          }
          alt=""
          className="h-10 w-10 object-cover rounded border"
        />

        <div>
          <p className="font-semibold text-gray-800">
            {item.name}
          </p>
          <p className="text-xs text-gray-500">
            Click to view subcategories
          </p>
        </div>
      </div>

      {/* RIGHT SIDE (ACTIONS) */}
      <div className="flex items-center gap-2">
        
        {/* POSITION */}
        <span className="text-xs text-gray-400">
          #{item.position ?? "-"}
        </span>

        {/* STATUS */}
        <span
          className={`px-2 py-1 text-xs rounded ${
            item.status
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {item.status ? "Active" : "Inactive"}
        </span>

        {/* EDIT */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item);
          }}
          className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
        >
          Edit
        </button>

        {/* DELETE */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item);
          }}
          className="px-3 py-1 bg-red-500 text-white rounded text-xs"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default CategoryItem;