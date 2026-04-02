import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../app/slices/authSlice";
import RegisterForm from "../../components/forms/RegisterForm";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleRegister = async (data) => {
    const res = await dispatch(registerUser(data));
    if (res.meta.requestStatus === "fulfilled") {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] px-4">
      <div className="w-full max-w-md">

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

          {/* Top Accent */}
          <div className="h-[3px] bg-[#8b0d3a]" />

          <div className="px-6 py-7">

            {/* Title */}
            <h2 className="text-[20px] font-semibold text-[#400b27] text-center">
              Create Your Account
            </h2>

            <p className="text-[13px] text-gray-500 text-center mt-1 mb-6">
              Sign up to start shopping and enjoy exclusive offers
            </p>

            {/* Error */}
            {error && (
              <p className="text-[13px] text-red-600 text-center mb-4">
                {error.message || "Registration failed"}
              </p>
            )}

            <RegisterForm onSubmit={handleRegister} loading={loading} />

            {/* Footer */}
            <p className="text-center text-[13px] text-gray-500 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#8b0d3a] font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}