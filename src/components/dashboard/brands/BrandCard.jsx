import { getImageUrl } from "../../../utils/getImageUrl";

const BrandCard = ({ brand, onEdit, onDelete }) => {
  const handleDelete = () => {
    const confirm = window.confirm(
      `Delete "${brand.name}" brand?`
    );

    if (confirm) {
      onDelete(brand.id);
    }
  };

  return (
    <div style={styles.card}>
      {/* LOGO */}
      <div style={styles.imageWrapper}>
        <img
          src={getImageUrl(brand.logo)}
          alt={brand.name}
          style={styles.image}
          onError={(e) => {
            e.target.src = "/no-image.png";
          }}
        />
      </div>

      {/* CONTENT */}
      <div style={styles.content}>
        <h3 style={styles.name}>{brand.name}</h3>

        <p style={styles.slug}>{brand.slug}</p>

        {/* STATUS */}
        <span
          style={{
            ...styles.status,
            background: brand.status ? "green" : "gray",
          }}
        >
          {brand.status ? "Active" : "Inactive"}
        </span>
      </div>

      {/* ACTIONS */}
      <div style={styles.actions}>
        <button onClick={() => onEdit(brand)} style={styles.editBtn}>
          Edit
        </button>

        <button onClick={handleDelete} style={styles.deleteBtn}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default BrandCard;

// ================= STYLES =================
const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: 15,
    width: 200,
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  imageWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    objectFit: "contain",
  },
  content: {
    textAlign: "center",
  },
  name: {
    margin: "5px 0",
  },
  slug: {
    fontSize: 12,
    color: "#777",
  },
  status: {
    display: "inline-block",
    marginTop: 8,
    padding: "4px 8px",
    color: "#fff",
    borderRadius: 4,
    fontSize: 12,
  },
  actions: {
    marginTop: 10,
    display: "flex",
    justifyContent: "space-between",
  },
  editBtn: {
    padding: "5px 10px",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "5px 10px",
    background: "red",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};