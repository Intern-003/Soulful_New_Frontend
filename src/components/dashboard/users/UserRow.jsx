import { useState } from "react";
import {
  UserCircle2,
  ShieldCheck,
  Loader2,
  MoreHorizontal,
  Eye,
  Trash2,
} from "lucide-react";

import usePut from "../../../api/hooks/usePut";
import usePost from "../../../api/hooks/usePost";

/* ==========================================================
   USER ROW
   Elite Production Grade

   Props:
   user
   roles
   onRefresh()
   onView(user)
   onDelete(user)
========================================================== */

const UserRow = ({
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

  /* ==========================================
     TOGGLE STATUS
  ========================================== */
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
          "Status update failed",
          error
        );
      } finally {
        setLoadingStatus(
          false
        );
      }
    };

  /* ==========================================
     CHANGE ROLE
  ========================================== */
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
          "Role update failed",
          error
        );
      } finally {
        setLoadingRole(
          false
        );
      }
    };

  return (
    <tr className="border-b border-slate-100 transition hover:bg-slate-50/70">
      {/* USER */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3 min-w-[240px]">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#7b183f]/10 text-[#7b183f]">
            <UserCircle2
              size={26}
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {
                user.name
              }
            </p>

            <p className="truncate text-xs text-slate-500">
              {
                user.email
              }
            </p>
          </div>
        </div>
      </td>

      {/* ROLE */}
      <td className="px-6 py-4">
        <div className="relative min-w-[180px]">
          <ShieldCheck
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

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
            className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm outline-none transition focus:border-[#7b183f] focus:ring-4 focus:ring-[#7b183f]/10 disabled:opacity-60"
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

          {loadingRole && (
            <Loader2
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-slate-400"
            />
          )}
        </div>
      </td>

      {/* STATUS */}
      <td className="px-6 py-4">
        <button
          onClick={
            toggleStatus
          }
          disabled={
            loadingStatus
          }
          className={`inline-flex min-w-[110px] items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
            isActive(
              user.status
            )
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              : "bg-rose-100 text-rose-700 hover:bg-rose-200"
          } disabled:opacity-60`}
        >
          {loadingStatus ? (
            <Loader2
              size={14}
              className="animate-spin"
            />
          ) : null}

          {isActive(
            user.status
          )
            ? "Active"
            : "Inactive"}
        </button>
      </td>

      {/* JOINED DATE */}
      <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
        {formatDate(
          user.created_at
        )}
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
      </td>
    </tr>
  );
};

export default UserRow;

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