import { useState } from "react";
import { useDispatch } from "react-redux";
// import { setUser } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

import FormWrapper from "../../components/common/FormWrapper";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const Login = () => {
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔍 Validate form
  const validate = () => {
    let newErrors = {};

    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🚀 Handle Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      // 🔥 Replace this with real API call later
      const fakeResponse = {
        user: { name: "Ty Op", email: form.email },
        token: "123456",
      };

      // Store in Redux
      dispatch(setUser(fakeResponse.user));

      // Store token (important)
      localStorage.setItem("token", fakeResponse.token);

      // Redirect
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="Login"
      subtitle="Welcome back! Please login to your account"
      onSubmit={handleSubmit}
    >
      {/* Email */}
      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={form.email}
        error={errors.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      {/* Password */}
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={form.password}
        error={errors.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      {/* Button */}
      <Button
        text="Login"
        type="submit"
        fullWidth
        loading={loading}
      />
    </FormWrapper>
  );
};

export default Login;