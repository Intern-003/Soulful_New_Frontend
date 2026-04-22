const VendorFilters = ({
  search = "",
  setSearch,
  status = "all",
  setStatus,
  total = 0,
}) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Search Vendors
          </label>

          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch?.(
                  e.target.value
                )
              }
              placeholder="Search by store name, slug or user ID..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-[#7b1238]/20"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              🔍
            </span>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Filter Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus?.(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-[#7b1238]/20"
          >
            <option value="all">
              All Vendors
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="approved">
              Approved
            </option>

            <option value="rejected">
              Rejected
            </option>
          </select>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-800">
            {total}
          </span>{" "}
          vendor
          {total !== 1
            ? "s"
            : ""}
        </p>

        {(search ||
          status !==
            "all") && (
          <button
            type="button"
            onClick={() => {
              setSearch?.(
                ""
              );
              setStatus?.(
                "all"
              );
            }}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default VendorFilters;