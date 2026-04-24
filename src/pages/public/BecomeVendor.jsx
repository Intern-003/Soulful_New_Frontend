import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import usePost from "../../api/hooks/usePost";

import VendorStepper from "../../components/dashboard/vendors/onboarding/VendorStepper";
import VendorBasicForm from "../../components/dashboard/vendors/onboarding/VendorBasicForm";
import DocumentUploader from "../../components/dashboard/vendors/onboarding/DocumentUploader";
import ReviewSubmit from "../../components/dashboard/vendors/onboarding/ReviewSubmit";
import SuccessState from "../../components/dashboard/vendors/onboarding/SuccessState";

const STEP_TOTAL = 4;

const BecomeVendor = () => {
  const navigate = useNavigate();

  const { postData, loading } = usePost();

  const [step, setStep] = useState(1);
  const [vendorId, setVendorId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    phone: "",
    store_name: "",
    description: "",
  });

  const [documents, setDocuments] = useState([]);

  const percent = useMemo(() => {
    return Math.round((step / STEP_TOTAL) * 100);
  }, [step]);

  const next = () => {
    setStep((prev) =>
      Math.min(prev + 1, STEP_TOTAL)
    );
  };

  const back = () => {
    setStep((prev) =>
      Math.max(prev - 1, 1)
    );
  };

  // STEP 1
  const handleBasicSubmit = async (payload) => {
    try {
      setError("");

      const res = await postData({
        url: "/vendor/register",
        data: payload,
      });

      setForm(payload);

      const id =
        res?.data?.id ||
        res?.vendor?.id ||
        res?.data?.vendor?.id ||
        null;

      if (!id) {
        throw new Error(
          "Vendor ID not returned from server."
        );
      }

      setVendorId(id);
      next();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to continue."
      );
    }
  };

  // STEP 2
  const handleDocsContinue = (
    uploadedDocs = []
  ) => {
    setDocuments(uploadedDocs);
    next();
  };

  // STEP 3
  const handleFinalSubmit = async () => {
    try {
      setSubmitting(true);
      setError("");

      await postData({
        url: "/vendor/submit",
        data: {
          vendor_id: vendorId,
        },
      });

      next();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to submit application."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-100 px-4 py-10 md:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
        {/* LEFT PANEL */}
        <aside className="bg-gradient-to-br from-[#7b1238] via-[#8f1644] to-[#5f0d2a] p-8 text-white md:p-12">
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                Soulful Overseas
              </p>

              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">
                Become a Vendor.
                <br />
                Grow Faster.
              </h1>

              <p className="mt-6 max-w-lg text-sm leading-7 text-white/85 md:text-base">
                Join our trusted
                marketplace and
                scale your brand
                with orders,
                payouts,
                logistics and
                premium
                customers.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              {[
                "Reach thousands of active buyers",
                "Manage products & orders in one dashboard",
                "Fast payouts & secure operations",
                "Dedicated support & business growth",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/75">
              Trusted onboarding •
              Secure KYC • Fast
              approval
            </div>
          </div>
        </aside>

        {/* RIGHT PANEL */}
        <main className="max-h-screen overflow-y-auto p-6 md:p-10">
          <div className="mx-auto max-w-2xl">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900">
                Vendor
                Onboarding
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Complete your
                registration in a
                few easy steps.
              </p>
            </div>

            {/* Stepper */}
            <VendorStepper
              currentStep={step}
              totalSteps={STEP_TOTAL}
            />

            {/* Progress */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Step {step} of{" "}
                  {STEP_TOTAL}
                </span>

                <span>
                  {percent}%
                  Completed
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-[#7b1238] transition-all duration-300"
                  style={{
                    width: `${percent}%`,
                  }}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* STEP CONTENT */}
            <div className="mt-8">
              {/* STEP 1 */}
              {step === 1 && (
                <VendorBasicForm
                  form={form}
                  loading={loading}
                  onSubmit={
                    handleBasicSubmit
                  }
                />
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <DocumentUploader
                  vendorId={vendorId}
                  documents={
                    documents
                  }
                  setDocuments={
                    setDocuments
                  }
                  onBack={back}
                  onNext={
                    handleDocsContinue
                  }
                />
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <ReviewSubmit
                  form={form}
                  documents={
                    documents
                  }
                  onBack={back}
                  loading={
                    submitting
                  }
                  onSubmit={
                    handleFinalSubmit
                  }
                />
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <SuccessState
                  title="Application Submitted"
                  subtitle="Your vendor request has been received successfully."
                  buttonText="Go to Home"
                  onClick={() =>
                    navigate("/")
                  }
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default BecomeVendor;