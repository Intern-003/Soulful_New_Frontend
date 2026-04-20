import VendorRow from "./VendorRow";

const VendorTable = ({
  vendors = [],
  loading = false,
  onApprove,
  onReject,
  onViewKYC,
  actionLoading = false,
}) => {
  return (
    <div style={styles.wrapper}>
      {/* 🔹 LOADING */}
      {loading && (
        <p style={styles.message}>Loading vendors...</p>
      )}

      {/* 🔹 EMPTY */}
      {!loading && vendors.length === 0 && (
        <p style={styles.message}>No vendors found</p>
      )}

      {/* 🔹 TABLE */}
      {!loading && vendors.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Store</th>
              <th>User</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {vendors.map((vendor) => (
              <VendorRow
                key={vendor.id}
                vendor={vendor}
                onApprove={onApprove}
                onReject={onReject}
                onViewKYC={onViewKYC}
                actionLoading={actionLoading}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// 🎨 STYLES
const styles = {
  wrapper: {
    overflowX: "auto",
    background: "#fff",
    borderRadius: "10px",
    border: "1px solid #ddd",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  message: {
    padding: "20px",
    textAlign: "center",
  },
};

export default VendorTable;