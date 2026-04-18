import { useEffect, useRef } from "react";

const DeleteConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title = "Delete Item",
  message = "Are you sure you want to delete this item?",
  loading = false,
}) => {
  const modalRef = useRef();

  // 🔥 ESC CLOSE (disabled while loading)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose, loading]);

  // 🔥 AUTO FOCUS MODAL
  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ICON */}
        <div className="flex justify-center mb-3 text-red-500 text-3xl">
          🗑️
        </div>

        {/* TITLE */}
        <h3 className="text-lg font-semibold text-center">
          {title}
        </h3>

        {/* MESSAGE */}
        <p className="text-sm text-gray-600 text-center mt-2">
          {message}
        </p>

        {/* ACTIONS */}
        <div className="flex justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              if (!loading) onConfirm(); // 🔥 prevent double click
            }}
            disabled={loading}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;