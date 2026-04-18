import usePermissions from "../../../api/hooks/usePermissions";

const VendorActions = ({
  vendor,
  onApprove,
  onReject,
  onViewKYC,
  loading = false,
}) => {
  const { can } = usePermissions();
const canApprove = vendor.status === "pending" && vendor.kyc_verified;
  const isApproved = vendor.status === "approved";
  const isRejected = vendor.status === "rejected";
  const isPending = vendor.status === "pending";

  return (
    <div style={styles.container}>
      {/* 👁️ VIEW KYC (Always visible) */}
      <button
        onClick={() => onViewKYC(vendor)}
        style={styles.kyc}
      >
        View KYC
      </button>

      {/* ✅ APPROVE */}
      {isPending && can("vendor", "approve") && (
        <button
          onClick={() => onApprove(vendor.id)}
          disabled={loading}
          style={{
            ...styles.approve,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Approving..." : "Approve"}
        </button>
      )}

      {/* ❌ REJECT */}
      {isPending && can("vendor", "approve") && (
        <button
          onClick={() => onReject(vendor.id)}
          disabled={loading}
          style={{
            ...styles.reject,
            opacity: loading ? 0.6 : 1,
          }}
        >
          Reject
        </button>
      )}

      {/* 🟢 APPROVED LABEL */}
      {isApproved && (
        <span style={styles.statusApproved}>
          Approved
        </span>
      )}

      {/* 🔴 REJECTED LABEL */}
      {isRejected && (
        <span style={styles.statusRejected}>
          Rejected
        </span>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  approve: {
    background: "green",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    cursor: "pointer",
    borderRadius: "4px",
  },
  reject: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    cursor: "pointer",
    borderRadius: "4px",
  },
  kyc: {
    background: "#333",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    cursor: "pointer",
    borderRadius: "4px",
  },
  statusApproved: {
    color: "green",
    fontWeight: "bold",
  },
  statusRejected: {
    color: "red",
    fontWeight: "bold",
  },
};

export default VendorActions;