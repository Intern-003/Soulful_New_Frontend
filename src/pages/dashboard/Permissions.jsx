// FILE: src/pages/dashboard/Permissions.jsx

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  Plus,
} from "lucide-react";

import useGet from "../../api/hooks/useGet";
import usePost from "../../api/hooks/usePost";
import usePut from "../../api/hooks/usePut";
import useDelete from "../../api/hooks/useDelete";

import PermissionStats from "../../components/dashboard/permissions/PermissionStats";
import PermissionFilters from "../../components/dashboard/permissions/PermissionFilters";
import PermissionForm from "../../components/dashboard/permissions/PermissionForm";
import PermissionList from "../../components/dashboard/permissions/PermissionList";
import PermissionModal from "../../components/dashboard/permissions/PermissionModal";

/* ==========================================================
   FILE: Permissions.jsx
   Elite Production Grade

   APIs:
   GET    /admin/permissions
   POST   /admin/permissions
   PUT    /admin/permissions/:id
   DELETE /admin/permissions/:id
========================================================== */

const Permissions = () => {
  const {
    data,
    loading,
    refetch,
  } = useGet(
    "/admin/permissions"
  );

  const {
    postData,
    loading: postLoading,
  } = usePost();

  const {
    putData,
    loading: putLoading,
  } = usePut();

  const {
    deleteData,
    loading: deleteLoading,
  } = useDelete();

  /* ==========================================
     STATE
  ========================================== */
  const [
    search,
    setSearch,
  ] = useState("");

  const [
    selectedModule,
    setSelectedModule,
  ] = useState(
    "all"
  );

  const [
    sortBy,
    setSortBy,
  ] = useState(
    "module_asc"
  );

  const [
    selected,
    setSelected,
  ] = useState(
    null
  );

  const permissions =
    data?.data ||
    data ||
    [];

  /* ==========================================
     FILTER + SORT
  ========================================== */
  const filtered =
    useMemo(() => {
      let list = [
        ...permissions,
      ];

      // search
      if (
        search.trim()
      ) {
        const q =
          search.toLowerCase();

        list =
          list.filter(
            (
              item
            ) =>
              item.module
                ?.toLowerCase()
                .includes(
                  q
                ) ||
              item.action
                ?.toLowerCase()
                .includes(
                  q
                )
          );
      }

      // module
      if (
        selectedModule !==
        "all"
      ) {
        list =
          list.filter(
            (
              item
            ) =>
              item.module ===
              selectedModule
          );
      }

      // sort
      list.sort(
        (
          a,
          b
        ) => {
          if (
            sortBy ===
            "module_asc"
          ) {
            return a.module.localeCompare(
              b.module
            );
          }

          if (
            sortBy ===
            "module_desc"
          ) {
            return b.module.localeCompare(
              a.module
            );
          }

          if (
            sortBy ===
            "action_asc"
          ) {
            return a.action.localeCompare(
              b.action
            );
          }

          return b.action.localeCompare(
            a.action
          );
        }
      );

      return list;
    }, [
      permissions,
      search,
      selectedModule,
      sortBy,
    ]);

  /* ==========================================
     CREATE
  ========================================== */
  const createPermission =
    async (
      payload
    ) => {
      try {
        await postData(
          {
            url: "/admin/permissions",
            data: payload,
          }
        );

        toast.success(
          "Permission created"
        );

        refetch();

        return true;
      } catch (
        error
      ) {
        toast.error(
          "Failed to create permission"
        );

        return false;
      }
    };

  /* ==========================================
     UPDATE
  ========================================== */
  const updatePermission =
    async (
      payload
    ) => {
      try {
        await putData(
          {
            url: `/admin/permissions/${payload.id}`,
            data: {
              module:
                payload.module,
              action:
                payload.action,
            },
          }
        );

        toast.success(
          "Permission updated"
        );

        setSelected(
          null
        );

        refetch();
      } catch (
        error
      ) {
        toast.error(
          "Failed to update permission"
        );
      }
    };

  /* ==========================================
     DELETE
  ========================================== */
  const deletePermission =
    async (
      id
    ) => {
      const ok =
        window.confirm(
          "Delete this permission?"
        );

      if (!ok)
        return;

      try {
        await deleteData(
          {
            url: `/admin/permissions/${id}`,
          }
        );

        toast.success(
          "Permission deleted"
        );

        refetch();
      } catch (
        error
      ) {
        toast.error(
          "Failed to delete permission"
        );
      }
    };

  /* ==========================================
     RESET FILTERS
  ========================================== */
  const resetFilters =
    () => {
      setSearch(
        ""
      );
      setSelectedModule(
        "all"
      );
      setSortBy(
        "module_asc"
      );
    };

  /* ==========================================
     UI
  ========================================== */
  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
              <ShieldCheck
                size={24}
                className="text-[#7a1c3d]"
              />
              Permissions
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage system access rules and actions.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              window.scrollTo(
                {
                  top: 0,
                  behavior:
                    "smooth",
                }
              )
            }
            className="inline-flex items-center gap-2 rounded-2xl bg-[#7a1c3d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#651732]"
          >
            <Plus
              size={18}
            />
            Add Permission
          </button>
        </div>
      </div>

      {/* STATS */}
      <PermissionStats
        permissions={
          permissions
        }
        filteredCount={
          filtered.length
        }
        search={
          search
        }
      />

      {/* FILTERS */}
      <PermissionFilters
        permissions={
          permissions
        }
        search={
          search
        }
        selectedModule={
          selectedModule
        }
        sortBy={
          sortBy
        }
        onSearchChange={
          setSearch
        }
        onModuleChange={
          setSelectedModule
        }
        onSortChange={
          setSortBy
        }
        onReset={
          resetFilters
        }
      />

      {/* CREATE */}
      <PermissionForm
        loading={
          postLoading
        }
        onSubmit={
          createPermission
        }
      />

      {/* LIST */}
      <PermissionList
        permissions={
          filtered
        }
        loading={
          loading
        }
        onEdit={
          setSelected
        }
        onDelete={
          deletePermission
        }
      />

      {/* EDIT MODAL */}
      <PermissionModal
        open={
          !!selected
        }
        data={
          selected
        }
        loading={
          putLoading ||
          deleteLoading
        }
        onClose={() =>
          setSelected(
            null
          )
        }
        onSubmit={
          updatePermission
        }
      />
    </div>
  );
};

export default Permissions;