import { useMemo, useState } from "react";

const ReviewSubmit = ({
  form = {},
  vendorId,
  documents = [],
  onBack,
  onSubmit,
}) => {
  const [agree, setAgree] =
    useState(false);
  const [loading, setLoading] =
    useState(false);

  const summary =
    useMemo(() => {
      const docs =
        (documents || []).map(
          (
            item,
            index
          ) => ({
            id:
              item.id ||
              index + 1,

            type:
              item.document_type ||
              "Document",

            number:
              item.document_number ||
              "-",

            file:
              item.file_name ||
              item.document_file ||
              "Uploaded",

            vendor_id:
              item.vendor_id ||
              vendorId,
          })
        );

      return {
        totalDocs:
          docs.length,
        docs,
      };
    }, [documents, vendorId]);

  const handleFinalSubmit =
    async () => {
      if (
        !agree ||
        loading ||
        summary.totalDocs ===
          0
      )
        return;

      try {
        setLoading(true);

        await onSubmit?.();
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="mt-6 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-3xl font-bold text-slate-900">
          Review &
          Submit
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Please verify
          all business
          and KYC
          details before
          submitting your
          vendor request.
        </p>
      </div>

      {/* Business Info */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h4 className="font-semibold text-slate-900">
            Business
            Details
          </h4>

          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
            Verified
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <InfoCard
            label="Phone Number"
            value={
              form.phone ||
              "-"
            }
          />

          <InfoCard
            label="Store Name"
            value={
              form.store_name ||
              "-"
            }
          />

          <div className="md:col-span-2">
            <InfoCard
              label="Description"
              value={
                form.description ||
                "-"
              }
            />
          </div>

          <InfoCard
            label="Vendor ID"
            value={
              vendorId ||
              summary
                .docs?.[0]
                ?.vendor_id ||
              "-"
            }
          />

          <InfoCard
            label="Documents"
            value={`${summary.totalDocs} Uploaded`}
          />
        </div>
      </div>

      {/* Documents */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h4 className="mb-5 font-semibold text-slate-900">
          Uploaded
          Documents
        </h4>

        {summary.totalDocs >
        0 ? (
          <div className="space-y-4">
            {summary.docs.map(
              (
                doc
              ) => (
                <div
                  key={
                    doc.id
                  }
                  className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {
                        doc.type
                      }
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Number:{" "}
                      {
                        doc.number
                      }
                    </p>
                  </div>

                  <div className="text-sm font-medium text-green-700 break-all">
                    {
                      doc.file
                    }
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-700">
            No documents
            detected.
            Please go back
            and upload KYC
            documents.
          </div>
        )}
      </div>

      {/* Terms */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={
              agree
            }
            onChange={(
              e
            ) =>
              setAgree(
                e
                  .target
                  .checked
              )
            }
            className="mt-1 h-4 w-4 rounded border-slate-300 text-[#7b1238] focus:ring-[#7b1238]"
          />

          <span className="text-sm leading-6 text-slate-600">
            I confirm
            that all
            submitted
            business and
            KYC details
            are accurate
            and I agree
            to vendor
            onboarding
            policies.
          </span>
        </label>
      </div>

      {/* Footer */}
      <div className="grid gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={
            onBack
          }
          className="rounded-xl border border-slate-300 py-3 font-medium text-slate-700 hover:bg-slate-50"
        >
          Back
        </button>

        <button
          type="button"
          disabled={
            !agree ||
            loading ||
            summary.totalDocs ===
              0
          }
          onClick={
            handleFinalSubmit
          }
          className="rounded-xl bg-[#7b1238] py-3 font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Submitting..."
            : "Submit Vendor Request"}
        </button>
      </div>
    </div>
  );
};

const InfoCard = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
      <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="break-words font-medium text-slate-900">
        {value}
      </p>
    </div>
  );
};

export default ReviewSubmit;