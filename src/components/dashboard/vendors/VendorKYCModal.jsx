import useGet from "../../../api/hooks/useGet";
import usePut from "../../../api/hooks/usePut";

const BASE_URL = "http://127.0.0.1:8000";

const VendorKYCModal = ({ vendor, onClose }) => {
  const { data, loading, refetch } = useGet(
    vendor ? `/admin/vendors/${vendor.id}/documents` : null,
    { autoFetch: !!vendor }
  );

  const { putData } = usePut();

  const documents = data?.data || [];

  // ✅ VERIFY
  const handleVerify = async (id) => {
    try {
      await putData({
        url: `/admin/documents/${id}/verify`,
      });

      refetch({ force: true });
    } catch (err) {
      console.error("Verify Error:", err);
    }
  };

  // ❌ REJECT
  const handleReject = async (id) => {
    try {
      await putData({
        url: `/admin/documents/${id}/reject`,
      });

      refetch({ force: true });
    } catch (err) {
      console.error("Reject Error:", err);
    }
  };

  if (!vendor) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* HEADER */}
        <div style={styles.header}>
          <h2>{vendor.store_name} - KYC</h2>
          <button onClick={onClose}>✖</button>
        </div>

        {/* LOADING */}
        {loading && <p>Loading documents...</p>}

        {/* EMPTY */}
        {!loading && documents.length === 0 && (
          <p>No documents found</p>
        )}

        {/* DOCUMENT GRID */}
        <div style={styles.grid}>
          {documents.map((doc) => (
            <div key={doc.id} style={styles.card}>
              {/* TYPE */}
              <h4>{doc.document_type}</h4>

              {/* NUMBER */}
              <p>{doc.document_number || "-"}</p>

              {/* STATUS */}
              <span style={getStatusStyle(doc.status)}>
                {doc.status}
              </span>

              {/* PREVIEW */}
              <div style={styles.preview}>
                {doc.document_file ? (
                  isImage(doc.document_file) ? (
                    <img
                      src={`${BASE_URL}/${doc.document_file}`}
                      alt="doc"
                      style={styles.image}
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/150")
                      }
                    />
                  ) : (
                    <iframe
                      src={`${BASE_URL}/${doc.document_file}`}
                      title="pdf"
                      style={styles.pdf}
                    />
                  )
                ) : (
                  <p>No file</p>
                )}
              </div>

              {/* ACTIONS */}
              {doc.status === "pending" && (
                <div style={styles.actions}>
                  <button
                    onClick={() => handleVerify(doc.id)}
                    style={styles.verifyBtn}
                  >
                    Verify
                  </button>

                  <button
                    onClick={() => handleReject(doc.id)}
                    style={styles.rejectBtn}
                  >
                    Reject
                  </button>
                </div>
              )}

              {/* STATUS LABELS */}
              {doc.status === "verified" && (
                <p style={{ color: "green" }}>Verified</p>
              )}

              {doc.status === "rejected" && (
                <p style={{ color: "red" }}>Rejected</p>
              )}

              {/* OPEN FULL */}
              {doc.document_file && (
                <a
                  href={`${BASE_URL}/${doc.document_file}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Full
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 🔥 HELPERS

const isImage = (file) => {
  return /\.(jpg|jpeg|png|webp)$/i.test(file);
};

const getStatusStyle = (status) => {
  const base = {
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    display: "inline-block",
    marginBottom: "8px",
    textTransform: "capitalize",
  };

  switch (status) {
    case "verified":
      return { ...base, background: "#d4edda", color: "green" };
    case "pending":
      return { ...base, background: "#fff3cd", color: "orange" };
    case "rejected":
      return { ...base, background: "#f8d7da", color: "red" };
    default:
      return base;
  }
};

// 🎨 STYLES

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    width: "800px",
    maxHeight: "90vh",
    overflowY: "auto",
    margin: "40px auto",
    borderRadius: "10px",
    padding: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "15px",
  },
  card: {
    border: "1px solid #ddd",
    padding: "10px",
    borderRadius: "8px",
  },
  preview: {
    margin: "10px 0",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "6px",
  },
  pdf: {
    width: "100%",
    height: "150px",
    border: "none",
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginBottom: "5px",
  },
  verifyBtn: {
    background: "green",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    cursor: "pointer",
    borderRadius: "4px",
  },
  rejectBtn: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    cursor: "pointer",
    borderRadius: "4px",
  },
};

export default VendorKYCModal;