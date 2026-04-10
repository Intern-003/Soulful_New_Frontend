const PermissionItem = ({ perm, onDelete, onEdit }) => {
  return (
    <div className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
      
      {/* CLICK TO EDIT */}
      <span
        onClick={() => onEdit(perm)}
        className="cursor-pointer hover:text-[#7a1c3d]"
      >
        {perm.action}
      </span>

      {/* DELETE */}
      <button
        onClick={() => onDelete(perm.id)}
        className="text-red-500 text-xs"
      >
        ✕
      </button>
    </div>
  );
};

export default PermissionItem;