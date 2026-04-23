import VendorRow from "./VendorRow";

const VendorTable = ({
  vendors = [],
  loading = false,
  actionLoading = false,
  onApprove,
  onReject,
  onViewKYC,
  onViewDetails,
}) => {
  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <TableHeader />

        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map(
            (item) => (
              <div
                key={item}
                className="grid grid-cols-6 gap-4 animate-pulse"
              >
                <div className="h-10 rounded-xl bg-slate-200 col-span-2" />
                <div className="h-10 rounded-xl bg-slate-200" />
                <div className="h-10 rounded-xl bg-slate-200" />
                <div className="h-10 rounded-xl bg-slate-200" />
                <div className="h-10 rounded-xl bg-slate-200" />
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  if (!vendors.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="text-5xl">
          📭
        </div>

        <h3 className="mt-4 text-xl font-semibold text-slate-800">
          No Vendors Found
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Try changing your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <TableHeader />

          <tbody className="divide-y divide-slate-100">
            {vendors.map(
              (vendor) => (
                <VendorRow
                  key={
                    vendor.id
                  }
                  vendor={
                    vendor
                  }
                  actionLoading={
                    actionLoading
                  }
                  onApprove={
                    onApprove
                  }
                  onReject={
                    onReject
                  }
                  onViewKYC={
                    onViewKYC
                  }
                  onViewDetails={
                    onViewDetails
                  }
                />
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TableHeader = () => (
  <thead className="bg-slate-50">
    <tr>
      <Th>
        Store
      </Th>

      <Th>
        Owner
      </Th>

      <Th>
        Rating
      </Th>

      <Th>
        Status
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

const Th = ({
  children,
  align = "left",
}) => (
  <th
    className={`px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 text-${align}`}
  >
    {children}
  </th>
);

export default VendorTable;