import useGet from "../../../api/hooks/useGet";

const PermissionSelector = ({ selected = [], onChange }) => {
  const { data, loading } = useGet("/admin/permissions");
  const permissions = data || [];

  const grouped = permissions.reduce((acc, perm) => {
    if (!acc[perm.module]) acc[perm.module] = [];
    acc[perm.module].push(perm);
    return acc;
  }, {});

  const togglePermission = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter((p) => p !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const toggleModule = (modulePerms) => {
    const ids = modulePerms.map((p) => p.id);
    const allSelected = ids.every((id) => selected.includes(id));

    if (allSelected) {
      onChange(selected.filter((id) => !ids.includes(id)));
    } else {
      onChange([...new Set([...selected, ...ids])]);
    }
  };

  if (loading) return <p>Loading permissions...</p>;

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {Object.keys(grouped).map((module) => {
        const modulePerms = grouped[module];
        const ids = modulePerms.map((p) => p.id);
        const allSelected = ids.every((id) => selected.includes(id));

        return (
          <div key={module} className="border rounded-xl p-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold uppercase text-sm text-gray-700">
                {module}
              </h3>

              <button
                onClick={() => toggleModule(modulePerms)}
                className="text-xs text-blue-600"
              >
                {allSelected ? "Unselect All" : "Select All"}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {modulePerms.map((perm) => (
                <label
                  key={perm.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(perm.id)}
                    onChange={() => togglePermission(perm.id)}
                  />
                  <span className="capitalize">{perm.action}</span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PermissionSelector;