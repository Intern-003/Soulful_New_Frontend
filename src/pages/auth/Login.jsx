import { useDispatch, useSelector } from "react-redux";
import { loginUser, googleLogin } from "../../app/slices/authSlice";
import LoginForm from "../../components/forms/LoginForm";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (data) => {
    const res = await dispatch(loginUser(data));
    if (res.meta.requestStatus === "fulfilled") {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">

          {/* Top Border Accent */}
          <div className="h-1 bg-[#8b0d3a]" />

          <div className="p-6 sm:p-8">

            {/* Title */}
            <h2 className="text-2xl font-semibold text-center text-[#640b39]">
              Login
            </h2>

            <p className="text-sm text-center text-gray-500 mt-1 mb-6">
              Welcome back! Please enter your details
            </p>

            {/* Error */}
            {error && (
              <div className="mb-4 text-sm text-red-600 text-center">
                {error.message || "Invalid email or password"}
              </div>
            )}

            {/* Form */}
            <LoginForm onSubmit={handleLogin} loading={loading} />

            {/* Divider */}
            {/* <div className="flex items-center my-1"> */}
            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="px-3 text-sm text-gray-500">OR</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            {/* </div> */}

            <div className="mt-4">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (!credentialResponse?.credential) return;

                  const res = await dispatch(
                    googleLogin(credentialResponse.credential)
                  );

                  if (res.meta.requestStatus === "fulfilled") {
                    navigate("/home");
                  }
                }}
                onError={() => {
                  alert("Google login failed. Try again.");
                }}
              />
            </div>
            {/* Footer */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-[#8b0d3a] font-medium hover:underline"
              >
                Sign up for free
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}