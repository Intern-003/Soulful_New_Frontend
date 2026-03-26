import { useState } from "react";
import { useDispatch } from "react-redux";
// 
import { useNavigate } from "react-router-dom";

import FormWrapper from "../../components/common/FormWrapper";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔍 Validation
  const validate = () => {
    let newErrors = {};

    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    if (!form.confirmPassword)
      newErrors.confirmPassword = "Confirm your password";

    if (
      form.password &&
      form.confirmPassword &&
      form.password !== form.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🚀 Handle Register
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      // 🔥 Replace with real API later
      const fakeResponse = {
        user: { name: form.name, email: form.email },
        token: "abcdef",
      };

      // Store in Redux
      dispatch(setUser(fakeResponse.user));

      // Store token
      localStorage.setItem("token", fakeResponse.token);

      // Redirect
      navigate("/dashboard");
    } catch (error) {
      console.error("Register Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="Register"
      subtitle="Create your account"
      onSubmit={handleSubmit}
    >
      {/* Name */}
      <Input
        label="Full Name"
        placeholder="Enter your name"
        value={form.name}
        error={errors.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

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
        placeholder="Enter password"
        value={form.password}
        error={errors.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      {/* Confirm Password */}
      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm password"
        value={form.confirmPassword}
        error={errors.confirmPassword}
        onChange={(e) =>
          setForm({
            ...form,
            confirmPassword: e.target.value,
          })
        }
      />

      {/* Button */}
      <Button
        text="Register"
        type="submit"
        fullWidth
        loading={loading}
      />
    </FormWrapper>
  );

  <p className="text-sm text-center mt-4">
  Already have an account?{" "}
  <span
    className="text-blue-600 cursor-pointer"
    onClick={() => navigate("/login")}
  >
    Login
  </span>
</p>

};

export default Register;