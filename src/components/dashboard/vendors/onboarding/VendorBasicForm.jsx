import { useMemo } from "react";
import { useForm } from "react-hook-form";

const MAX_DESCRIPTION = 300;

const VendorBasicForm = ({
  form = {
    phone: "",
    store_name: "",
    description: "",
  },
  loading = false,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: {
      errors,
      isValid,
      isSubmitting,
      touchedFields,
    },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      phone:
        form.phone || "",
      store_name:
        form.store_name ||
        "",
      description:
        form.description ||
        "",
    },
  });

  const description =
    watch(
      "description"
    ) || "";

  const phone =
    watch("phone") ||
    "";

  const busy =
    loading ||
    isSubmitting;

  const progress =
    useMemo(() => {
      let count = 0;

      if (
        phone.trim()
          .length >= 10
      )
        count++;

      if (
        watch(
          "store_name"
        )
          ?.trim()
          .length >= 3
      )
        count++;

      if (
        description.trim()
      )
        count++;

      return Math.round(
        (count / 3) *
          100
      );
    }, [
      phone,
      description,
      watch,
    ]);

  const summary =
    useMemo(() => {
      if (
        Object.keys(
          errors
        ).length
      ) {
        return "Please fix highlighted fields";
      }

      if (isValid) {
        return "Ready to continue";
      }

      return "Fill all required details";
    }, [
      errors,
      isValid,
    ]);

  const submitHandler =
    async (
      values
    ) => {
      const payload =
        {
          phone:
            values.phone.trim(),
          store_name:
            values.store_name.trim(),
          description:
            values.description.trim(),
        };

      try {
        await onSubmit?.(
          payload
        );
      } catch (
        err
      ) {
        setError(
          "root",
          {
            message:
              err?.message ||
              "Unable to continue",
          }
        );
      }
    };

  return (
    <form
      onSubmit={handleSubmit(
        submitHandler
      )}
      noValidate
      className="space-y-7"
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
              Business
              Details
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Enter your
              store
              information
              to begin
              vendor
              onboarding.
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Progress
            </p>

            <p className="text-xl font-bold text-[#7b1238]">
              {progress}%
            </p>
          </div>
        </div>

        <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-[#7b1238] transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      {/* Global Error */}
      {errors.root && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {
            errors
              .root
              .message
          }
        </div>
      )}

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Phone */}
        <Field
          label="Phone Number"
          required
          error={
            errors.phone
              ?.message
          }
        >
          <input
            type="text"
            placeholder="Enter phone number"
            autoComplete="tel"
            {...register(
              "phone",
              {
                required:
                  "Phone number is required",
                validate:
                  (
                    value
                  ) => {
                    const clean =
                      value.replace(
                        /\D/g,
                        ""
                      );

                    return clean.length >=
                      10 ||
                      "Enter valid phone number";
                  },
              }
            )}
            className={inputClass(
              errors.phone
            )}
          />
        </Field>

        {/* Store */}
        <Field
          label="Store Name"
          required
          error={
            errors
              .store_name
              ?.message
          }
        >
          <input
            type="text"
            placeholder="Your store / brand name"
            {...register(
              "store_name",
              {
                required:
                  "Store name is required",
                minLength:
                  {
                    value: 3,
                    message:
                      "Minimum 3 characters required",
                  },
              }
            )}
            className={inputClass(
              errors.store_name
            )}
          />
        </Field>

        {/* Description */}
        <div className="md:col-span-2">
          <Field
            label="Store Description"
            error={
              errors
                .description
                ?.message
            }
          >
            <textarea
              rows="5"
              placeholder="Tell customers about your products, quality and business..."
              {...register(
                "description",
                {
                  maxLength:
                    {
                      value:
                        MAX_DESCRIPTION,
                      message:
                        "Maximum 300 characters allowed",
                    },
                }
              )}
              className={inputClass(
                errors.description
              )}
            />

            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Optional but recommended
              </p>

              <p
                className={`text-xs ${
                  MAX_DESCRIPTION -
                    description.length <
                  40
                    ? "text-amber-600"
                    : "text-slate-400"
                }`}
              >
                {
                  description.length
                }
                /
                {
                  MAX_DESCRIPTION
                }
              </p>
            </div>
          </Field>
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <h4 className="font-semibold text-slate-800">
          Next Step:
          KYC Upload
        </h4>

        <p className="mt-2 text-sm text-slate-600 leading-6">
          You will upload
          GST, PAN,
          Aadhaar, bank
          proof and any
          additional
          required vendor
          documents.
        </p>
      </div>

      {/* Footer */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-700">
            {summary}
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Secure vendor
            onboarding &
            fast approval
          </p>
        </div>

        <button
          type="submit"
          disabled={
            !isValid ||
            busy
          }
          className="min-w-[220px] rounded-2xl bg-[#7b1238] px-6 py-3.5 font-semibold text-white shadow-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {busy
            ? "Submitting..."
            : "Continue to KYC"}
        </button>
      </div>
    </form>
  );
};

const Field = ({
  label,
  children,
  error,
  required,
}) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {label}

      {required && (
        <span className="text-red-500 ml-1">
          *
        </span>
      )}
    </label>

    {children}

    {error && (
      <p className="mt-2 text-xs text-red-500">
        {error}
      </p>
    )}
  </div>
);

const inputClass = (
  hasError
) =>
  `w-full rounded-2xl border px-4 py-3.5 text-sm outline-none transition resize-none ${
    hasError
      ? "border-red-300 ring-2 ring-red-100"
      : "border-slate-300 focus:ring-2 focus:ring-[#7b1238]/20 focus:border-[#7b1238]"
  }`;

export default VendorBasicForm;