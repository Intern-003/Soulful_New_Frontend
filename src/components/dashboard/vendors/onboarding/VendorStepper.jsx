import { useMemo } from "react";

const VendorStepper = ({
  step = 1,
  steps = [],
  onStepChange,
}) => {
  const totalSteps = steps.length;

  const safeStep =
    step < 1
      ? 1
      : step > totalSteps
      ? totalSteps
      : step;

  const progress = useMemo(() => {
    if (totalSteps <= 1) return 0;

    return (
      ((safeStep - 1) / (totalSteps - 1)) * 100
    );
  }, [safeStep, totalSteps]);

  if (!totalSteps) return null;

  const handleStepClick = (index) => {
    const targetStep = index + 1;

    if (!onStepChange) return;

    // allow only previous/current steps clickable
    if (targetStep <= safeStep) {
      onStepChange(targetStep);
    }
  };

  return (
    <div className="w-full mb-8">
      {/* MOBILE SCROLL SAFE */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="relative min-w-[640px] px-1">
          {/* TRACK */}
          <div className="absolute top-5 left-0 right-0 h-[3px] bg-slate-200 rounded-full" />

          {/* ACTIVE TRACK */}
          <div
            className="absolute top-5 left-0 h-[3px] bg-[#7b1238] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />

          {/* STEPS */}
          <div className="relative grid grid-cols-4 gap-4">
            {steps.map((label, index) => {
              const current = index + 1;
              const isCompleted =
                current < safeStep;
              const isActive =
                current === safeStep;
              const isUpcoming =
                current > safeStep;

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() =>
                    handleStepClick(index)
                  }
                  disabled={
                    !onStepChange ||
                    isUpcoming
                  }
                  aria-current={
                    isActive
                      ? "step"
                      : undefined
                  }
                  className={`group flex flex-col items-center text-center focus:outline-none ${
                    isUpcoming
                      ? "cursor-default"
                      : "cursor-pointer"
                  }`}
                >
                  {/* CIRCLE */}
                  <div
                    className={`relative z-10 h-10 w-10 rounded-full border flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      isCompleted
                        ? "bg-[#7b1238] border-[#7b1238] text-white"
                        : isActive
                        ? "bg-white border-[#7b1238] text-[#7b1238] ring-4 ring-[#7b1238]/10 scale-105"
                        : "bg-white border-slate-300 text-slate-400"
                    }`}
                  >
                    {isCompleted
                      ? "✓"
                      : current}
                  </div>

                  {/* LABEL */}
                  <span
                    className={`mt-3 text-xs leading-5 font-medium max-w-[120px] transition-colors ${
                      isCompleted ||
                      isActive
                        ? "text-slate-800"
                        : "text-slate-400"
                    }`}
                  >
                    {label}
                  </span>

                  {/* STATUS */}
                  <span className="sr-only">
                    {isCompleted
                      ? "Completed"
                      : isActive
                      ? "Current Step"
                      : "Upcoming Step"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>
          Step {safeStep} of {totalSteps}
        </span>

        <span>
          {Math.round(progress)}%
          Completed
        </span>
      </div>
    </div>
  );
};

export default VendorStepper;