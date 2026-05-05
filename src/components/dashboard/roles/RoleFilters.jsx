import { useMemo } from "react";
import {
  Search,
  RotateCcw,
  Download,
  SlidersHorizontal,
  Shield,
  ArrowUpDown,
} from "lucide-react";

/* ==========================================================
   FILE NAME: RoleFilters.jsx

   ROLE FILTERS
   Elite Production Grade

   Props:
   search
   setSearch

   sortBy
   setSortBy

   selectedType
   setSelectedType

   roles = []

   onReset()
   onExport()
========================================================== */

const RoleFilters = ({
  search = "",
  setSearch = () => {},

  sortBy = "latest",
  setSortBy = () => {},

  selectedType = "",
  setSelectedType = () => {},

  roles = [],

  onReset = () => {},
  onExport = () => {},
}) => {
  const safeRoles =
    useMemo(
      () =>
        Array.isArray(
          roles
        )
          ? roles
          : [],
      [roles]
    );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
      {/* TOP */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        {/* Left */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Role Filters
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Search, sort and manage system roles.
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={
              onReset
            }
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <RotateCcw
              size={16}
            />
            Reset
          </button>

          <button
            type="button"
            onClick={
              onExport
            }
            className="inline-flex items-center gap-2 rounded-2xl bg-[#7b183f] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-95"
          >
            <Download
              size={16}
            />
            Export
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Search */}
        <FilterBox label="Search Role">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={
                search
              }
              onChange={(
                e
              ) =>
                setSearch(
                  e.target
                    .value
                )
              }
              placeholder="Role name..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-[#7b183f] focus:bg-white focus:ring-4 focus:ring-[#7b183f]/10"
            />
          </div>
        </FilterBox>

        {/* Type */}
        <FilterBox label="Role Type">
          <div className="relative">
            <Shield
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={
                selectedType
              }
              onChange={(
                e
              ) =>
                setSelectedType(
                  e.target
                    .value
                )
              }
              className="h-11 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-[#7b183f] focus:bg-white focus:ring-4 focus:ring-[#7b183f]/10"
            >
              <option value="">
                All Types
              </option>

              <option value="system">
                System
              </option>

              <option value="custom">
                Custom
              </option>

              <option value="admin">
                Admin
              </option>
            </select>
          </div>
        </FilterBox>

        {/* Sort */}
        <FilterBox label="Sort By">
          <div className="relative">
            <ArrowUpDown
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={
                sortBy
              }
              onChange={(
                e
              ) =>
                setSortBy(
                  e.target
                    .value
                )
              }
              className="h-11 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-[#7b183f] focus:bg-white focus:ring-4 focus:ring-[#7b183f]/10"
            >
              <option value="latest">
                Latest
              </option>

              <option value="oldest">
                Oldest
              </option>

              <option value="az">
                A-Z
              </option>

              <option value="za">
                Z-A
              </option>

              <option value="permissions-high">
                Most Permissions
              </option>

              <option value="permissions-low">
                Least Permissions
              </option>
            </select>
          </div>
        </FilterBox>

        {/* Summary */}
        <FilterBox label="Quick Summary">
          <div className="flex h-11 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-600">
            <SlidersHorizontal
              size={14}
              className="mr-2"
            />
            {
              safeRoles.length
            }{" "}
            Roles Loaded
          </div>
        </FilterBox>
      </div>
    </div>
  );
};

export default RoleFilters;

/* ==========================================================
   SUB COMPONENT
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