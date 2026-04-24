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

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
];

const MAX_FILE_SIZE =
  5 * 1024 * 1024;

const createRow = () => ({
  id:
    Date.now() +
    Math.random(),
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
  const {
    postData,
    loading,
  } = usePost();

  const [rows, setRows] =
    useState(
      documents.length
        ? documents.map(
            (
              item
            ) => ({
              id:
                item.id ||
                Date.now() +
                  Math.random(),
              document_type:
                item.document_type ||
                "GST",
              custom_name:
                "",
              document_number:
                item.document_number ||
                "",
              file: null,
              file_name:
                item.file_name ||
                "",
            })
          )
        : [createRow()]
    );

  const [error, setError] =
    useState("");
  const [
    success,
    setSuccess,
  ] = useState("");

  const completedCount =
    useMemo(() => {
      return rows.filter(
        (row) =>
          (row.file ||
            row.file_name) &&
          row.document_number.trim() &&
          (row.document_type !==
            "OTHER" ||
            row.custom_name.trim())
      ).length;
    }, [rows]);

  const progress =
    useMemo(() => {
      if (!rows.length)
        return 0;

      return Math.round(
        (completedCount /
          rows.length) *
          100
      );
    }, [
      completedCount,
      rows,
    ]);

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
              [key]:
                value,
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

  const removeRow = (
    id
  ) => {
    setRows((prev) => {
      const filtered =
        prev.filter(
          (
            row
          ) =>
            row.id !==
            id
        );

      return filtered.length
        ? filtered
        : [createRow()];
    });
  };

  const validateFile = (
    file
  ) => {
    if (!file)
      return "File required.";

    if (
      !ALLOWED_TYPES.includes(
        file.type
      )
    ) {
      return "Only JPG, PNG, PDF allowed.";
    }

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      return "Max file size is 5MB.";
    }

    return "";
  };

  const validateRows =
    () => {
      for (const row of rows) {
        const finalType =
          row.document_type ===
          "OTHER"
            ? row.custom_name.trim()
            : row.document_type;

        if (
          !finalType
        ) {
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

        if (
          !row.file &&
          !row.file_name
        ) {
          setError(
            "Please upload all files."
          );
          return false;
        }

        if (row.file) {
          const fileError =
            validateFile(
              row.file
            );

          if (
            fileError
          ) {
            setError(
              fileError
            );
            return false;
          }
        }
      }

      return true;
    };

  const handleUpload =
    async () => {
      setError("");
      setSuccess("");

      if (
        !vendorId
      ) {
        setError(
          "Vendor ID missing."
        );
        return;
      }

      if (
        !validateRows()
      )
        return;

      try {
        const uploadedRows =
          [];

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

          if (
            row.file
          ) {
            formData.append(
              "document_file",
              row.file
            );
          }

          const res =
            await postData(
              {
                url: "/vendor/documents",
                data: formData,
              }
            );

          const apiDoc =
            res?.data ||
            {};

          uploadedRows.push(
            {
              id:
                apiDoc.id,
              vendor_id:
                apiDoc.vendor_id,
              document_type:
                apiDoc.document_type,
              document_number:
                apiDoc.document_number,
              document_file:
                apiDoc.document_file,
              file_name:
                row.file
                  ?.name ||
                row.file_name ||
                "Uploaded",
            }
          );
        }

        setDocuments?.(
          uploadedRows
        );

        setSuccess(
          "Documents uploaded successfully."
        );

        setTimeout(
          () => {
            onNext?.(
              uploadedRows
            );
          },
          500
        );
      } catch (err) {
        setError(
          err
            ?.response
            ?.data
            ?.message ||
            err?.message ||
            "Upload failed."
        );
      }
    };

  return (
    <div className="mt-6 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-3xl font-bold text-slate-900">
          Upload KYC
          Documents
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Upload clear,
          readable and
          valid documents
          for faster
          approval.
        </p>
      </div>

      {/* Progress */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">
              Completed
            </p>

            <p className="text-xl font-bold text-slate-900">
              {
                completedCount
              }
              /
              {
                rows.length
              }
            </p>
          </div>

          <p className="text-sm font-semibold text-[#7b1238]">
            {
              progress
            }
            %
          </p>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-[#7b1238] transition-all"
            style={{
              width: `${progress}%`,
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
        {rows.map(
          (
            row,
            index
          ) => (
            <div
              key={
                row.id
              }
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-5 flex items-center justify-between">
                <h4 className="font-semibold text-slate-800">
                  Document{" "}
                  {index +
                    1}
                </h4>

                {rows.length >
                  1 && (
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

              <div className="grid gap-4 md:grid-cols-2">
                {/* Type */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Document
                    Type
                  </label>

                  <select
                    value={
                      row.document_type
                    }
                    onChange={(
                      e
                    ) =>
                      handleChange(
                        row.id,
                        "document_type",
                        e
                          .target
                          .value
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
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Document
                    Number
                  </label>

                  <input
                    type="text"
                    value={
                      row.document_number
                    }
                    onChange={(
                      e
                    ) =>
                      handleChange(
                        row.id,
                        "document_number",
                        e
                          .target
                          .value
                      )
                    }
                    placeholder="Enter document number"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  />
                </div>
              </div>

              {/* Other */}
              {row.document_type ===
                "OTHER" && (
                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Custom
                    Document
                    Name
                  </label>

                  <input
                    type="text"
                    value={
                      row.custom_name
                    }
                    onChange={(
                      e
                    ) =>
                      handleChange(
                        row.id,
                        "custom_name",
                        e
                          .target
                          .value
                      )
                    }
                    placeholder="Enter custom document name"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  />
                </div>
              )}

              {/* File */}
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Upload
                  File
                </label>

                <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-center transition hover:border-[#7b1238]">
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(
                      e
                    ) => {
                      const file =
                        e
                          .target
                          .files?.[0] ||
                        null;

                      handleChange(
                        row.id,
                        "file",
                        file
                      );
                    }}
                  />

                  <p className="font-medium text-slate-700">
                    Click to
                    upload
                    file
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    JPG,
                    PNG,
                    PDF
                    only
                    (max
                    5MB)
                  </p>

                  {(row.file ||
                    row.file_name) && (
                    <p className="mt-3 break-all text-sm font-medium text-green-700">
                      {row.file
                        ?.name ||
                        row.file_name}
                    </p>
                  )}
                </label>
              </div>
            </div>
          )
        )}
      </div>

      {/* Buttons */}
      <div className="grid gap-3 md:grid-cols-3">
        <button
          type="button"
          onClick={
            onBack
          }
          className="rounded-xl border border-slate-300 py-3 font-medium hover:bg-slate-50"
        >
          Back
        </button>

        <button
          type="button"
          onClick={
            addRow
          }
          className="rounded-xl border border-slate-300 py-3 font-medium hover:bg-slate-50"
        >
          + Add More
        </button>

        <button
          type="button"
          onClick={
            handleUpload
          }
          disabled={
            loading
          }
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