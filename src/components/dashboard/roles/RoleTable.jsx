import RoleRow from "./RoleRow";
import {
  ShieldCheck,
  Loader2,
} from "lucide-react";

/* ==========================================================
   FILE NAME: RoleTable.jsx

   ROLE TABLE
   Elite Production Grade

   Props:
   roles = []
   loading = false
   onEdit(role)
   onDelete(role)
========================================================== */

const RoleTable = ({
  roles = [],
  loading = false,
  onEdit = () => {},
  onDelete = () => {},
}) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* TOP HEADER */}
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Roles List
            </h3>

            <p className="text-sm text-slate-500">
              Manage role access and permission groups.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            <ShieldCheck
              size={16}
            />
            {roles.length}{" "}
            Roles
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full">
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
                    {Array.from(
                      {
                        length: 5,
                      }
                    ).map(
                      (
                        __,
                        i
                      ) => (
                        <td
                          key={
                            i
                          }
                          className="px-6 py-4"
                        >
                          <div className="h-11 rounded-2xl bg-slate-200" />
                        </td>
                      )
                    )}
                  </tr>
                )
              )}

            {/* DATA */}
            {!loading &&
              roles.length >
                0 &&
              roles.map(
                (
                  role
                ) => (
                  <RoleRow
                    key={
                      role.id
                    }
                    role={
                      role
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

            {/* EMPTY */}
            {!loading &&
              roles.length ===
                0 && (
                <tr>
                  <td
                    colSpan={
                      5
                    }
                    className="px-6 py-16 text-center"
                  >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#7b183f]/10 text-[#7b183f]">
                      <ShieldCheck
                        size={
                          30
                        }
                      />
                    </div>

                    <h3 className="mt-5 text-xl font-semibold text-slate-900">
                      No Roles
                      Found
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Create a
                      new role
                      to manage
                      permissions.
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

export default RoleTable;

/* ==========================================================
   TABLE HEADER
========================================================== */

const TableHeader =
  () => {
    return (
      <thead className="sticky top-0 z-10 bg-slate-50">
        <tr className="border-b border-slate-200">
          <Th>
            Role
          </Th>

          <Th>
            Modules
          </Th>

          <Th>
            Access
          </Th>

          <Th>
            Created
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