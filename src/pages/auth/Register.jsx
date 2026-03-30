// import { useDispatch, useSelector } from "react-redux";
// import { registerUser } from "../../app/slices/authSlice";
// import RegisterForm from "../../components/forms/RegisterForm";
// import { useNavigate, Link } from "react-router-dom";

// export default function Register() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { loading, error } = useSelector((state) => state.auth);

//   const handleRegister = async (data) => {
//     const res = await dispatch(registerUser(data));

//     if (res.meta.requestStatus === "fulfilled") {
//       navigate("/login");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
        
//         <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
//           Create Account
//         </h2>

//         {/* Error message */}
//         {error && (
//           <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
//             {error.message || "Registration failed"}
//           </div>
//         )}

//         <RegisterForm onSubmit={handleRegister} loading={loading} />

//         <p className="text-sm text-center mt-4 text-gray-600">
//           Already have an account?{" "}
//           <Link to="/login" className="text-green-500 hover:underline">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }