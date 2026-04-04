import { useSelector } from "react-redux";
import { useMemo } from "react";

const usePermissions = () => {
  const permissions = useSelector((state) => state.auth.permissions);

  const permissionMap = useMemo(() => {
    const map = {};

    permissions?.forEach((p) => {
      if (!map[p.module]) {
        map[p.module] = new Set();
      }
      map[p.module].add(p.action);
    });

    return map;
  }, [permissions]);

  const can = (module, action) => {
    return permissionMap[module]?.has(action) || false;
  };

  const canAny = (module) => {
    return !!permissionMap[module];
  };

  return {
    can,
    canAny,
    permissions,
  };
};

export default usePermissions;