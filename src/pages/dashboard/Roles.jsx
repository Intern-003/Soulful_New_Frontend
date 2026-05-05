import { useMemo, useState } from "react";
import {
  ShieldCheck,
  Plus,
} from "lucide-react";

import useGet from "../../api/hooks/useGet";
import useDelete from "../../api/hooks/useDelete";

import RoleStats from "../../components/dashboard/roles/RoleStats";
import RoleFilters from "../../components/dashboard/roles/RoleFilters";
import RoleTable from "../../components/dashboard/roles/RoleTable";
import RoleMobileCard from "../../components/dashboard/roles/RoleMobileCard";
import RoleFormModal from "../../components/dashboard/roles/RoleFormModal";

/* ==========================================================
   FILE NAME: Roles.jsx

   ROLES PAGE
   Elite Final Production Grade

   APIs:
   GET    /admin/roles
   POST   /admin/roles
   PUT    /admin/roles/:id
   DELETE /admin/roles/:id
========================================================== */

const Roles = () => {
  const {
    data,
    loading,
    refetch,
  } = useGet(
    "/admin/roles"
  );

  const {
    deleteData,
  } = useDelete();

  /* ==========================================
     STATE
  ========================================== */
  const [
    openModal,
    setOpenModal,
  ] = useState(
    false
  );

  const [
    selectedRole,
    setSelectedRole,
  ] = useState(
    null
  );

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    selectedType,
    setSelectedType,
  ] = useState("");

  const [
    sortBy,
    setSortBy,
  ] = useState(
    "latest"
  );

  /* ==========================================
     NORMALIZE DATA
  ========================================== */
  const roles =
    data?.data ||
    data ||
    [];

  /* ==========================================
     FILTERED ROLES
  ========================================== */
  const filteredRoles =
    useMemo(() => {
      let result = [
        ...roles,
      ];

      /* Search */
      if (
        search.trim()
      ) {
        result =
          result.filter(
            (
              role
            ) =>
              role.name
                ?.toLowerCase()
                .includes(
                  search.toLowerCase()
                )
          );
      }

      /* Type */
      if (
        selectedType ===
        "admin"
      ) {
        result =
          result.filter(
            (
              role
            ) =>
              role.name
                ?.toLowerCase()
                .includes(
                  "admin"
                )
          );
      }

      if (
        selectedType ===
        "system"
      ) {
        const systemRoles =
          [
            "admin",
            "super admin",
            "vendor",
            "user",
            "customer",
          ];

        result =
          result.filter(
            (
              role
            ) =>
              systemRoles.includes(
                role.name?.toLowerCase()
              )
          );
      }

      if (
        selectedType ===
        "custom"
      ) {
        const systemRoles =
          [
            "admin",
            "super admin",
            "vendor",
            "user",
            "customer",
          ];

        result =
          result.filter(
            (
              role
            ) =>
              !systemRoles.includes(
                role.name?.toLowerCase()
              )
          );
      }

      /* Sorting */
      if (
        sortBy ===
        "az"
      ) {
        result.sort(
          (
            a,
            b
          ) =>
            a.name.localeCompare(
              b.name
            )
        );
      }

      if (
        sortBy ===
        "za"
      ) {
        result.sort(
          (
            a,
            b
          ) =>
            b.name.localeCompare(
              a.name
            )
        );
      }

      if (
        sortBy ===
        "permissions-high"
      ) {
        result.sort(
          (
            a,
            b
          ) =>
            (b
              .permissions
              ?.length ||
              0) -
            (a
              .permissions
              ?.length ||
              0)
        );
      }

      if (
        sortBy ===
        "permissions-low"
      ) {
        result.sort(
          (
            a,
            b
          ) =>
            (a
              .permissions
              ?.length ||
              0) -
            (b
              .permissions
              ?.length ||
              0)
        );
      }

      if (
        sortBy ===
        "oldest"
      ) {
        result.sort(
          (
            a,
            b
          ) =>
            new Date(
              a.created_at
            ) -
            new Date(
              b.created_at
            )
        );
      }

      if (
        sortBy ===
        "latest"
      ) {
        result.sort(
          (
            a,
            b
          ) =>
            new Date(
              b.created_at
            ) -
            new Date(
              a.created_at
            )
        );
      }

      return result;
    }, [
      roles,
      search,
      selectedType,
      sortBy,
    ]);

  /* ==========================================
     ACTIONS
  ========================================== */
  const openCreate =
    () => {
      setSelectedRole(
        null
      );
      setOpenModal(
        true
      );
    };

  const openEdit =
    (role) => {
      setSelectedRole(
        role
      );
      setOpenModal(
        true
      );
    };

  const handleDelete =
    async (
      role
    ) => {
      const ok =
        window.confirm(
          `Delete "${role.name}" role?`
        );

      if (!ok)
        return;

      try {
        await deleteData(
          {
            url: `/admin/roles/${role.id}`,
          }
        );

        refetch();
      } catch (error) {
        console.error(
          error
        );
      }
    };

  const resetFilters =
    () => {
      setSearch(
        ""
      );
      setSelectedType(
        ""
      );
      setSortBy(
        "latest"
      );
    };

  const exportRoles =
    () => {
      const rows =
        filteredRoles.map(
          (
            role
          ) => ({
            Name: role.name,
            Permissions:
              role
                .permissions
                ?.length ||
              0,
            Created:
              role.created_at ||
              "",
          })
        );

      if (
        rows.length ===
        0
      )
        return;

      const csv =
        [
          Object.keys(
            rows[0]
          ).join(
            ","
          ),
          ...rows.map(
            (
              row
            ) =>
              Object.values(
                row
              ).join(
                ","
              )
          ),
        ].join(
          "\n"
        );

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
        "roles.csv";
      link.click();

      URL.revokeObjectURL(
        url
      );
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
              <ShieldCheck
                size={24}
                className="text-[#7b183f]"
              />
              Roles
              Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create roles and control permissions across the system.
            </p>
          </div>

          <button
            onClick={
              openCreate
            }
            className="inline-flex items-center gap-2 rounded-2xl bg-[#7b183f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            <Plus
              size={18}
            />
            Add Role
          </button>
        </div>
      </div>

      {/* STATS */}
      <RoleStats
        roles={
          roles
        }
      />

      {/* FILTERS */}
      <RoleFilters
        search={
          search
        }
        setSearch={
          setSearch
        }
        sortBy={
          sortBy
        }
        setSortBy={
          setSortBy
        }
        selectedType={
          selectedType
        }
        setSelectedType={
          setSelectedType
        }
        roles={
          roles
        }
        onReset={
          resetFilters
        }
        onExport={
          exportRoles
        }
      />

      {/* DESKTOP */}
      <div className="hidden lg:block">
        <RoleTable
          roles={
            filteredRoles
          }
          loading={
            loading
          }
          onEdit={
            openEdit
          }
          onDelete={
            handleDelete
          }
        />
      </div>

      {/* MOBILE */}
      <div className="grid gap-4 lg:hidden">
        {loading
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
          : filteredRoles.map(
              (
                role
              ) => (
                <RoleMobileCard
                  key={
                    role.id
                  }
                  role={
                    role
                  }
                  onEdit={
                    openEdit
                  }
                  onDelete={
                    handleDelete
                  }
                />
              )
            )}
      </div>

      {/* MODAL */}
      <RoleFormModal
        open={
          openModal
        }
        data={
          selectedRole
        }
        onClose={() =>
          setOpenModal(
            false
          )
        }
        onSuccess={
          refetch
        }
      />
    </div>
  );
};

export default Roles;