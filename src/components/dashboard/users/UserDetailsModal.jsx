import {
  X,
  UserCircle2,
  Mail,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  CalendarDays,
  Hash,
  Phone,
  MapPin,
} from "lucide-react";

/* ==========================================================
   USER DETAILS MODAL
   Elite Production Grade

   Props:
   open        boolean
   user        object|null
   onClose()   function
========================================================== */

const UserDetailsModal = ({
  open = false,
  user = null,
  onClose = () => {},
}) => {
  if (!open || !user)
    return null;

  const active =
    isActive(
      user.status
    );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        onClick={
          onClose
        }
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* MODAL */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* HEADER */}
        <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-r from-[#7b183f] to-[#a52355] px-6 py-6 text-white">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

          <button
            onClick={
              onClose
            }
            className="absolute right-4 top-4 rounded-xl p-2 text-white/90 transition hover:bg-white/10"
          >
            <X
              size={18}
            />
          </button>

          <div className="relative flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">
              <UserCircle2
                size={46}
              />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-2xl font-bold">
                {
                  user.name
                }
              </h2>

              <p className="mt-1 truncate text-sm text-white/80">
                {
                  user.email
                }
              </p>

              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                <ShieldCheck
                  size={
                    12
                  }
                />

                {getRoleName(
                  user
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6">
          {/* GRID */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoCard
              icon={
                <Hash
                  size={
                    16
                  }
                />
              }
              label="User ID"
              value={
                user.id ||
                "--"
              }
            />

            <InfoCard
              icon={
                <Mail
                  size={
                    16
                  }
                />
              }
              label="Email"
              value={
                user.email ||
                "--"
              }
            />

            <InfoCard
              icon={
                <ShieldCheck
                  size={
                    16
                  }
                />
              }
              label="Role"
              value={getRoleName(
                user
              )}
            />

            <InfoCard
              icon={
                active ? (
                  <CheckCircle2
                    size={
                      16
                    }
                  />
                ) : (
                  <XCircle
                    size={
                      16
                    }
                  />
                )
              }
              label="Status"
              value={
                active
                  ? "Active"
                  : "Inactive"
              }
              valueClass={
                active
                  ? "text-emerald-600"
                  : "text-rose-600"
              }
            />

            <InfoCard
              icon={
                <CalendarDays
                  size={
                    16
                  }
                />
              }
              label="Joined"
              value={formatDate(
                user.created_at
              )}
            />

            <InfoCard
              icon={
                <Phone
                  size={
                    16
                  }
                />
              }
              label="Phone"
              value={
                user.phone ||
                "--"
              }
            />

            <InfoCard
              icon={
                <MapPin
                  size={
                    16
                  }
                />
              }
              label="Address"
              value={
                user.address ||
                "--"
              }
              full
            />
          </div>

          {/* FOOTER */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={
                onClose
              }
              className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Close
            </button>

            {/* <button className="rounded-2xl bg-[#7b183f] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-95">
              Manage User
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;

/* ==========================================================
   INFO CARD
========================================================== */

const InfoCard = ({
  icon,
  label,
  value,
  valueClass = "",
  full = false,
}) => {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-slate-50 p-4 ${
        full
          ? "sm:col-span-2"
          : ""
      }`}
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <span className="text-[#7b183f]">
          {icon}
        </span>

        {label}
      </div>

      <p
        className={`mt-3 break-words text-sm font-semibold text-slate-900 ${valueClass}`}
      >
        {value}
      </p>
    </div>
  );
};

/* ==========================================================
   HELPERS
========================================================== */

function isActive(
  status
) {
  return (
    status === true ||
    status === 1 ||
    status === "1" ||
    status ===
      "active"
  );
}

function getRoleName(
  user
) {
  return (
    user?.role
      ?.name ||
    user?.role ||
    "No Role"
  );
}

function formatDate(
  date
) {
  if (!date)
    return "--";

  try {
    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month:
          "short",
        year: "numeric",
      }
    );
  } catch {
    return "--";
  }
}