import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../app/slices/authSlice";
import RegisterForm from "../../components/forms/RegisterForm";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);

  const handleRegister = async (data) => {
    const res = await dispatch(registerUser(data));

    if (res.meta.requestStatus === "fulfilled") {
      navigate("/login"); // Redirect to login after successful registration
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <RegisterForm onSubmit={handleRegister} loading={loading} />
    </div>
  );
}