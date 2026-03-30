// import { useDispatch, useSelector } from "react-redux";
// import { loginUser } from "../../app/slices/authSlice";
// import LoginForm from "../../components/forms/LoginForm";
// import { useNavigate, Link } from "react-router-dom";

// export default function Login() {
//   const dispatch = useDispatch(); // ✅ FIXED
//   const navigate = useNavigate(); // ✅ FIXED

//   const { loading, error } = useSelector((state) => state.auth);

//   const handleLogin = async (data) => {
//     const res = await dispatch(loginUser(data));

//     if (res.meta.requestStatus === "fulfilled") {
//       navigate("/home");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
        
//         <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
//           Login to Your Account
//         </h2>

//         {/* Error message */}
//         {error && (
//           <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
//             {error.message || "Login failed"}
//           </div>
//         )}

//         <LoginForm onSubmit={handleLogin} loading={loading} />

//         <p className="text-sm text-center mt-4 text-gray-600">
//           Don’t have an account?{" "}
//           <Link to="/register" className="text-blue-500 hover:underline">
//             Register
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }