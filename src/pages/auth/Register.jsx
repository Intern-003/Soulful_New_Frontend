import { useDispatch, useSelector } from "react-redux";
import { sendOtp, completeRegistration } from "../../app/slices/authSlice";
import RegisterForm from "../../components/forms/RegisterForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, otpSent } = useSelector((s) => s.auth);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [otp, setOtp] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [verificationError, setVerificationError] = useState("");

  const handleSendOtp = async (data, type) => {
    // Validate
    if (!data.firstName || !data.firstName.trim()) {
      alert("Please enter first name");
      return;
    }
    if (!data.lastName || !data.lastName.trim()) {
      alert("Please enter last name");
      return;
    }
    if (!data.password || data.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!data.agreeTerms) {
      alert("Please agree to Terms of Service");
      return;
    }

    const identifier = type === "email" ? data.email : data.phone;
    if (!identifier) {
      alert(`Please enter ${type === "email" ? "email" : "phone number"}`);
      return;
    }

    if (type === "email" && !identifier.includes("@")) {
      alert("Please enter valid email");
      return;
    }

    setFormData(data);
    setSelectedType(type);
    setVerificationError("");

    const res = await dispatch(sendOtp({ identifier, type }));

    if (res.meta.requestStatus === "fulfilled") {
      setStep(2);
    } else {
      alert(res.payload?.message || "Failed to send OTP");
    }
  };

  const handleCompleteRegistration = async () => {
    if (!otp || otp.length !== 6) {
      alert("Please enter valid 6-digit OTP");
      return;
    }

    const identifier = selectedType === "email" ? formData.email : formData.phone;
    
    // Combine all registration data with OTP verification
    const registrationData = {
      identifier: identifier,
      type: selectedType,
      otp: otp,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      password: formData.password,
      password_confirmation: formData.confirmPassword,
    };

    const res = await dispatch(completeRegistration(registrationData));

    if (res.meta.requestStatus === "fulfilled") {
      alert("Registration successful! Please login.");
      navigate("/login");
    } else {
      setVerificationError(res.payload?.message || "Registration failed");
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
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {verificationError}
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
              />
            </div>

            <button
              onClick={handleCompleteRegistration}
              disabled={loading || !otp}
              className="w-full bg-[#8b0d3a] hover:bg-[#6b0a2d] text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify & Register"}
            </button>

            <button
              onClick={() => setStep(1)}
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