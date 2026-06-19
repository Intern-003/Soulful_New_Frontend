// usePermissions.js
import { useSelector } from "react-redux";
import { useMemo } from "react";

const usePermissions = () => {
  const permissions = useSelector((state) => state.auth.permissions) || [];

  const permissionMap = useMemo(() => {
    const map = {};

    permissions?.forEach((p) => {
      // Handle string format: "module.action" or "module.submodule.action"
      if (typeof p === 'string') {
        const lastDotIndex = p.lastIndexOf('.');
        if (lastDotIndex !== -1) {
          const module = p.substring(0, lastDotIndex);
          const action = p.substring(lastDotIndex + 1);
          
          if (!map[module]) {
            map[module] = new Set();
          }
          map[module].add(action);
        }
      } 
      // Handle object format: { module: 'dashboard', action: 'view' }
      else if (typeof p === 'object' && p.module && p.action) {
        if (!map[p.module]) {
          map[p.module] = new Set();
        }
        map[p.module].add(p.action);
      }
    });

    return map;
  }, [permissions]);

  const can = (module, action) => {
    if (!module || !action) return false;
    return permissionMap[module]?.has(action) || false;
  };

  const canAny = (module) => {
    if (!module) return false;
    return !!permissionMap[module];
  };

  const canAccessModule = (moduleName) => {
    if (!moduleName || !permissions) return false;
    
    // For string format
    if (typeof permissions[0] === 'string') {
      return permissions.some((p) => p.startsWith(moduleName + '.'));
    }
    
    // For object format
    return permissions.some((p) => p?.module === moduleName);
  };

  return {
    can,
    canAny,
    canAccessModule,
    permissions,
  };
};

export default usePermissions;