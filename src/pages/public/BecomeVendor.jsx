import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import usePost from "../../api/hooks/usePost";

import VendorStepper from "../../components/dashboard/vendors/onboarding/VendorStepper";
import VendorBasicForm from "../../components/dashboard/vendors/onboarding/VendorBasicForm";
import DocumentUploader from "../../components/dashboard/vendors/onboarding/DocumentUploader";
import ReviewSubmit from "../../components/dashboard/vendors/onboarding/ReviewSubmit";
import SuccessState from "../../components/dashboard/vendors/onboarding/SuccessState";

const BENEFITS = [
  "Reach thousands of active buyers across categories",
  "Manage products, inventory & orders in one dashboard",
  "Fast payouts with secure vendor operations",
  "Dedicated support & business growth tools",
];

const STEP_LABELS = [
  "Business Details",
  "KYC Upload",
  "Review",
  "Completed",
];

const BecomeVendor = () => {
  const navigate = useNavigate();
  const { postData, loading } = usePost();

  const [step, setStep] = useState(1);
  const [vendorId, setVendorId] = useState(null);

  const [form, setForm] = useState({
    phone: "",
    store_name: "",
    description: "",
  });

  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isBusinessValid = useMemo(() => {
    return (
      form.phone.trim().length >= 10 &&
      form.store_name.trim().length >= 3
    );
  }, [form]);

  const clearAlerts = () => {
    setError("");
    setSuccess("");
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleRegister = async () => {
    clearAlerts();

    try {
      const res = await postData({
        url: "/vendor/register",
        data: form,
      });

      const createdVendorId = res?.data?.id;

      if (!createdVendorId) {
        setError("Vendor created but vendor ID missing.");
        return;
      }

      setVendorId(createdVendorId);
      setSuccess(
        res?.message ||
          "Vendor request created successfully."
      );

      setStep(2);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to create vendor request."
      );
    }
  };

  const handleFinalSubmit = () => {
    clearAlerts();
    setSuccess(
      "Vendor onboarding completed successfully."
    );
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* LEFT SIDE */}
        <div className="rounded-3xl bg-gradient-to-br from-[#7b1238] to-[#a61f54] p-8 text-white shadow-xl">
          <div className="mb-10">
            <span className="uppercase tracking-[0.3em] text-xs text-pink-100">
              Soulful Overseas
            </span>

            <h1 className="text-4xl font-bold mt-4 leading-tight">
              Become a Vendor
              <br />
              Grow Your Business
            </h1>

            <p className="mt-5 text-pink-100 leading-7 text-sm">
              Join our trusted marketplace and sell to
              thousands of customers with smooth logistics,
              secure payments and modern seller tools.
            </p>
          </div>

          <div className="space-y-4">
            {BENEFITS.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl bg-white/10 px-4 py-4"
              >
                <div className="h-8 w-8 rounded-full bg-white text-[#7b1238] flex items-center justify-center font-bold shrink-0">
                  ✓
                </div>

                <p className="text-sm leading-6">
                  {item}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-white/20 pt-6 text-sm text-pink-100">
            Trusted onboarding • Secure KYC • Fast approval
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800">
              Vendor Onboarding
            </h2>

            <p className="text-slate-500 mt-2 text-sm">
              Complete your registration in a few easy
              steps.
            </p>
          </div>

          <VendorStepper
            step={step}
            steps={STEP_LABELS}
          />

          {/* ALERTS */}
          {error && (
            <div className="mt-6 mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-6 mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <VendorBasicForm
              form={form}
              setForm={setForm}
              loading={loading}
              disabled={!isBusinessValid}
              onSubmit={handleRegister}
            />
          )}

          {/* STEP 2 */}
          {step === 2 && vendorId && (
            <DocumentUploader
              vendorId={vendorId}
              documents={documents}
              setDocuments={setDocuments}
              onBack={prevStep}
              onNext={nextStep}
            />
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <ReviewSubmit
              form={form}
              vendorId={vendorId}
              documents={documents}
              onBack={prevStep}
              onSubmit={handleFinalSubmit}
            />
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <SuccessState
              title="Vendor Request Submitted"
              description="Your vendor profile and KYC documents were submitted successfully. Our team will review and approve soon."
              primaryLabel="Go To Home"
              onPrimary={() => navigate("/")}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BecomeVendor;