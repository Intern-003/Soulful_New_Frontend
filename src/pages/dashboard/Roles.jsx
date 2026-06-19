import { useMemo, useState, useCallback } from "react";
import {
  ShieldCheck,
  Plus,
  RefreshCw,
} from "lucide-react";

import useGet from "../../api/hooks/useGet";
import useDelete from "../../api/hooks/useDelete";

import RoleStats from "../../components/dashboard/roles/RoleStats";
import RoleFilters from "../../components/dashboard/roles/RoleFilters";
import RoleTable from "../../components/dashboard/roles/RoleTable";
import RoleMobileCard from "../../components/dashboard/roles/RoleMobileCard";
import RoleFormModal from "../../components/dashboard/roles/RoleFormModal";
import toast from "react-hot-toast";

/* ==========================================================
   ROLES PAGE - With Optimized Refetch
========================================================== */

const Roles = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  // ✅ API hooks with refetch
  const {
    data,
    loading,
    refetch,
  } = useGet("/admin/roles");

  const { deleteData, loading: deleteLoading } = useDelete();

  /* ==========================================
     NORMALIZE DATA
  ========================================== */
  const roles = data?.data || data || [];

  /* ==========================================
     FILTERED ROLES (Memoized)
  ========================================== */
  const filteredRoles = useMemo(() => {
    let result = [...roles];

    // Search filter
    if (search.trim()) {
      result = result.filter((role) =>
        role.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Type filters
    if (selectedType === "admin") {
      result = result.filter((role) =>
        role.name?.toLowerCase().includes("admin")
      );
    }

    if (selectedType === "system") {
      const systemRoles = ["admin", "super admin", "vendor", "user", "customer"];
      result = result.filter((role) =>
        systemRoles.includes(role.name?.toLowerCase())
      );
    }

    if (selectedType === "custom") {
      const systemRoles = ["admin", "super admin", "vendor", "user", "customer"];
      result = result.filter(
        (role) => !systemRoles.includes(role.name?.toLowerCase())
      );
    }

    // Sorting
    const sortFunctions = {
      az: (a, b) => a.name.localeCompare(b.name),
      za: (a, b) => b.name.localeCompare(a.name),
      "permissions-high": (a, b) => (b.permissions?.length || 0) - (a.permissions?.length || 0),
      "permissions-low": (a, b) => (a.permissions?.length || 0) - (b.permissions?.length || 0),
      oldest: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      latest: (a, b) => new Date(b.created_at) - new Date(a.created_at),
    };

    if (sortFunctions[sortBy]) {
      result.sort(sortFunctions[sortBy]);
    }

    return result;
  }, [roles, search, selectedType, sortBy]);

  /* ==========================================
     ✅ OPTIMIZED REFETCH HANDLER
  ========================================== */
  const handleRefetch = useCallback(async (showToast = true) => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await refetch({ force: true });
      if (showToast) {
        toast.success('Roles refreshed successfully');
      }
    } catch (error) {
      console.error('Refetch error:', error);
      if (showToast) {
        toast.error('Failed to refresh roles');
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch, isRefreshing]);

  /* ==========================================
     ACTIONS WITH PROPER REFETCH
  ========================================== */
  const openCreate = () => {
    setSelectedRole(null);
    setOpenModal(true);
  };

  const openEdit = (role) => {
    setSelectedRole(role);
    setOpenModal(true);
  };

  // ✅ Delete with proper refetch and error handling
  const handleDelete = useCallback(async (role) => {
    const ok = window.confirm(`Delete "${role.name}" role?`);
    if (!ok) return;

    try {
      await deleteData({ url: `/admin/roles/${role.id}` });
      toast.success(`Role "${role.name}" deleted successfully`);
      
      // ✅ Wait a moment for DB to process, then refetch
      await new Promise(resolve => setTimeout(resolve, 300));
      await handleRefetch(false);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete role');
    }
  }, [deleteData, handleRefetch]);

  // ✅ Modal success handler with refetch
  const handleModalSuccess = useCallback(async () => {
    await handleRefetch(false);
    setOpenModal(false);
  }, [handleRefetch]);

  // ✅ Reset filters
  const resetFilters = () => {
    setSearch("");
    setSelectedType("");
    setSortBy("latest");
  };

  // ✅ Export roles
  const exportRoles = () => {
    if (filteredRoles.length === 0) {
      toast.error('No roles to export');
      return;
    }

    const rows = filteredRoles.map((role) => ({
      Name: role.name,
      Permissions: role.permissions?.length || 0,
      Created: role.created_at || "",
    }));

    const csv = [
      Object.keys(rows[0]).join(","),
      ...rows.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "roles.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Roles exported successfully');
  };

  /* ==========================================
     UI
  ========================================== */
  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
              <ShieldCheck size={24} className="text-[#7b183f]" />
              Roles Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Create roles and control permissions across the system.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* ✅ Manual Refresh Button */}
            <button
              onClick={() => handleRefetch(true)}
              disabled={isRefreshing || loading}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>

            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#7b183f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
            >
              <Plus size={18} />
              Add Role
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <RoleStats roles={roles} />

      {/* FILTERS */}
      <RoleFilters
        search={search}
        setSearch={setSearch}
        sortBy={sortBy}
        setSortBy={setSortBy}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        roles={roles}
        onReset={resetFilters}
        onExport={exportRoles}
      />

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block">
        <RoleTable
          roles={filteredRoles}
          loading={loading || isRefreshing}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* MOBILE CARDS */}
      <div className="grid gap-4 lg:hidden">
        {loading || isRefreshing ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-44 animate-pulse rounded-3xl bg-slate-200" />
          ))
        ) : filteredRoles.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center text-slate-500 border border-slate-200">
            <ShieldCheck size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-lg font-medium text-slate-700">No roles found</p>
            <p className="text-sm">Try adjusting your filters or create a new role.</p>
          </div>
        ) : (
          filteredRoles.map((role) => (
            <RoleMobileCard
              key={role.id}
              role={role}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* ✅ MODAL with refetch on success */}
      <RoleFormModal
        open={openModal}
        data={selectedRole}
        onClose={() => setOpenModal(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default Roles;