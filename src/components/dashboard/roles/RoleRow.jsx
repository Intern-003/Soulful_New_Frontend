import {
  ShieldCheck,
  Pencil,
  Trash2,
  MoreHorizontal,
  CalendarDays,
  KeyRound,
} from "lucide-react";
import { useState } from "react";

/* ==========================================================
   FILE NAME: RoleRow.jsx

   ROLE ROW
   Elite Production Grade

   Props:
   role
   onEdit(role)
   onDelete(role)
========================================================== */

const RoleRow = ({
  role,
  onEdit = () => {},
  onDelete = () => {},
}) => {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const permissions =
    role?.permissions ||
    [];

  const grouped =
    groupPermissions(
      permissions
    );

  return (
    <tr className="border-b border-slate-100 transition hover:bg-slate-50/70">
      {/* ROLE */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3 min-w-[230px]">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#7b183f]/10 text-[#7b183f]">
            <ShieldCheck
              size={22}
            />
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-slate-900">
              {
                role.name
              }
            </h4>

            <p className="truncate text-xs text-slate-500">
              ID #
              {
                role.id
              }
            </p>
          </div>
        </div>
      </td>

      {/* PERMISSIONS */}
      <td className="px-6 py-4">
        {permissions.length ===
        0 ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
            No Access
          </span>
        ) : (
          <div className="flex flex-wrap gap-2 max-w-[420px]">
            {Object.keys(
              grouped
            )
              .slice(
                0,
                4
              )
              .map(
                (
                  module
                ) => (
                  <span
                    key={
                      module
                    }
                    className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                  >
                    {
                      module
                    }{" "}
                    (
                    {
                      grouped[
                        module
                      ]
                    }
                    )
                  </span>
                )
              )}

            {Object.keys(
              grouped
            ).length >
              4 && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                +
                {Object.keys(
                  grouped
                ).length -
                  4}
              </span>
            )}
          </div>
        )}
      </td>

      {/* TOTAL */}
      <td className="px-6 py-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <KeyRound
            size={14}
          />
          {
            permissions.length
          }
        </div>
      </td>

      {/* CREATED */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
        <div className="inline-flex items-center gap-2">
          <CalendarDays
            size={14}
          />
          {formatDate(
            role.created_at
          )}
        </div>
      </td>

      {/* ACTIONS */}
      <td className="px-6 py-4 text-right">
        <div className="relative inline-block">
          <button
            onClick={() =>
              setMenuOpen(
                !menuOpen
              )
            }
            className="rounded-xl p-2 transition hover:bg-slate-100"
          >
            <MoreHorizontal
              size={18}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              <button
                onClick={() => {
                  setMenuOpen(
                    false
                  );
                  onEdit(
                    role
                  );
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
              >
                <Pencil
                  size={16}
                />
                Edit
              </button>

              <button
                onClick={() => {
                  setMenuOpen(
                    false
                  );
                  onDelete(
                    role
                  );
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-sm text-rose-600 transition hover:bg-rose-50"
              >
                <Trash2
                  size={16}
                />
                Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default RoleRow;

/* ==========================================================
   HELPERS
========================================================== */

function groupPermissions(
  permissions
) {
  const grouped =
    {};

  permissions.forEach(
    (item) => {
      const module =
        item.module ||
        "general";

      if (
        !grouped[
          module
        ]
      ) {
        grouped[
          module
        ] = 0;
      }

      grouped[
        module
      ] += 1;
    }
  );

  return grouped;
}

function formatDate(
  date
) {
  if (!date)
    return "--";

  try {
    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month:
          "short",
        year: "numeric",
      }
    );
  } catch {
    return "--";
  }
}