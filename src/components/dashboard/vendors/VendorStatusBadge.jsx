const VendorStatusBadge = ({ status }) => {
  // 🔥 Normalize status (avoid case issues)
  const normalizedStatus = (status || "").toLowerCase();

  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
        return {
          label: "Approved",
          style: {
            backgroundColor: "#d4edda",
            color: "#155724",
            border: "1px solid #c3e6cb",
          },
        };

      case "pending":
        return {
          label: "Pending",
          style: {
            backgroundColor: "#fff3cd",
            color: "#856404",
            border: "1px solid #ffeeba",
          },
        };

      case "rejected":
        return {
          label: "Rejected",
          style: {
            backgroundColor: "#f8d7da",
            color: "#721c24",
            border: "1px solid #f5c6cb",
          },
        };

      // 🔥 Optional future-proof (if reused elsewhere)
      case "verified":
        return {
          label: "Verified",
          style: {
            backgroundColor: "#d1ecf1",
            color: "#0c5460",
            border: "1px solid #bee5eb",
          },
        };

      default:
        return {
          label: status || "Unknown",
          style: {
            backgroundColor: "#e2e3e5",
            color: "#383d41",
            border: "1px solid #d6d8db",
          },
        };
    }
  };

  const { label, style } = getStatusConfig(normalizedStatus);

  return (
    <span style={{ ...styles.badge, ...style }}>
      {label}
    </span>
  );
};

const styles = {
  badge: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
    display: "inline-block",
    textTransform: "capitalize",
    whiteSpace: "nowrap",
  },
};

export default VendorStatusBadge;