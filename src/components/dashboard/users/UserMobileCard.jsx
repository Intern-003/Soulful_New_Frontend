import { useState } from "react";
import {
  UserCircle2,
  ShieldCheck,
  CalendarDays,
  Eye,
  Trash2,
  Loader2,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Mail,
  ChevronDown,
} from "lucide-react";

import usePut from "../../../api/hooks/usePut";
import usePost from "../../../api/hooks/usePost";

/* ==========================================================
   USER MOBILE CARD
   ELITE PRODUCTION GRADE
   ----------------------------------------------------------
   Props:
   user
   roles
   onRefresh()
   onView(user)
   onDelete(user)
========================================================== */

const UserMobileCard = ({
  user,
  roles = [],
  onRefresh = () => {},
  onView = () => {},
  onDelete = () => {},
}) => {
  const { putData } =
    usePut();

  const { postData } =
    usePost();

  const [loadingStatus, setLoadingStatus] =
    useState(false);

  const [loadingRole, setLoadingRole] =
    useState(false);

  const [menuOpen, setMenuOpen] =
    useState(false);

  /* =====================================
     TOGGLE STATUS
  ===================================== */
  const toggleStatus =
    async () => {
      try {
        setLoadingStatus(
          true
        );

        await putData({
          url: `/admin/users/${user.id}`,
          data: {
            status:
              !isActive(
                user.status
              ),
          },
        });

        onRefresh();
      } catch (error) {
        console.error(
          error
        );
      } finally {
        setLoadingStatus(
          false
        );
      }
    };

  /* =====================================
     CHANGE ROLE
  ===================================== */
  const handleRoleChange =
    async (roleId) => {
      try {
        setLoadingRole(
          true
        );

        await postData({
          url: `/admin/users/${user.id}/assign-role`,
          data: {
            role_id:
              roleId,
          },
        });

        onRefresh();
      } catch (error) {
        console.error(
          error
        );
      } finally {
        setLoadingRole(
          false
        );
      }
    };

  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* =====================================
          TOP
      ===================================== */}
      <div className="flex items-start justify-between gap-3">
        {/* User Info */}
        <div className="flex min-w-0 gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7b183f]/10 to-[#a52355]/10 text-[#7b183f]">
            <UserCircle2
              size={30}
            />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-900">
              {
                user.name
              }
            </h3>

            <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
              <Mail
                size={12}
              />
              <span className="truncate">
                {
                  user.email
                }
              </span>
            </div>

            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              <ShieldCheck
                size={
                  12
                }
              />

              {getRoleName(
                user
              )}
            </div>
          </div>
        </div>

        {/* Menu */}
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
                  onView(
                    user
                  );
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
              >
                <Eye
                  size={16}
                />
                View
              </button>

              <button
                onClick={() => {
                  setMenuOpen(
                    false
                  );
                  onDelete(
                    user
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

      {/* =====================================
          INFO GRID
      ===================================== */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {/* STATUS */}
        <InfoCard label="Status">
          <button
            onClick={
              toggleStatus
            }
            disabled={
              loadingStatus
            }
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
              isActive(
                user.status
              )
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {loadingStatus ? (
              <Loader2
                size={
                  14
                }
                className="animate-spin"
              />
            ) : isActive(
                user.status
              ) ? (
              <CheckCircle2
                size={
                  14
                }
              />
            ) : (
              <XCircle
                size={
                  14
                }
              />
            )}

            {isActive(
              user.status
            )
              ? "Active"
              : "Inactive"}
          </button>
        </InfoCard>

        {/* JOINED */}
        <InfoCard label="Joined">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <CalendarDays
              size={14}
            />

            {formatDate(
              user.created_at
            )}
          </div>
        </InfoCard>
      </div>

      {/* =====================================
          ROLE SELECT
      ===================================== */}
      <div className="mt-4">
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Change Role
        </label>

        <div className="relative">
          <select
            disabled={
              loadingRole
            }
            value={
              user.role
                ?.id ||
              user.role_id ||
              ""
            }
            onChange={(
              e
            ) =>
              handleRoleChange(
                e.target
                  .value
              )
            }
            className="h-11 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-sm outline-none transition focus:border-[#7b183f] focus:ring-4 focus:ring-[#7b183f]/10 disabled:opacity-60"
          >
            <option value="">
              Select Role
            </option>

            {roles.map(
              (
                role
              ) => (
                <option
                  key={
                    role.id
                  }
                  value={
                    role.id
                  }
                >
                  {
                    role.name
                  }
                </option>
              )
            )}
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          {loadingRole && (
            <Loader2
              size={16}
              className="absolute right-9 top-1/2 -translate-y-1/2 animate-spin text-slate-400"
            />
          )}
        </div>
      </div>

      {/* =====================================
          FOOTER BUTTONS
      ===================================== */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={() =>
            onView(
              user
            )
          }
          className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          View
        </button>

        <button
          onClick={() =>
            onDelete(
              user
            )
          }
          className="rounded-2xl bg-[#7b183f] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-95"
        >
          Manage
        </button>
      </div>
    </div>
  );
};

export default UserMobileCard;

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