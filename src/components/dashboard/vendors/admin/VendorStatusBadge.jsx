const VendorStatusBadge = ({
  status = "pending",
}) => {
  const current =
    String(status).toLowerCase();

  const config = {
    approved: {
      label:
        "Approved",
      classes:
        "bg-green-50 text-green-700 border-green-200",
      dot: "bg-green-500",
    },

    pending: {
      label:
        "Pending",
      classes:
        "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
    },

    rejected: {
      label:
        "Rejected",
      classes:
        "bg-red-50 text-red-700 border-red-200",
      dot: "bg-red-500",
    },

    suspended: {
      label:
        "Suspended",
      classes:
        "bg-slate-100 text-slate-700 border-slate-200",
      dot: "bg-slate-500",
    },
  };

  const item =
    config[
      current
    ] ||
    {
      label:
        current
          .charAt(
            0
          )
          .toUpperCase() +
        current.slice(
          1
        ),
      classes:
        "bg-slate-100 text-slate-700 border-slate-200",
      dot: "bg-slate-500",
    };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide ${item.classes}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${item.dot}`}
      />

      {
        item.label
      }
    </span>
  );
};

export default VendorStatusBadge;