import VendorActions from "./VendorActions";
import VendorStatusBadge from "./VendorStatusBadge";

const VendorRow = ({
  vendor,
  onApprove,
  onReject,
  onViewKYC,
  actionLoading = false,
}) => {
  if (!vendor) return null;

  const {
    store_name,
    store_slug,
    user_id,
    rating,
    status,
    created_at,
  } = vendor;

  return (
    <tr style={styles.row}>
      {/* 🔹 STORE */}
      <td>
        <div style={styles.store}>
          <strong>{store_name || "N/A"}</strong>
          <small style={styles.slug}>
            {store_slug || ""}
          </small>
        </div>
      </td>

      {/* 🔹 USER */}
      <td>{user_id ?? "N/A"}</td>

      {/* 🔹 RATING */}
      <td>
        {rating
          ? `${parseFloat(rating).toFixed(1)} ⭐`
          : "N/A"}
      </td>

      {/* 🔹 STATUS */}
      <td>
        <VendorStatusBadge status={status} />
      </td>

      {/* 🔹 CREATED */}
      <td>
        {created_at ? formatDate(created_at) : "N/A"}
      </td>

      {/* 🔹 ACTIONS */}
      <td>
        <VendorActions
          vendor={vendor}
          onApprove={onApprove}
          onReject={onReject}
          onViewKYC={onViewKYC}
          loading={actionLoading}
        />
      </td>
    </tr>
  );
};

// 🔥 DATE FORMATTER
const formatDate = (date) => {
  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "N/A";
  }
};

// 🎨 STYLES
const styles = {
  row: {
    borderBottom: "1px solid #eee",
  },
  store: {
    display: "flex",
    flexDirection: "column",
  },
  slug: {
    fontSize: "12px",
    color: "#888",
  },
};

export default VendorRow;