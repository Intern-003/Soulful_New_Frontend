// import { useDispatch, useSelector } from "react-redux";
// import { sendOtp, verifyOtp, registerUser } from "../../app/slices/authSlice";
// import RegisterForm from "../../components/forms/RegisterForm";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Register() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading, error, otpSent, otpVerified } = useSelector((s) => s.auth);

//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({});
//   const [otp, setOtp] = useState("");


//   const [selectedType, setSelectedType] = useState(null);
//   const handleSendOtp = async (data, type) => {

//   if (!data.firstName || !data.lastName) return alert("Enter name");
//   if (!data.password || data.password.length < 6) return alert("Weak password");
//   if (data.password !== data.password_confirmation) return alert("Passwords mismatch");

//   setFormData(data);
//   setSelectedType(type);

//   const identifier = type === "email" ? data.email : data.phone;

//   const res = await dispatch(sendOtp({ identifier, type }));

//   if (res.meta.requestStatus === "fulfilled") {
//     setStep(2);
//   }
// };

//   // STEP 2: verify OTP
//   const handleVerifyOtp = async () => {

//     const identifier =
//       selectedType === "email" ? formData.email : formData.phone;



//     const res = await dispatch(
//       verifyOtp({
//         identifier,
//         type: selectedType,
//         otp,
//       })
//     );

//     if (res.meta.requestStatus === "fulfilled") {
//       // now register user
//       const regRes = await dispatch(
//   registerUser({
//     name: formData.name,
//     email: formData.email,
//     phone: formData.phone,
//     password: formData.password,
//     password_confirmation: formData.password_confirmation,
//     type: selectedType,
//   })
// );

//       if (regRes.meta.requestStatus === "fulfilled") {
//         navigate("/login");
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="w-full max-w-md">


//         <RegisterForm
//           onSendOtp={handleSendOtp}
//           onVerifyOtp={handleVerifyOtp}
//           loading={loading}
//           otpStep={step === 2}
//           otp={otp}
//           setOtp={setOtp}
//         />

//       </div>
//     </div>
//   );
// }

import { useDispatch, useSelector } from "react-redux";
import { sendOtp, verifyOtp, registerUser } from "../../app/slices/authSlice";
import RegisterForm from "../../components/forms/RegisterForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, otpSent, otpVerified } = useSelector((s) => s.auth);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [otp, setOtp] = useState("");
  const [selectedType, setSelectedType] = useState(null);

  const handleSendOtp = async (data, type) => {
    if (!data.firstName || !data.lastName) return alert("Enter name");
    if (!data.password || data.password.length < 6) return alert("Weak password");
    if (data.password !== data.password_confirmation) return alert("Passwords mismatch");
    if (!data.agreeTerms) return alert("Please agree to Terms of Service");

    setFormData(data);
    setSelectedType(type);

    const identifier = type === "email" ? data.email : data.phone;

    const res = await dispatch(sendOtp({ identifier, type }));

    if (res.meta.requestStatus === "fulfilled") {
      setStep(2);
    }
  };

  const handleVerifyOtp = async () => {
    const identifier = selectedType === "email" ? formData.email : formData.phone;

    const res = await dispatch(
      verifyOtp({
        identifier,
        type: selectedType,
        otp,
      })
    );

    if (res.meta.requestStatus === "fulfilled") {
      const regRes = await dispatch(
        registerUser({
          name: `${formData.firstName} ${formData.lastName}`, // ✅ Fixed
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
          type: selectedType,
        })
      );

      if (regRes.meta.requestStatus === "fulfilled") {
        navigate("/login");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-[#52233c] mb-6 text-center">
          Create Account
        </h2>
        
        <RegisterForm
          onSendOtp={handleSendOtp}
          onVerifyOtp={handleVerifyOtp}
          loading={loading}
          otpStep={step === 2}
          otp={otp}
          setOtp={setOtp}
          selectedType={selectedType}
        />
      </div>
    </div>
  );
}