import { useMemo, useState } from "react";
import { getImageUrl } from "../../../../utils/getImageUrl";
import useGet from "../../../../api/hooks/useGet";
import usePut from "../../../../api/hooks/usePut";


const VendorKYCModal = ({
  vendor,
  onClose,
  onRefresh,
}) => {
  const {
    data,
    loading,
    refetch,
  } = useGet(
    vendor
      ? `/admin/vendors/${vendor.id}/documents`
      : null,
    {
      autoFetch:
        !!vendor,
    }
  );

  const { putData } =
    usePut();

  const [actionLoading, setActionLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const docs =
    data?.data || [];

  const stats =
    useMemo(() => {
      const approved =
        docs.filter(
          (d) =>
            d.status ===
            "verified" ||
            d.status ===
            "approved"
        ).length;

      const rejected =
        docs.filter(
          (d) =>
            d.status ===
            "rejected"
        ).length;

      const pending =
        docs.length -
        approved -
        rejected;

      return {
        total:
          docs.length,
        approved,
        rejected,
        pending,
      };
    }, [docs]);

  const refreshAll =
    async () => {
      await refetch({
        force: true,
      });

      onRefresh?.();
    };

  const handleVerify =
    async (id) => {
      try {
        setActionLoading(
          true
        );
        setError("");
        setMessage("");

        await putData({
          url: `/admin/documents/${id}/verify`,
        });

        setMessage(
          "Document verified successfully."
        );

        await refreshAll();
      } catch {
        setError(
          "Unable to verify document."
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };

  const handleReject =
    async (id) => {
      try {
        setActionLoading(
          true
        );
        setError("");
        setMessage("");

        await putData({
          url: `/admin/documents/${id}/reject`,
        });

        setMessage(
          "Document rejected successfully."
        );

        await refreshAll();
      } catch {
        setError(
          "Unable to reject document."
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };

  if (!vendor)
    return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-start overflow-y-auto p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl mt-8 mb-8">
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Vendor KYC Review
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {
                vendor.store_name
              }{" "}
              • Vendor ID #
              {
                vendor.id
              }
            </p>
          </div>

          <button
            onClick={
              onClose
            }
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        {/* Alerts */}
        {(message ||
          error) && (
          <div className="px-6 pt-5">
            {message && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {
                  message
                }
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {
                  error
                }
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 px-6 py-6">
          <MiniCard
            label="Total"
            value={
              stats.total
            }
          />

          <MiniCard
            label="Approved"
            value={
              stats.approved
            }
            green
          />

          <MiniCard
            label="Pending"
            value={
              stats.pending
            }
            amber
          />

          <MiniCard
            label="Rejected"
            value={
              stats.rejected
            }
            red
          />
        </div>

        {/* Body */}
        <div className="px-6 pb-6">
          {loading ? (
            <LoadingGrid />
          ) : !docs.length ? (
            <EmptyState />
          ) : (
            <div className="grid lg:grid-cols-2 gap-5">
              {docs.map(
                (
                  doc
                ) => (
                  <DocumentCard
                    key={
                      doc.id
                    }
                    doc={
                      doc
                    }
                    loading={
                      actionLoading
                    }
                    onVerify={
                      handleVerify
                    }
                    onReject={
                      handleReject
                    }
                  />
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DocumentCard = ({
  doc,
  loading,
  onVerify,
  onReject,
}) => {
  const fileUrl = getImageUrl(doc.document_file);

  const image =
    /\.(jpg|jpeg|png|webp)$/i.test(
      doc.document_file
    );

  const approved =
    doc.status ===
      "approved" ||
    doc.status ===
      "verified";

  const rejected =
    doc.status ===
    "rejected";

  return (
    <div className="rounded-3xl border border-slate-200 overflow-hidden bg-white shadow-sm">
      {/* Preview */}
      <div className="h-64 bg-slate-100">
        {image ? (
          <img
            src={
              fileUrl
            }
            alt={
              doc.document_type
            }
            className="h-full w-full object-cover"
          />
        ) : (
          <iframe
            title={
              doc.document_type
            }
            src={
              fileUrl
            }
            className="h-full w-full"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-slate-900">
              {
                doc.document_type
              }
            </h3>

            <p className="text-sm text-slate-500 mt-1 break-all">
              {
                doc.document_number
              }
            </p>
          </div>

          <StatusBadge
            status={
              doc.status
            }
          />
        </div>

        <a
          href={
            fileUrl
          }
          target="_blank"
          rel="noreferrer"
          className="inline-block text-sm font-medium text-[#7b1238] hover:underline"
        >
          Open Full File
        </a>

        <div className="grid grid-cols-2 gap-3">
          {!approved && (
            <button
              disabled={
                loading
              }
              onClick={() =>
                onVerify(
                  doc.id
                )
              }
              className="rounded-xl bg-green-600 py-3 text-white font-semibold hover:opacity-90 disabled:opacity-50"
            >
              Verify
            </button>
          )}

          {!rejected && (
            <button
              disabled={
                loading
              }
              onClick={() =>
                onReject(
                  doc.id
                )
              }
              className="rounded-xl bg-red-600 py-3 text-white font-semibold hover:opacity-90 disabled:opacity-50"
            >
              Reject
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({
  status,
}) => {
  const styles = {
    approved:
      "bg-green-50 text-green-700 border-green-200",
    verified:
      "bg-green-50 text-green-700 border-green-200",
    pending:
      "bg-amber-50 text-amber-700 border-amber-200",
    rejected:
      "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
        styles[
          status
        ] ||
        "bg-slate-100 text-slate-700 border-slate-200"
      }`}
    >
      {status}
    </span>
  );
};

const MiniCard = ({
  label,
  value,
  green,
  amber,
  red,
}) => {
  let style =
    "bg-white border-slate-200 text-slate-900";

  if (green)
    style =
      "bg-green-50 border-green-200 text-green-700";

  if (amber)
    style =
      "bg-amber-50 border-amber-200 text-amber-700";

  if (red)
    style =
      "bg-red-50 border-red-200 text-red-700";

  return (
    <div
      className={`rounded-2xl border p-4 ${style}`}
    >
      <p className="text-xs uppercase tracking-wide opacity-70">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
};

const LoadingGrid = () => (
  <div className="grid lg:grid-cols-2 gap-5">
    {[1, 2, 3, 4].map(
      (
        item
      ) => (
        <div
          key={
            item
          }
          className="rounded-3xl border border-slate-200 p-5 space-y-4 animate-pulse"
        >
          <div className="h-52 rounded-2xl bg-slate-200" />
          <div className="h-6 rounded bg-slate-200" />
          <div className="h-4 rounded bg-slate-200 w-1/2" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-10 rounded-xl bg-slate-200" />
            <div className="h-10 rounded-xl bg-slate-200" />
          </div>
        </div>
      )
    )}
  </div>
);

const EmptyState = () => (
  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">
    <div className="text-5xl">
      📄
    </div>

    <h3 className="mt-4 text-xl font-semibold text-slate-800">
      No Documents Uploaded
    </h3>

    <p className="mt-2 text-sm text-slate-500">
      This vendor has not uploaded any KYC files yet.
    </p>
  </div>
);

export default VendorKYCModal;