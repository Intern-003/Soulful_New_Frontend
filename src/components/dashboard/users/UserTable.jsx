import UserRow from "./UserRow";
import {
  Users,
  Loader2,
} from "lucide-react";

/* ==========================================================
   USER TABLE
   Corrected Elite Production Grade

   Props:
   users
   roles
   loading
   onRefresh()
   onView(user)
   onDelete(user)
========================================================== */

const UserTable = ({
  users = [],
  roles = [],
  loading = false,
  onRefresh = () => {},
  onView = () => {},
  onDelete = () => {},
}) => {
  /* ==========================================
     MAIN CARD
  ========================================== */
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Top Header */}
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Users List
            </h3>

            <p className="text-sm text-slate-500">
              Manage roles, permissions and user access.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            <Users
              size={16}
            />
            {users.length}{" "}
            Users
          </div>
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="min-w-[980px] w-full">
          <TableHeader />

          <tbody className="divide-y divide-slate-100">
            {/* LOADING */}
            {loading &&
              Array.from({
                length: 6,
              }).map(
                (
                  _,
                  index
                ) => (
                  <tr
                    key={
                      index
                    }
                    className="animate-pulse"
                  >
                    <td className="px-6 py-4">
                      <div className="h-11 rounded-2xl bg-slate-200" />
                    </td>

                    <td className="px-6 py-4">
                      <div className="h-11 rounded-2xl bg-slate-200" />
                    </td>

                    <td className="px-6 py-4">
                      <div className="h-11 rounded-2xl bg-slate-200" />
                    </td>

                    <td className="px-6 py-4">
                      <div className="h-11 rounded-2xl bg-slate-200" />
                    </td>

                    <td className="px-6 py-4">
                      <div className="h-11 rounded-2xl bg-slate-200" />
                    </td>
                  </tr>
                )
              )}

            {/* DATA */}
            {!loading &&
              users.length >
                0 &&
              users.map(
                (
                  user
                ) => (
                  <UserRow
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
                      onRefresh
                    }
                    onView={
                      onView
                    }
                    onDelete={
                      onDelete
                    }
                  />
                )
              )}

            {/* EMPTY */}
            {!loading &&
              users.length ===
                0 && (
                <tr>
                  <td
                    colSpan={
                      5
                    }
                    className="px-6 py-16 text-center"
                  >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#7b183f]/10 text-[#7b183f]">
                      <Users
                        size={
                          30
                        }
                      />
                    </div>

                    <h3 className="mt-5 text-xl font-semibold text-slate-900">
                      No Users
                      Found
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Try changing
                      filters or
                      search query.
                    </p>
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;

/* ==========================================================
   TABLE HEADER
========================================================== */

const TableHeader =
  () => {
    return (
      <thead className="sticky top-0 z-10 bg-slate-50">
        <tr className="border-b border-slate-200">
          <Th>
            User
          </Th>

          <Th>
            Role
          </Th>

          <Th>
            Status
          </Th>

          <Th>
            Joined
          </Th>

          <Th align="right">
            Actions
          </Th>
        </tr>
      </thead>
    );
  };

const Th = ({
  children,
  align = "left",
}) => {
  const alignClass =
    align ===
    "right"
      ? "text-right"
      : "text-left";

  return (
    <th
      className={`whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 ${alignClass}`}
    >
      {children}
    </th>
  );
};