import { useMemo } from "react";
import {
  CheckSquare,
  Square,
  ShieldCheck,
  Search,
  Layers3,
} from "lucide-react";

import useGet from "../../../api/hooks/useGet";

/* ==========================================================
   FILE NAME: PermissionSelectorElite.jsx

   PERMISSION SELECTOR
   Elite Production Grade

   Props:
   selected = []
   onChange(ids)

   Backend API:
   GET /admin/permissions
========================================================== */

const PermissionSelectorElite = ({
  selected = [],
  onChange = () => {},
}) => {
  const {
    data,
    loading,
  } = useGet(
    "/admin/permissions"
  );

  const permissions =
    data?.data ||
    data ||
    [];

  /* ==========================================
     GROUP PERMISSIONS
  ========================================== */
  const grouped =
    useMemo(() => {
      const result =
        {};

      permissions.forEach(
        (
          perm
        ) => {
          const module =
            perm.module ||
            "general";

          if (
            !result[
              module
            ]
          ) {
            result[
              module
            ] = [];
          }

          result[
            module
          ].push(
            perm
          );
        }
      );

      return result;
    }, [
      permissions,
    ]);

  /* ==========================================
     TOGGLE SINGLE
  ========================================== */
  const togglePermission =
    (id) => {
      if (
        selected.includes(
          id
        )
      ) {
        onChange(
          selected.filter(
            (
              item
            ) =>
              item !==
              id
          )
        );
      } else {
        onChange([
          ...selected,
          id,
        ]);
      }
    };

  /* ==========================================
     TOGGLE MODULE
  ========================================== */
  const toggleModule =
    (
      modulePerms
    ) => {
      const ids =
        modulePerms.map(
          (
            item
          ) =>
            item.id
        );

      const allSelected =
        ids.every(
          (
            id
          ) =>
            selected.includes(
              id
            )
        );

      if (
        allSelected
      ) {
        onChange(
          selected.filter(
            (
              id
            ) =>
              !ids.includes(
                id
              )
          )
        );
      } else {
        onChange(
          [
            ...new Set(
              [
                ...selected,
                ...ids,
              ]
            ),
          ]
        );
      }
    };

  /* ==========================================
     SELECT ALL
  ========================================== */
  const toggleAll =
    () => {
      const allIds =
        permissions.map(
          (
            item
          ) =>
            item.id
        );

      const allSelected =
        allIds.every(
          (
            id
          ) =>
            selected.includes(
              id
            )
        );

      if (
        allSelected
      ) {
        onChange(
          []
        );
      } else {
        onChange(
          allIds
        );
      }
    };

  /* ==========================================
     LOADING
  ========================================== */
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({
          length: 4,
        }).map(
          (
            _,
            index
          ) => (
            <div
              key={
                index
              }
              className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5"
            >
              <div className="h-5 w-40 rounded bg-slate-200" />

              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                {Array.from({
                  length: 8,
                }).map(
                  (
                    __,
                    i
                  ) => (
                    <div
                      key={
                        i
                      }
                      className="h-10 rounded-2xl bg-slate-200"
                    />
                  )
                )}
              </div>
            </div>
          )
        )}
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* TOP HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Permissions
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Select modules and assign access rights.
          </p>
        </div>

        <button
          type="button"
          onClick={
            toggleAll
          }
          className="inline-flex items-center gap-2 rounded-2xl bg-[#7b183f] px-4 py-2 text-sm font-medium text-white transition hover:opacity-95"
        >
          <ShieldCheck
            size={16}
          />

          {permissions.length >
            0 &&
          selected.length ===
            permissions.length
            ? "Unselect All"
            : "Select All"}
        </button>
      </div>

      {/* SUMMARY */}
      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
        <SummaryCard
          title="Modules"
          value={Object.keys(
            grouped
          ).length}
        />

        <SummaryCard
          title="Permissions"
          value={
            permissions.length
          }
        />

        <SummaryCard
          title="Selected"
          value={
            selected.length
          }
        />

        <SummaryCard
          title="Coverage"
          value={`${Math.round(
            permissions.length
              ? (selected.length /
                  permissions.length) *
                  100
              : 0
          )}%`}
        />
      </div>

      {/* MODULES */}
      <div className="mt-6 space-y-5 max-h-[520px] overflow-y-auto pr-1">
        {Object.keys(
          grouped
        ).map(
          (
            module
          ) => {
            const modulePerms =
              grouped[
                module
              ];

            const ids =
              modulePerms.map(
                (
                  item
                ) =>
                  item.id
              );

            const allSelected =
              ids.every(
                (
                  id
                ) =>
                  selected.includes(
                    id
                  )
              );

            return (
              <div
                key={
                  module
                }
                className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
              >
                {/* Module Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#7b183f]/10 text-[#7b183f]">
                      <Layers3
                        size={
                          18
                        }
                      />
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
                        {
                          module
                        }
                      </h4>

                      <p className="text-xs text-slate-500">
                        {
                          modulePerms.length
                        }{" "}
                        permissions
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      toggleModule(
                        modulePerms
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    {allSelected ? (
                      <CheckSquare
                        size={
                          15
                        }
                      />
                    ) : (
                      <Square
                        size={
                          15
                        }
                      />
                    )}

                    {allSelected
                      ? "Unselect All"
                      : "Select All"}
                  </button>
                </div>

                {/* Actions */}
                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                  {modulePerms.map(
                    (
                      perm
                    ) => {
                      const checked =
                        selected.includes(
                          perm.id
                        );

                      return (
                        <button
                          key={
                            perm.id
                          }
                          type="button"
                          onClick={() =>
                            togglePermission(
                              perm.id
                            )
                          }
                          className={`flex items-center gap-2 rounded-2xl border px-3 py-3 text-sm font-medium transition ${
                            checked
                              ? "border-[#7b183f] bg-[#7b183f] text-white shadow-sm"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {checked ? (
                            <CheckSquare
                              size={
                                16
                              }
                            />
                          ) : (
                            <Square
                              size={
                                16
                              }
                            />
                          )}

                          <span className="capitalize">
                            {perm.action ||
                              perm.name}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default PermissionSelectorElite;

/* ==========================================================
   SUB COMPONENTS
========================================================== */

const SummaryCard = ({
  title,
  value,
}) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {title}
    </p>

    <h4 className="mt-2 text-2xl font-bold text-slate-900">
      {value}
    </h4>
  </div>
);