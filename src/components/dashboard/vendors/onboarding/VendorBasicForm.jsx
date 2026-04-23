import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";

const MAX_DESCRIPTION = 300;

const VendorBasicForm = ({
  form = {
    phone: "",
    store_name: "",
    description: "",
  },
  setForm,
  loading = false,
  onSubmit,
}) => {
  const firstErrorRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      phone: form.phone || "",
      store_name: form.store_name || "",
      description: form.description || "",
    },
  });

  const descriptionValue =
    watch("description") || "";

  // Sync external state if parent changes
  useEffect(() => {
    setValue("phone", form.phone || "");
    setValue(
      "store_name",
      form.store_name || ""
    );
    setValue(
      "description",
      form.description || ""
    );
  }, [form, setValue]);

  // Focus first invalid field
  useEffect(() => {
    const firstErrorKey =
      Object.keys(errors)[0];

    if (!firstErrorKey) return;

    const el =
      document.querySelector(
        `[name="${firstErrorKey}"]`
      );

    el?.focus();
  }, [errors]);

  const phoneRegister = register(
    "phone",
    {
      required:
        "Phone number is required",
      validate: (value) => {
        const clean =
          value.replace(/\D/g, "");

        if (
          clean.length < 10 ||
          clean.length > 12
        ) {
          return "Enter valid phone number";
        }

        return true;
      },
      onChange: (e) => {
        const clean =
          e.target.value.replace(
            /[^0-9+]/g,
            ""
          );

        setValue(
          "phone",
          clean,
          {
            shouldValidate: true,
          }
        );
      },
    }
  );

  const storeRegister = register(
    "store_name",
    {
      required:
        "Store name is required",
      minLength: {
        value: 3,
        message:
          "Store name must be at least 3 characters",
      },
      validate: (value) =>
        value.trim().length >= 3 ||
        "Store name is required",
    }
  );

  const descRegister = register(
    "description",
    {
      maxLength: {
        value: MAX_DESCRIPTION,
        message:
          "Description too long",
      },
    }
  );

  const remaining =
    MAX_DESCRIPTION -
    descriptionValue.length;

  const submitHandler = async (
    values
  ) => {
    const payload = {
      phone: values.phone.trim(),
      store_name:
        values.store_name.trim(),
      description:
        values.description.trim(),
    };

    try {
      setForm?.(payload);
      await onSubmit?.(payload);
    } catch (err) {
      setError("root", {
        message:
          err?.message ||
          "Submission failed",
      });
    }
  };

  const isBusy =
    loading || isSubmitting;

  const formSummary = useMemo(
    () => ({
      hasErrors:
        Object.keys(errors).length >
        0,
      ready: isValid,
    }),
    [errors, isValid]
  );

  return (
    <form
      onSubmit={handleSubmit(
        submitHandler
      )}
      noValidate
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-slate-900">
          Business Information
        </h3>

        <p className="text-sm text-slate-500 mt-1">
          Tell us about your store
          to start vendor
          onboarding.
        </p>
      </div>

      {/* Global Error */}
      {errors.root && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors.root.message}
        </div>
      )}

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Phone Number
        </label>

        <input
          id="phone"
          type="text"
          name="phone"
          autoComplete="tel"
          placeholder="Enter phone number"
          aria-invalid={
            !!errors.phone
          }
          aria-describedby="phone-error"
          {...phoneRegister}
          ref={(e) => {
            phoneRegister.ref(e);
            if (
              errors.phone &&
              !firstErrorRef.current
            ) {
              firstErrorRef.current =
                e;
            }
          }}
          className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
            errors.phone
              ? "border-red-300 ring-2 ring-red-100"
              : "border-slate-300 focus:ring-2 focus:ring-[#7b1238]/20"
          }`}
        />

        {errors.phone && (
          <p
            id="phone-error"
            className="mt-2 text-xs text-red-500"
          >
            {
              errors.phone
                .message
            }
          </p>
        )}
      </div>

      {/* Store Name */}
      <div>
        <label
          htmlFor="store_name"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Store Name
        </label>

        <input
          id="store_name"
          type="text"
          name="store_name"
          placeholder="Your brand / business name"
          aria-invalid={
            !!errors.store_name
          }
          aria-describedby="store-error"
          {...storeRegister}
          className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
            errors.store_name
              ? "border-red-300 ring-2 ring-red-100"
              : "border-slate-300 focus:ring-2 focus:ring-[#7b1238]/20"
          }`}
        />

        {errors.store_name && (
          <p
            id="store-error"
            className="mt-2 text-xs text-red-500"
          >
            {
              errors
                .store_name
                .message
            }
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Store Description
        </label>

        <textarea
          id="description"
          rows="5"
          name="description"
          placeholder="Tell customers about your products and business"
          aria-invalid={
            !!errors.description
          }
          aria-describedby="description-error"
          {...descRegister}
          className={`w-full rounded-xl border px-4 py-3 outline-none resize-none transition ${
            errors.description
              ? "border-red-300 ring-2 ring-red-100"
              : "border-slate-300 focus:ring-2 focus:ring-[#7b1238]/20"
          }`}
        />

        <div className="mt-2 flex items-center justify-between">
          {errors.description ? (
            <p
              id="description-error"
              className="text-xs text-red-500"
            >
              {
                errors
                  .description
                  .message
              }
            </p>
          ) : (
            <span />
          )}

          <p
            className={`text-xs ${
              remaining < 40
                ? "text-amber-500"
                : "text-slate-400"
            }`}
          >
            {
              descriptionValue.length
            }
            /
            {
              MAX_DESCRIPTION
            }
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
        <p className="text-sm text-slate-600 leading-6">
          Next step: Upload
          business KYC
          documents such as
          GST, PAN, Aadhaar,
          bank proof and
          additional licenses.
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-xs text-slate-500">
          {formSummary.hasErrors
            ? "Please fix highlighted fields"
            : formSummary.ready
            ? "Ready to continue"
            : "Fill required fields"}
        </div>

        <button
          type="submit"
          disabled={
            !isValid || isBusy
          }
          className="min-w-[190px] rounded-xl bg-[#7b1238] px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isBusy
            ? "Submitting..."
            : "Continue to KYC"}
        </button>
      </div>
    </form>
  );
};

export default VendorBasicForm;