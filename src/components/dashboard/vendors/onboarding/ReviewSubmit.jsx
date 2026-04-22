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
        documents.map(
          (item, index) => ({
            id:
              item.id ||
              index + 1,
            type:
              item.document_type ===
                "OTHER" &&
              item.custom_name
                ? item.custom_name
                : item.document_type,
            number:
              item.document_number,
            file:
              item.file
                ?.name ||
              "Uploaded",
          })
        ) || [];

      return {
        totalDocs:
          docs.length,
        docs,
      };
    }, [documents]);

  const handleFinalSubmit =
    async () => {
      if (!agree) return;

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
        <h3 className="text-2xl font-bold text-slate-900">
          Review &
          Submit
        </h3>

        <p className="text-sm text-slate-500 mt-1">
          Please verify your
          details before
          completing vendor
          onboarding.
        </p>
      </div>

      {/* Profile Summary */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h4 className="font-semibold text-slate-900">
            Business Details
          </h4>

          <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full">
            Verified
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
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
        <h4 className="font-semibold text-slate-900 mb-5">
          Uploaded
          Documents
        </h4>

        {summary.docs.length >
        0 ? (
          <div className="space-y-4">
            {summary.docs.map(
              (doc) => (
                <div
                  key={
                    doc.id
                  }
                  className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <p className="font-medium text-slate-800">
                      {
                        doc.type
                      }
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      Number:{" "}
                      {
                        doc.number
                      }
                    </p>
                  </div>

                  <div className="text-sm text-green-700 font-medium break-all">
                    {
                      doc.file
                    }
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-4 text-sm text-amber-700">
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
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={
              agree
            }
            onChange={(e) =>
              setAgree(
                e.target
                  .checked
              )
            }
            className="mt-1 h-4 w-4 rounded border-slate-300 text-[#7b1238] focus:ring-[#7b1238]"
          />

          <span className="text-sm text-slate-600 leading-6">
            I confirm that
            all submitted
            business and KYC
            details are
            accurate and I
            agree to vendor
            onboarding
            policies.
          </span>
        </label>
      </div>

      {/* Footer Buttons */}
      <div className="grid md:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-slate-300 py-3 font-medium hover:bg-slate-50"
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
          className="rounded-xl bg-[#7b1238] py-3 font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
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
}) => (
  <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
    <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">
      {label}
    </p>

    <p className="font-medium text-slate-900 break-words">
      {value}
    </p>
  </div>
);

export default ReviewSubmit;