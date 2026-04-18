import { useState } from "react";
import usePost from "../../api/hooks/usePost";

const defaultDocs = ["GST", "PAN", "AADHAR"];

const DocumentUpload = ({ vendorId }) => {
  const { postData, loading } = usePost();

  const [documents, setDocuments] = useState([
    {
      type: "GST",
      customType: "",
      number: "",
      file: null,
    },
  ]);

  const [message, setMessage] = useState("");

  // ➕ Add new document row
  const addDocument = () => {
    setDocuments([
      ...documents,
      { type: "PAN", customType: "", number: "", file: null },
    ]);
  };

  // 🔄 Handle change
  const handleChange = (index, field, value) => {
    const updated = [...documents];
    updated[index][field] = value;
    setDocuments(updated);
  };

  // 📤 Submit all documents
  const handleSubmit = async () => {
    try {
      for (let doc of documents) {
        const formData = new FormData();

        formData.append("vendor_id", vendorId);

        const finalType =
          doc.type === "OTHER" ? doc.customType : doc.type;

        formData.append("document_type", finalType);
        formData.append("document_number", doc.number);
        formData.append("document_file", doc.file);

        await postData({
          url: "/vendor/documents",
          data: formData,
        });
      }

      setMessage("All documents uploaded successfully");
    } catch (err) {
      setMessage(err.message || "Upload failed");
    }
  };

  return (
    <div style={styles.container}>
      <h3>KYC Document Upload</h3>

      {message && <p>{message}</p>}

      {documents.map((doc, index) => (
        <div key={index} style={styles.row}>
          {/* DOCUMENT TYPE */}
          <select
            value={doc.type}
            onChange={(e) =>
              handleChange(index, "type", e.target.value)
            }
          >
            {defaultDocs.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
            <option value="OTHER">Other</option>
          </select>

          {/* CUSTOM TYPE */}
          {doc.type === "OTHER" && (
            <input
              type="text"
              placeholder="Enter Document Name"
              value={doc.customType}
              onChange={(e) =>
                handleChange(index, "customType", e.target.value)
              }
            />
          )}

          {/* DOCUMENT NUMBER */}
          <input
            type="text"
            placeholder="Document Number"
            value={doc.number}
            onChange={(e) =>
              handleChange(index, "number", e.target.value)
            }
          />

          {/* FILE */}
          <input
            type="file"
            onChange={(e) =>
              handleChange(index, "file", e.target.files[0])
            }
          />
        </div>
      ))}

      {/* ➕ ADD MORE */}
      <button onClick={addDocument}>+ Add More</button>

      {/* SUBMIT */}
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Uploading..." : "Submit Documents"}
      </button>
    </div>
  );
};

const styles = {
  container: {
    marginTop: "20px",
    padding: "15px",
    border: "1px solid #ddd",
  },
  row: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
  },
};

export default DocumentUpload;