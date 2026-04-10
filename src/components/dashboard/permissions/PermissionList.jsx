import PermissionItem from "./PermissionItem";

const PermissionList = ({ permissions, onDelete, onEdit }) => {
  // 🔥 Group by module
  const grouped = permissions.reduce((acc, perm) => {
    if (!acc[perm.module]) acc[perm.module] = [];
    acc[perm.module].push(perm);
    return acc;
  }, {});

  return (
    <div className="bg-white p-4 rounded-2xl shadow border">
      {Object.keys(grouped).map((module) => (
        <div key={module} className="mb-6">
          {/* MODULE TITLE */}
          <h2 className="text-sm font-bold text-gray-700 uppercase mb-2">
            {module}
          </h2>

          {/* PERMISSIONS */}
          <div className="flex flex-wrap gap-2">
            {grouped[module].map((perm) => (
              <PermissionItem
                key={perm.id}
                perm={perm}
                onDelete={onDelete}
                onEdit={onEdit}   // ✅ ADDED
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PermissionList;