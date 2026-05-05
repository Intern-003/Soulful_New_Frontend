// FILE: src/components/dashboard/permissions/PermissionList.jsx

import React, {
  memo,
  useMemo,
  useState,
} from "react";
import {
  ChevronDown,
  ChevronUp,
  FolderKanban,
  ShieldCheck,
} from "lucide-react";

import PermissionItem from "./PermissionItem";

/* ==========================================================
   PERMISSION LIST
   Elite Production Grade

   Props:
   permissions = []
   loading = false
   onEdit(perm)
   onDelete(id)
========================================================== */

const SkeletonCard = () => (
  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-slate-200" />
        <div className="flex-1">
          <div className="h-4 w-36 rounded bg-slate-200" />
          <div className="mt-2 h-3 w-20 rounded bg-slate-100" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({
          length: 3,
        }).map(
          (
            _,
            i
          ) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-slate-100"
            />
          )
        )}
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-100">
      <ShieldCheck
        size={28}
        className="text-slate-800"
      />
    </div>

    <h3 className="mt-5 text-xl font-semibold text-slate-900">
      No Permissions Found
    </h3>

    <p className="mt-2 text-sm text-slate-500">
      Create permissions like products.view or orders.create.
    </p>
  </div>
);

const ModuleBlock = ({
  module,
  items,
  onEdit,
  onDelete,
}) => {
  const [
    open,
    setOpen,
  ] = useState(
    true
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* HEADER */}
      <button
        type="button"
        onClick={() =>
          setOpen(
            !open
          )
        }
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100">
            <FolderKanban
              size={20}
              className="text-slate-800"
            />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-slate-900">
              {module}
            </h3>

            <p className="text-sm text-slate-500">
              {
                items.length
              }{" "}
              permission
              {items.length !==
              1
                ? "s"
                : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {
              items.length
            }
          </span>

          {open ? (
            <ChevronUp
              size={18}
              className="text-slate-500"
            />
          ) : (
            <ChevronDown
              size={18}
              className="text-slate-500"
            />
          )}
        </div>
      </button>

      {/* BODY */}
      {open && (
        <div className="border-t border-slate-100 p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map(
              (
                perm
              ) => (
                <PermissionItem
                  key={
                    perm.id
                  }
                  perm={
                    perm
                  }
                  onEdit={
                    onEdit
                  }
                  onDelete={
                    onDelete
                  }
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const PermissionList = ({
  permissions = [],
  loading = false,
  onEdit,
  onDelete,
}) => {
  const grouped =
    useMemo(() => {
      const map =
        {};

      permissions.forEach(
        (
          item
        ) => {
          const key =
            item.module ||
            "general";

          if (
            !map[
              key
            ]
          ) {
            map[
              key
            ] = [];
          }

          map[
            key
          ].push(
            item
          );
        }
      );

      return Object.entries(
        map
      ).sort(
        (
          a,
          b
        ) =>
          a[0].localeCompare(
            b[0]
          )
      );
    }, [
      permissions,
    ]);

  if (loading) {
    return (
      <section className="space-y-4">
        {Array.from({
          length: 3,
        }).map(
          (
            _,
            i
          ) => (
            <SkeletonCard
              key={i}
            />
          )
        )}
      </section>
    );
  }

  if (
    permissions.length ===
    0
  ) {
    return <EmptyState />;
  }

  return (
    <section className="space-y-4">
      {grouped.map(
        ([
          module,
          items,
        ]) => (
          <ModuleBlock
            key={
              module
            }
            module={
              module
            }
            items={
              items
            }
            onEdit={
              onEdit
            }
            onDelete={
              onDelete
            }
          />
        )
      )}
    </section>
  );
};

export default memo(
  PermissionList
);