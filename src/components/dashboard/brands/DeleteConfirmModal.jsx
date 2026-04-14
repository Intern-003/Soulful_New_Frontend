const DeleteConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title = "Delete Item",
  message = "Are you sure you want to delete this item?",
  loading = false,
}) => {
  if (!open) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>{title}</h3>

        <p style={{ marginTop: 10 }}>{message}</p>

        <div style={styles.actions}>
          <button onClick={onClose} style={styles.cancelBtn}>
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            style={styles.deleteBtn}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;

// ================= STYLES =================
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 350,
    textAlign: "center",
  },
  actions: {
    marginTop: 20,
    display: "flex",
    justifyContent: "space-between",
  },
  cancelBtn: {
    padding: "6px 12px",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "6px 12px",
    background: "red",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};