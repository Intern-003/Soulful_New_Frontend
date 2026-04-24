import { useEffect, useMemo, useState } from "react";
import { Users as UsersIcon } from "lucide-react";

import useGet from "../../api/hooks/useGet";

import UserStats from "../../components/dashboard/users/UserStats";
import UserFilters from "../../components/dashboard/users/UserFilters";
import UserTable from "../../components/dashboard/users/UserTable";
import UserMobileCard from "../../components/dashboard/users/UserMobileCard";
import UserDetailsModal from "../../components/dashboard/users/UserDetailsModal";

/* ==========================================================
   USERS PAGE
   Elite Final Production Grade

   APIs Used:
   GET /admin/users
   GET /admin/roles
========================================================== */

const Users = () => {
const {
  data: usersRes,
  loading: usersLoading,
  refetch: refetchUsers,
} = useGet("/admin/users-with-roles");

const {
  data: rolesRes,
} = useGet("/admin/roles");

  const [search, setSearch] =
    useState("");

  const [
    selectedRole,
    setSelectedRole,
  ] = useState("");

  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState("");

  const [
    selectedUser,
    setSelectedUser,
  ] = useState(null);

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  /* ==========================================
     NORMALIZE DATA
  ========================================== */
  const users =
    usersRes?.data ||
    usersRes ||
    [];

  const roles =
    rolesRes?.data ||
    rolesRes ||
    [];

  /* ==========================================
     FILTER USERS
  ========================================== */
  const filteredUsers =
    useMemo(() => {
      return users.filter(
        (user) => {
          const matchesSearch =
            user.name
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            user.email
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesRole =
            selectedRole ===
              "" ||
            String(
              user.role
                ?.id ||
                user.role_id
            ) ===
              String(
                selectedRole
              );

          const matchesStatus =
            selectedStatus ===
              "" ||
            (selectedStatus ===
              "active" &&
              isActive(
                user.status
              )) ||
            (selectedStatus ===
              "inactive" &&
              !isActive(
                user.status
              ));

          return (
            matchesSearch &&
            matchesRole &&
            matchesStatus
          );
        }
      );
    }, [
      users,
      search,
      selectedRole,
      selectedStatus,
    ]);

  /* ==========================================
     RESET FILTERS
  ========================================== */
  const resetFilters =
    () => {
      setSearch("");
      setSelectedRole(
        ""
      );
      setSelectedStatus(
        ""
      );
    };

  /* ==========================================
     EXPORT CSV
  ========================================== */
  const exportUsers =
    () => {
      const rows =
        filteredUsers.map(
          (
            user
          ) => ({
            Name: user.name,
            Email:
              user.email,
            Role: getRoleName(
              user
            ),
            Status:
              isActive(
                user.status
              )
                ? "Active"
                : "Inactive",
          })
        );

      const csv =
        [
          Object.keys(
            rows[0] ||
              {}
          ).join(","),
          ...rows.map(
            (
              row
            ) =>
              Object.values(
                row
              ).join(",")
          ),
        ].join("\n");

      const blob =
        new Blob(
          [csv],
          {
            type: "text/csv",
          }
        );

      const url =
        URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href = url;
      link.download =
        "users.csv";
      link.click();

      URL.revokeObjectURL(
        url
      );
    };

  /* ==========================================
     VIEW USER
  ========================================== */
  const handleView =
    (user) => {
      setSelectedUser(
        user
      );
      setModalOpen(
        true
      );
    };

  /* ==========================================
     DELETE PLACEHOLDER
  ========================================== */
  const handleDelete =
    (user) => {
      alert(
        `Delete user: ${user.name}`
      );
    };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
              <UsersIcon
                size={24}
                className="text-[#7b183f]"
              />
              Users
              Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage all
              registered
              users,
              roles and
              permissions.
            </p>
          </div>

          <div className="rounded-2xl bg-[#7b183f]/10 px-4 py-2 text-sm font-semibold text-[#7b183f]">
            {
              filteredUsers.length
            }{" "}
            Users
          </div>
        </div>
      </div>

      {/* STATS */}
      <UserStats
        users={users}
      />

      {/* FILTERS */}
      <UserFilters
        search={search}
        setSearch={
          setSearch
        }
        selectedRole={
          selectedRole
        }
        setSelectedRole={
          setSelectedRole
        }
        selectedStatus={
          selectedStatus
        }
        setSelectedStatus={
          setSelectedStatus
        }
        roles={roles}
        onReset={
          resetFilters
        }
        onExport={
          exportUsers
        }
      />

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block">
        <UserTable
          users={
            filteredUsers
          }
          roles={roles}
          loading={
            usersLoading
          }
          onRefresh={
            refetchUsers
          }
          onView={
            handleView
          }
          onDelete={
            handleDelete
          }
        />
      </div>

      {/* MOBILE CARDS */}
      <div className="grid gap-4 lg:hidden">
        {usersLoading
          ? Array.from({
              length: 5,
            }).map(
              (
                _,
                index
              ) => (
                <div
                  key={
                    index
                  }
                  className="h-44 animate-pulse rounded-3xl bg-slate-200"
                />
              )
            )
          : filteredUsers.map(
              (
                user
              ) => (
                <UserMobileCard
                  key={
                    user.id
                  }
                  user={
                    user
                  }
                  roles={
                    roles
                  }
                  onRefresh={
                    refetchUsers
                  }
                  onView={
                    handleView
                  }
                  onDelete={
                    handleDelete
                  }
                />
              )
            )}
      </div>

      {/* DETAILS MODAL */}
      <UserDetailsModal
        open={
          modalOpen
        }
        user={
          selectedUser
        }
        onClose={() =>
          setModalOpen(
            false
          )
        }
      />
    </div>
  );
};

export default Users;

/* ==========================================================
   HELPERS
========================================================== */

function isActive(
  status
) {
  return (
    status === true ||
    status === 1 ||
    status === "1" ||
    status ===
      "active"
  );
}

function getRoleName(
  user
) {
  return (
    user?.role
      ?.name ||
    user?.role ||
    "No Role"
  );
}