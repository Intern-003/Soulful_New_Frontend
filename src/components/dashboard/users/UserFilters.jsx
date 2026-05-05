import { useMemo } from "react";
import {
  Search,
  RotateCcw,
  Download,
  Filter,
  Shield,
  CheckCircle2,
} from "lucide-react";

/* ==========================================================
   USER FILTERS
   Elite Production Grade
   ----------------------------------------------------------
   Props:
   search              string
   setSearch           function

   selectedRole        string|number
   setSelectedRole     function

   selectedStatus      string
   setSelectedStatus   function

   roles               array

   onReset             function
   onExport            function
========================================================== */

const UserFilters = ({
  search = "",
  setSearch = () => {},

  selectedRole = "",
  setSelectedRole = () => {},

  selectedStatus = "",
  setSelectedStatus = () => {},

  roles = [],

  onReset = () => {},
  onExport = () => {},
}) => {
  const safeRoles = useMemo(
    () =>
      Array.isArray(roles)
        ? roles
        : [],
    [roles]
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
      {/* Top Row */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        {/* Left */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            User Filters
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Search, sort and manage users quickly.
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onReset}
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            onClick={onExport}
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#7b183f] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-95"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Filter Grid */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Search */}
        <FilterBox label="Search User">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Name or email..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-[#7b183f] focus:bg-white focus:ring-4 focus:ring-[#7b183f]/10"
            />
          </div>
        </FilterBox>

        {/* Role Filter */}
        <FilterBox label="Role">
          <div className="relative">
            <Shield
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={
                selectedRole
              }
              onChange={(e) =>
                setSelectedRole(
                  e.target.value
                )
              }
              className="h-11 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-[#7b183f] focus:bg-white focus:ring-4 focus:ring-[#7b183f]/10"
            >
              <option value="">
                All Roles
              </option>

              {safeRoles.map(
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
          </div>
        </FilterBox>

        {/* Status Filter */}
        <FilterBox label="Status">
          <div className="relative">
            <CheckCircle2
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={
                selectedStatus
              }
              onChange={(e) =>
                setSelectedStatus(
                  e.target.value
                )
              }
              className="h-11 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-[#7b183f] focus:bg-white focus:ring-4 focus:ring-[#7b183f]/10"
            >
              <option value="">
                All Status
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </div>
        </FilterBox>

        {/* Live Summary */}
        <FilterBox label="Quick Summary">
          <div className="flex h-11 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-600">
            Filters applied instantly
          </div>
        </FilterBox>
      </div>
    </div>
  );
};

export default UserFilters;

/* ==========================================================
   REUSABLE BOX
========================================================== */

const FilterBox = ({
  label,
  children,
}) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </label>

      {children}
    </div>
  );
};