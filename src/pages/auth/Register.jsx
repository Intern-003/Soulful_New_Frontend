import { useDispatch, useSelector } from "react-redux";
import {
  startRegistration,
  completeRegistration,
  resendOtp,
  setResendCooldown,
} from "../../app/slices/authSlice";
import RegisterForm from "../../components/forms/RegisterForm";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, resendCooldown } = useSelector((s) => s.auth);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [otp, setOtp] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [verificationError, setVerificationError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Handle resend cooldown timer
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => {
        setCooldown(cooldown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSendOtp = async (data, type) => {
    const payload = {
      name: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      phone: data.phone,
      password: data.password,
      password_confirmation: data.confirmPassword,
      type: type,
    };

    setFormData(data);
    setSelectedType(type);
    setVerificationError("");

    const res = await dispatch(startRegistration(payload));

    if (res.meta.requestStatus === "fulfilled") {
      setStep(2);
      // Set 30 seconds cooldown
      setCooldown(30);
      dispatch(setResendCooldown(30));
    } else {
      const errorMsg = res.payload?.message || "Failed to send OTP";
      setVerificationError(errorMsg);
      alert(errorMsg);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) {
      alert(`Please wait ${cooldown} seconds before requesting another OTP`);
      return;
    }

    const identifier = selectedType === "email" ? formData.email : formData.phone;
    
    const res = await dispatch(resendOtp({
      identifier: identifier,
      type: selectedType,
    }));

    if (res.meta.requestStatus === "fulfilled") {
      setCooldown(30);
      dispatch(setResendCooldown(30));
      alert("OTP resent successfully!");
    } else {
      alert(res.payload?.message || "Failed to resend OTP");
    }
  };

  const handleCompleteRegistration = async () => {
    if (!otp || otp.length !== 6) {
      alert("Enter valid 6-digit OTP");
      return;
    }

    const identifier = selectedType === "email" ? formData.email : formData.phone;

    const payload = {
      identifier: identifier,
      type: selectedType,
      otp: otp,
    };

    const res = await dispatch(completeRegistration(payload));

    if (res.meta.requestStatus === "fulfilled") {
      alert("Registration successful! Please login to continue.");
      // Navigate to login page after successful registration
      navigate("/login");
    } else {
      const errorMsg = res.payload?.message || "Verification failed";
      setVerificationError(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f5f7] to-[#f0e6ea] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {step === 1 && (
          <RegisterForm
            onSendOtp={handleSendOtp}
            loading={loading}
          />
        )}
        
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#52233c] mb-2">Verify OTP</h2>
              <p className="text-sm text-gray-600">
                We've sent a verification code to{" "}
                <span className="font-medium text-[#8b0d3a]">
                  {selectedType === "email" ? formData.email : formData.phone}
                </span>
              </p>
            </div>

            {verificationError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {verificationError}
              </div>
            )}

            {error && !verificationError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error.message || "An error occurred"}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#52233c] mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full h-12 px-4 border border-gray-300 rounded-lg text-center text-lg font-semibold tracking-wider focus:outline-none focus:ring-2 focus:ring-[#8b0d3a] focus:border-transparent"
                placeholder="XXXXXX"
                autoFocus
              />
            </div>

            <button
              onClick={handleCompleteRegistration}
              disabled={loading || !otp}
              className="w-full bg-[#8b0d3a] hover:bg-[#6b0a2d] text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify & Register"}
            </button>

            <div className="text-center">
              <button
                onClick={handleResendOtp}
                disabled={loading || cooldown > 0}
                className="text-sm text-[#8b0d3a] hover:text-[#6b0a2d] font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
              </button>
            </div>

            <button
              onClick={() => {
                setStep(1);
                setVerificationError("");
                setOtp("");
              }}
              className="w-full text-gray-600 hover:text-[#8b0d3a] text-sm font-medium transition"
            >
              ← Back to registration
            </button>
          </div>
        )}
      </div>
    </div>
  );
}