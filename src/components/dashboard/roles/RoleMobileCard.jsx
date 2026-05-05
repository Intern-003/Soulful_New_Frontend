import { useState } from "react";
import {
  ShieldCheck,
  KeyRound,
  CalendarDays,
  Pencil,
  Trash2,
  MoreVertical,
  ChevronRight,
} from "lucide-react";

/* ==========================================================
   FILE NAME: RoleMobileCard.jsx

   ROLE MOBILE CARD
   Elite Production Grade

   Props:
   role
   onEdit(role)
   onDelete(role)
========================================================== */

const RoleMobileCard = ({
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

  const modules =
    Object.keys(
      grouped
    );

  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* TOP */}
      <div className="flex items-start justify-between gap-3">
        {/* Role Identity */}
        <div className="flex min-w-0 gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7b183f]/10 to-[#a52355]/10 text-[#7b183f]">
            <ShieldCheck
              size={28}
            />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-900">
              {
                role.name
              }
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Role ID #
              {
                role.id
              }
            </p>

            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              <KeyRound
                size={
                  12
                }
              />
              {
                permissions.length
              }{" "}
              Permissions
            </div>
          </div>
        </div>

        {/* MENU */}
        <div className="relative shrink-0">
          <button
            onClick={() =>
              setMenuOpen(
                !menuOpen
              )
            }
            className="rounded-xl p-2 transition hover:bg-slate-100"
          >
            <MoreVertical
              size={18}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 z-20 w-40 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
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
      </div>

      {/* INFO GRID */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {/* MODULES */}
        <InfoCard label="Modules">
          <div className="text-sm font-semibold text-slate-900">
            {
              modules.length
            }
          </div>
        </InfoCard>

        {/* CREATED */}
        <InfoCard label="Created">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <CalendarDays
              size={14}
            />

            {formatDate(
              role.created_at
            )}
          </div>
        </InfoCard>
      </div>

      {/* MODULE TAGS */}
      <div className="mt-4">
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Access Modules
        </label>

        <div className="flex flex-wrap gap-2">
          {modules
            .slice(
              0,
              5
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

          {modules.length >
            5 && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              +
              {modules.length -
                5}
            </span>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={() =>
            onEdit(
              role
            )
          }
          className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Edit
        </button>

        <button
          onClick={() =>
            onDelete(
              role
            )
          }
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#7b183f] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-95"
        >
          Manage
          <ChevronRight
            size={16}
          />
        </button>
      </div>
    </div>
  );
};

export default RoleMobileCard;

/* ==========================================================
   SUB COMPONENT
========================================================== */

const InfoCard = ({
  label,
  children,
}) => (
  <div className="rounded-2xl bg-slate-50 p-3">
    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
      {label}
    </p>

    <div className="mt-2">
      {children}
    </div>
  </div>
);

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