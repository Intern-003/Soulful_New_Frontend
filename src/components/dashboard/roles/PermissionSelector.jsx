import useGet from "../../../api/hooks/useGet";

const PermissionSelector = ({ selected = [], onChange }) => {
  const { data, loading } = useGet("/admin/permissions");

  const permissions = data || [];

  // 🔥 GROUP BY MODULE
  const grouped = permissions.reduce((acc, perm) => {
    if (!acc[perm.module]) acc[perm.module] = [];
    acc[perm.module].push(perm);
    return acc;
  }, {});

  // 🔥 TOGGLE
  const togglePermission = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter((p) => p !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  if (loading) return <p>Loading permissions...</p>;

  return (
    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">

      {Object.keys(grouped).map((module) => (
        <div key={module}>

          {/* MODULE TITLE */}
          <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase">
            {module}
          </h3>

          {/* PERMISSIONS */}
          <div className="grid grid-cols-2 gap-2">

            {grouped[module].map((perm) => (
              <label
                key={perm.id}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(perm.id)}
                  onChange={() => togglePermission(perm.id)}
                />

                <span className="capitalize">
                  {perm.action}
                </span>
              </label>
            ))}

          </div>
        </div>
      ))}

    </div>
  );
};

export default PermissionSelector;