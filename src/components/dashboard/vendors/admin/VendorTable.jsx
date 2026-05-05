import VendorRow from "./VendorRow";

/**
 * Production Grade Vendor Table
 * Clean UI + Safe Tailwind + Responsive + No Invalid DOM
 */

const VendorTable = ({
  vendors = [],
  loading = false,
  actionLoading = false,
  onApprove,
  onReject,
  onViewKYC,
  onViewDetails,
}) => {
  // ===============================
  // Loading State
  // ===============================
  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <TableHeader />

            <tbody className="divide-y divide-slate-100">
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item}>
                  <td
                    colSpan={6}
                    className="px-6 py-4"
                  >
                    <div className="grid grid-cols-6 gap-4 animate-pulse">
                      <div className="h-10 rounded-xl bg-slate-200 col-span-2" />
                      <div className="h-10 rounded-xl bg-slate-200" />
                      <div className="h-10 rounded-xl bg-slate-200" />
                      <div className="h-10 rounded-xl bg-slate-200" />
                      <div className="h-10 rounded-xl bg-slate-200" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ===============================
  // Empty State
  // ===============================
  if (!vendors.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
        <div className="text-5xl">📭</div>

        <h3 className="mt-4 text-xl font-semibold text-slate-800">
          No Vendors Found
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Try changing your search or filter criteria.
        </p>
      </div>
    );
  }

  // ===============================
  // Main Table
  // ===============================
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <TableHeader />

          <tbody className="divide-y divide-slate-100">
            {vendors.map((vendor) => (
              <VendorRow
                key={vendor.id}
                vendor={vendor}
                actionLoading={actionLoading}
                onApprove={onApprove}
                onReject={onReject}
                onViewKYC={onViewKYC}
                onViewDetails={onViewDetails}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* =====================================
   Table Header
===================================== */

const TableHeader = () => {
  return (
    <thead className="bg-slate-50">
      <tr>
        <Th>Store</Th>
        <Th>Owner</Th>
        <Th>Rating</Th>
        <Th>Status</Th>
        <Th>Created</Th>
        <Th align="right">Actions</Th>
      </tr>
    </thead>
  );
};

/* =====================================
   Table Head Cell
===================================== */

const Th = ({ children, align = "left" }) => {
  const alignClass =
    align === "right"
      ? "text-right"
      : align === "center"
      ? "text-center"
      : "text-left";

  return (
    <th
      scope="col"
      className={`whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 ${alignClass}`}
    >
      {children}
    </th>
  );
};

export default VendorTable;