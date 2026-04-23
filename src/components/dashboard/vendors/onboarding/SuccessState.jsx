import { useEffect, useState } from "react";

const SuccessState = ({
  title = "Request Submitted",
  description = "Your vendor onboarding request has been submitted successfully.",
  primaryLabel = "Go To Home",
  secondaryLabel = "View Dashboard",
  onPrimary,
  onSecondary,
  autoRedirect = false,
  redirectAfter = 8,
}) => {
  const [seconds, setSeconds] =
    useState(redirectAfter);

  useEffect(() => {
    if (
      !autoRedirect ||
      !onPrimary
    )
      return;

    const timer =
      setInterval(() => {
        setSeconds(
          (prev) => {
            if (
              prev <= 1
            ) {
              clearInterval(
                timer
              );
              onPrimary?.();
              return 0;
            }

            return prev - 1;
          }
        );
      }, 1000);

    return () =>
      clearInterval(timer);
  }, [
    autoRedirect,
    onPrimary,
  ]);

  return (
    <div className="mt-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        {/* Icon */}
        <div className="mx-auto h-24 w-24 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
          <div className="h-16 w-16 rounded-full bg-green-600 text-white text-3xl font-bold flex items-center justify-center">
            ✓
          </div>
        </div>

        {/* Title */}
        <h2 className="mt-6 text-3xl font-bold text-slate-900">
          {title}
        </h2>

        {/* Desc */}
        <p className="mt-3 text-slate-500 leading-7 max-w-xl mx-auto">
          {description}
        </p>

        {/* Status Cards */}
        <div className="mt-8 grid md:grid-cols-3 gap-4 text-left">
          <StatusCard
            title="Application"
            value="Submitted"
            color="green"
          />

          <StatusCard
            title="KYC Review"
            value="Pending"
            color="amber"
          />

          <StatusCard
            title="Approval ETA"
            value="24-48 Hours"
            color="blue"
          />
        </div>

        {/* Timeline */}
        <div className="mt-8 rounded-2xl bg-slate-50 border border-slate-200 p-5 text-left">
          <h4 className="font-semibold text-slate-800 mb-4">
            What Happens Next?
          </h4>

          <div className="space-y-4">
            <TimelineItem
              active
              title="Documents Review"
              desc="Our team verifies your uploaded business and identity documents."
            />

            <TimelineItem
              title="Vendor Approval"
              desc="Once approved, your seller account gets activated."
            />

            <TimelineItem
              title="Start Selling"
              desc="Add products, manage inventory and receive orders."
            />
          </div>
        </div>

        {/* Auto Redirect */}
        {autoRedirect && (
          <div className="mt-6 text-sm text-slate-500">
            Redirecting in{" "}
            <span className="font-semibold text-slate-800">
              {seconds}s
            </span>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 grid md:grid-cols-2 gap-3 max-w-lg mx-auto">
          <button
            type="button"
            onClick={onPrimary}
            className="rounded-xl bg-[#7b1238] py-3 px-6 text-white font-semibold hover:opacity-90 transition"
          >
            {primaryLabel}
          </button>

          {onSecondary && (
            <button
              type="button"
              onClick={
                onSecondary
              }
              className="rounded-xl border border-slate-300 py-3 px-6 font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              {
                secondaryLabel
              }
            </button>
          )}
        </div>

        {/* Support */}
        <p className="mt-6 text-xs text-slate-400">
          Need help? Contact vendor
          support for faster
          onboarding assistance.
        </p>
      </div>
    </div>
  );
};

const StatusCard = ({
  title,
  value,
  color = "green",
}) => {
  const styles = {
    green:
      "bg-green-50 text-green-700 border-green-100",
    amber:
      "bg-amber-50 text-amber-700 border-amber-100",
    blue:
      "bg-blue-50 text-blue-700 border-blue-100",
  };

  return (
    <div
      className={`rounded-2xl border px-4 py-4 ${styles[color]}`}
    >
      <p className="text-xs uppercase tracking-wide opacity-70">
        {title}
      </p>

      <p className="mt-2 font-semibold">
        {value}
      </p>
    </div>
  );
};

const TimelineItem = ({
  title,
  desc,
  active = false,
}) => (
  <div className="flex gap-4">
    <div className="pt-1">
      <div
        className={`h-4 w-4 rounded-full ${
          active
            ? "bg-[#7b1238]"
            : "bg-slate-300"
        }`}
      />
    </div>

    <div>
      <p className="font-medium text-slate-800">
        {title}
      </p>

      <p className="text-sm text-slate-500 mt-1 leading-6">
        {desc}
      </p>
    </div>
  </div>
);

export default SuccessState;