import { useEffect, useMemo, useState, useCallback } from "react";
import { Users as UsersIcon, RefreshCw, Plus } from "lucide-react";

import useGet from "../../api/hooks/useGet";
import useDelete from "../../api/hooks/useDelete";
import toast from "react-hot-toast";

import UserStats from "../../components/dashboard/users/UserStats";
import UserFilters from "../../components/dashboard/users/UserFilters";
import UserTable from "../../components/dashboard/users/UserTable";
import UserMobileCard from "../../components/dashboard/users/UserMobileCard";
import UserDetailsModal from "../../components/dashboard/users/UserDetailsModal";

/* ==========================================================
   USERS PAGE - With Optimized Refetch
========================================================== */

const Users = () => {
  // ✅ State
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ✅ API Hooks
  const {
    data: usersRes,
    loading: usersLoading,
    refetch: refetchUsers,
  } = useGet("/admin/users-with-roles");

  const {
    data: rolesRes,
    refetch: refetchRoles,
  } = useGet("/admin/roles");

  const { deleteData, loading: deleteLoading } = useDelete();

  /* ==========================================
     NORMALIZE DATA
  ========================================== */
  const users = usersRes?.data || usersRes || [];
  const roles = rolesRes?.data || rolesRes || [];

  /* ==========================================
     ✅ OPTIMIZED REFETCH HANDLER
  ========================================== */
  const handleRefetch = useCallback(async (showToast = true) => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchUsers({ force: true }),
        refetchRoles({ force: true }),
      ]);
      if (showToast) {
        toast.success('Users refreshed successfully');
      }
    } catch (error) {
      console.error('Refetch error:', error);
      if (showToast) {
        toast.error('Failed to refresh users');
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchUsers, refetchRoles, isRefreshing]);

  /* ==========================================
     FILTER USERS
  ========================================== */
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        selectedRole === "" ||
        String(user.role?.id || user.role_id) === String(selectedRole);

      const matchesStatus =
        selectedStatus === "" ||
        (selectedStatus === "active" && isActive(user.status)) ||
        (selectedStatus === "inactive" && !isActive(user.status));

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, selectedRole, selectedStatus]);

  /* ==========================================
     ✅ DELETE USER WITH REFETCH
  ========================================== */
  const handleDelete = useCallback(async (user) => {
    const ok = window.confirm(`Delete user "${user.name}"?`);
    if (!ok) return;

    try {
      await deleteData({ url: `/admin/users/${user.id}` });
      toast.success(`User "${user.name}" deleted successfully`);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      await handleRefetch(false);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete user');
    }
  }, [deleteData, handleRefetch]);

  /* ==========================================
     ✅ VIEW USER
  ========================================== */
  const handleView = useCallback((user) => {
    setSelectedUser(user);
    setModalOpen(true);
  }, []);

  /* ==========================================
     ✅ CREATE/EDIT USER (Disabled - No Form Modal)
  ========================================== */
  const handleCreate = useCallback(() => {
    // ✅ Fixed: Use toast.success instead of toast.info
    toast.success('Create user functionality coming soon! 📝');
    // setSelectedUser(null);
    // setFormModalOpen(true);
  }, []);

  const handleEdit = useCallback((user) => {
    // ✅ Fixed: Use toast.success instead of toast.info
    toast.success('Edit user functionality coming soon! 📝');
    // setSelectedUser(user);
    // setFormModalOpen(true);
  }, []);

  /* ==========================================
     ✅ MODAL SUCCESS HANDLER
  ========================================== */
  const handleModalSuccess = useCallback(async () => {
    await handleRefetch(false);
    setFormModalOpen(false);
  }, [handleRefetch]);

  /* ==========================================
     RESET FILTERS
  ========================================== */
  const resetFilters = useCallback(() => {
    setSearch("");
    setSelectedRole("");
    setSelectedStatus("");
  }, []);

  /* ==========================================
     EXPORT CSV
  ========================================== */
  const exportUsers = useCallback(() => {
    if (filteredUsers.length === 0) {
      toast.error('No users to export');
      return;
    }

    const rows = filteredUsers.map((user) => ({
      Name: user.name,
      Email: user.email,
      Role: getRoleName(user),
      Status: isActive(user.status) ? "Active" : "Inactive",
    }));

    const csv = [
      Object.keys(rows[0]).join(","),
      ...rows.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "users.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Users exported successfully');
  }, [filteredUsers]);

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
              <UsersIcon size={24} className="text-[#7b183f]" />
              Users Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage all registered users, roles and permissions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* ✅ Manual Refresh Button */}
            <button
              onClick={() => handleRefetch(true)}
              disabled={isRefreshing || usersLoading}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>

            {/* ✅ User Count Badge */}
            <div className="rounded-2xl bg-[#7b183f]/10 px-4 py-3 text-sm font-semibold text-[#7b183f]">
              {filteredUsers.length} Users
            </div>

            {/* ✅ Add User Button (temporarily shows toast) */}
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#7b183f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
            >
              <Plus size={18} />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <UserStats users={users} />

      {/* FILTERS */}
      <UserFilters
        search={search}
        setSearch={setSearch}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        roles={roles}
        onReset={resetFilters}
        onExport={exportUsers}
      />

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block">
        <UserTable
          users={filteredUsers}
          roles={roles}
          loading={usersLoading || isRefreshing}
          onRefresh={handleRefetch}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* MOBILE CARDS */}
      <div className="grid gap-4 lg:hidden">
        {usersLoading || isRefreshing ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-44 animate-pulse rounded-3xl bg-slate-200" />
          ))
        ) : filteredUsers.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center text-slate-500 border border-slate-200">
            <UsersIcon size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-lg font-medium text-slate-700">No users found</p>
            <p className="text-sm">Try adjusting your filters or add a new user.</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <UserMobileCard
              key={user.id}
              user={user}
              roles={roles}
              onRefresh={handleRefetch}
              onView={handleView}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* DETAILS MODAL */}
      <UserDetailsModal
        open={modalOpen}
        user={selectedUser}
        onClose={() => setModalOpen(false)}
        onRefresh={handleRefetch}
      />

      {/* ✅ USER FORM MODAL (Disabled - Component doesn't exist yet) */}
      {/* {formModalOpen && (
        <UserFormModal
          open={formModalOpen}
          user={selectedUser}
          roles={roles}
          onClose={() => setFormModalOpen(false)}
          onSuccess={handleModalSuccess}
        />
      )} */}
    </div>
  );
};

export default Users;

/* ==========================================================
   HELPERS
========================================================== */

function isActive(status) {
  return (
    status === true ||
    status === 1 ||
    status === "1" ||
    status === "active"
  );
}

function getRoleName(user) {
  return user?.role?.name || user?.role || "No Role";
}