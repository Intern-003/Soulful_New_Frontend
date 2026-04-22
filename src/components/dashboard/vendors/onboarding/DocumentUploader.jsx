import { useMemo, useState } from "react";
import usePost from "../../../../api/hooks/usePost";

const DOCUMENT_TYPES = [
  "GST",
  "PAN",
  "AADHAAR",
  "COMPANY_AADHAAR",
  "BANK_PROOF",
  "CIN",
  "FSSAI",
  "TRADE_LICENSE",
  "OTHER",
];

const createRow = () => ({
  id: Date.now() + Math.random(),
  document_type: "GST",
  custom_name: "",
  document_number: "",
  file: null,
});

const DocumentUploader = ({
  vendorId,
  documents = [],
  setDocuments,
  onBack,
  onNext,
}) => {
  const { postData, loading } = usePost();

  const [rows, setRows] = useState(
    documents.length ? documents : [createRow()]
  );

  const [error, setError] = useState("");
  const [success, setSuccess] =
    useState("");

  const completedCount = useMemo(() => {
    return rows.filter(
      (row) =>
        row.file &&
        row.document_number.trim()
    ).length;
  }, [rows]);

  const handleChange = (
    id,
    key,
    value
  ) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              [key]: value,
            }
          : row
      )
    );
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      createRow(),
    ]);
  };

  const removeRow = (id) => {
    setRows((prev) => {
      const filtered =
        prev.filter(
          (row) => row.id !== id
        );

      return filtered.length
        ? filtered
        : [createRow()];
    });
  };

  const validateRows = () => {
    for (const row of rows) {
      const finalType =
        row.document_type ===
        "OTHER"
          ? row.custom_name.trim()
          : row.document_type;

      if (!finalType) {
        setError(
          "Please enter custom document name."
        );
        return false;
      }

      if (
        !row.document_number.trim()
      ) {
        setError(
          "Please enter all document numbers."
        );
        return false;
      }

      if (!row.file) {
        setError(
          "Please upload all files."
        );
        return false;
      }
    }

    return true;
  };

  const handleUpload =
    async () => {
      setError("");
      setSuccess("");

      if (!vendorId) {
        setError(
          "Vendor ID missing."
        );
        return;
      }

      if (!validateRows()) return;

      try {
        for (const row of rows) {
          const formData =
            new FormData();

          const finalType =
            row.document_type ===
            "OTHER"
              ? row.custom_name.trim()
              : row.document_type;

          formData.append(
            "vendor_id",
            vendorId
          );
          formData.append(
            "document_type",
            finalType
          );
          formData.append(
            "document_number",
            row.document_number.trim()
          );
          formData.append(
            "document_file",
            row.file
          );

          await postData({
            url: "/vendor/documents",
            data: formData,
          });
        }

        setDocuments?.(rows);

        setSuccess(
          "Documents uploaded successfully."
        );

        onNext?.();
      } catch (err) {
        setError(
          err?.response?.data
            ?.message ||
            err?.message ||
            "Upload failed."
        );
      }
    };

  return (
    <div className="space-y-6 mt-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-slate-900">
          Upload KYC Documents
        </h3>

        <p className="text-sm text-slate-500 mt-1">
          Upload clear,
          valid and readable
          files for quick
          approval.
        </p>
      </div>

      {/* Status Card */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Completed
          </p>

          <p className="text-xl font-bold text-slate-900">
            {completedCount}/
            {rows.length}
          </p>
        </div>

        <div className="w-40 h-2 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-[#7b1238]"
            style={{
              width: `${
                rows.length
                  ? (completedCount /
                      rows.length) *
                    100
                  : 0
              }%`,
            }}
          />
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Rows */}
      <div className="space-y-5">
        {rows.map((row, index) => (
          <div
            key={row.id}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-5">
              <h4 className="font-semibold text-slate-800">
                Document{" "}
                {index + 1}
              </h4>

              {rows.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    removeRow(
                      row.id
                    )
                  }
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Document Type
                </label>

                <select
                  value={
                    row.document_type
                  }
                  onChange={(e) =>
                    handleChange(
                      row.id,
                      "document_type",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                >
                  {DOCUMENT_TYPES.map(
                    (
                      item
                    ) => (
                      <option
                        key={
                          item
                        }
                        value={
                          item
                        }
                      >
                        {
                          item
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Number */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Document Number
                </label>

                <input
                  type="text"
                  value={
                    row.document_number
                  }
                  onChange={(e) =>
                    handleChange(
                      row.id,
                      "document_number",
                      e.target.value
                    )
                  }
                  placeholder="Enter number"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>
            </div>

            {/* Other */}
            {row.document_type ===
              "OTHER" && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Custom
                  Document
                  Name
                </label>

                <input
                  type="text"
                  value={
                    row.custom_name
                  }
                  onChange={(e) =>
                    handleChange(
                      row.id,
                      "custom_name",
                      e.target.value
                    )
                  }
                  placeholder="Enter custom name"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>
            )}

            {/* Upload */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Upload File
              </label>

              <label className="block rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-center cursor-pointer hover:border-[#7b1238] transition">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    handleChange(
                      row.id,
                      "file",
                      e.target
                        .files?.[0] ||
                        null
                    )
                  }
                />

                <p className="font-medium text-slate-700">
                  Click to
                  upload file
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  JPG, PNG,
                  PDF supported
                </p>

                {row.file && (
                  <p className="mt-3 text-sm text-green-700 font-medium break-all">
                    {
                      row.file
                        .name
                    }
                  </p>
                )}
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="grid md:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-slate-300 py-3 font-medium hover:bg-slate-50"
        >
          Back
        </button>

        <button
          type="button"
          onClick={addRow}
          className="rounded-xl border border-slate-300 py-3 font-medium hover:bg-slate-50"
        >
          + Add More
        </button>

        <button
          type="button"
          onClick={
            handleUpload
          }
          disabled={loading}
          className="rounded-xl bg-[#7b1238] py-3 font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading
            ? "Uploading..."
            : "Upload & Continue"}
        </button>
      </div>
    </div>
  );
};

export default DocumentUploader;