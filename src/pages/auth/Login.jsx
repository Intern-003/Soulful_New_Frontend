import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../app/slices/authSlice";
import LoginForm from "../../components/forms/LoginForm";
import { useNavigate } from "react-router-dom";

export default function Login() {
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleLogin = async (data) => {
    const res = await dispatch(loginUser(data));

    if (res.meta.requestStatus === "fulfilled") {
      navigate("/");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <LoginForm onSubmit={handleLogin} loading={loading} />
    </div>
  );
}