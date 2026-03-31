// components/forms/RegisterForm.jsx
import { useState } from "react";

export default function RegisterForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    subscribeNewsletter: false,
    agreeTerms: false,
  });

  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const validatePassword = (password) => {
    const validations = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
    };
    setPasswordValidations(validations);
    return Object.values(validations).every(Boolean);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setForm({ ...form, [name]: newValue });

    if (name === "password") {
      validatePassword(value);
      setShowPasswordRequirements(value.length > 0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const isPasswordValid = validatePassword(form.password);
    if (!isPasswordValid) {
      alert("Please ensure your password meets all requirements");
      return;
    }

    if (!form.agreeTerms) {
      alert("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    const submitData = {
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      password: form.password,
      password_confirmation: form.confirmPassword,
      mobile: "",
      subscribe_newsletter: form.subscribeNewsletter,
    };

    onSubmit(submitData);
  };

  const getValidationIcon = (isValid) => {
    if (form.password === "") return null;
    return isValid ? (
      <span className="text-green-500 ml-1">✓</span>
    ) : (
      <span className="text-pink-400 ml-1">✗</span>
    );
  };

  const getValidationTextColor = (isValid) => {
    if (form.password === "") return "text-gray-500";
    return isValid ? "text-green-600" : "text-pink-500";
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Name Fields - Two Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm font-medium text-pink-800 mb-1.5">
            First Name
          </label>
          <input
            name="firstName"
            type="text"
            placeholder="John"
            value={form.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-pink-200 rounded-lg focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-200 text-gray-900 placeholder-pink-300 text-sm sm:text-base"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-pink-800 mb-1.5">
            Last Name
          </label>
          <input
            name="lastName"
            type="text"
            placeholder="Doe"
            value={form.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-pink-200 rounded-lg focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-200 text-gray-900 placeholder-pink-300 text-sm sm:text-base"
            required
          />
        </div>
      </div>

      {/* Email Field */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-pink-800 mb-1.5">
          Email Address
        </label>
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-pink-200 rounded-lg focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-200 text-gray-900 placeholder-pink-300 text-sm sm:text-base"
          required
        />
      </div>

      {/* Password Field */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-pink-800 mb-1.5">
          Password
        </label>
        <input
          name="password"
          type="password"
          placeholder="At least 8 characters"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-pink-200 rounded-lg focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-200 text-gray-900 placeholder-pink-300 text-sm sm:text-base"
          required
        />
        
        {/* Password Requirements */}
        {showPasswordRequirements && (
          <div className="mt-2 p-3 bg-pink-50 rounded-lg border border-pink-100">
            <p className="text-xs font-medium text-pink-800 mb-2">
              Password must include:
            </p>
            <ul className="space-y-1 text-xs">
              <li className={`flex items-center ${getValidationTextColor(passwordValidations.length)}`}>
                {getValidationIcon(passwordValidations.length)}
                <span className="ml-1">At least 8 characters</span>
              </li>
              <li className={`flex items-center ${getValidationTextColor(passwordValidations.uppercase)}`}>
                {getValidationIcon(passwordValidations.uppercase)}
                <span className="ml-1">One uppercase letter</span>
              </li>
              <li className={`flex items-center ${getValidationTextColor(passwordValidations.lowercase)}`}>
                {getValidationIcon(passwordValidations.lowercase)}
                <span className="ml-1">One lowercase letter</span>
              </li>
              <li className={`flex items-center ${getValidationTextColor(passwordValidations.number)}`}>
                {getValidationIcon(passwordValidations.number)}
                <span className="ml-1">One number</span>
              </li>
              <li className={`flex items-center ${getValidationTextColor(passwordValidations.specialChar)}`}>
                {getValidationIcon(passwordValidations.specialChar)}
                <span className="ml-1">One special character (!@#$%^&*)</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-pink-800 mb-1.5">
          Confirm Password
        </label>
        <input
          name="confirmPassword"
          type="password"
          placeholder="Repeat your password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-pink-200 rounded-lg focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-200 text-gray-900 placeholder-pink-300 text-sm sm:text-base"
          required
        />
        {form.confirmPassword && form.password !== form.confirmPassword && (
          <p className="mt-1 text-xs text-pink-600 flex items-center gap-1">
            <span>⚠️</span> Passwords do not match
          </p>
        )}
        {form.confirmPassword && form.password === form.confirmPassword && form.password !== "" && (
          <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
            <span>✓</span> Passwords match
          </p>
        )}
      </div>

      {/* Newsletter Checkbox */}
      <div className="mb-4">
        <label className="flex items-start gap-2 cursor-pointer group">
          <input
            type="checkbox"
            name="subscribeNewsletter"
            checked={form.subscribeNewsletter}
            onChange={handleChange}
            className="mt-0.5 w-4 h-4 text-pink-600 border-pink-300 rounded focus:ring-pink-400 focus:ring-2 cursor-pointer"
          />
          <span className="text-sm text-pink-700 group-hover:text-pink-900 transition leading-tight">
            Subscribe to our newsletter for exclusive offers and updates
          </span>
        </label>
      </div>

      {/* Terms Checkbox */}
      <div className="mb-6">
        <label className="flex items-start gap-2 cursor-pointer group">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={form.agreeTerms}
            onChange={handleChange}
            className="mt-0.5 w-4 h-4 text-pink-600 border-pink-300 rounded focus:ring-pink-400 focus:ring-2 cursor-pointer"
            required
          />
          <span className="text-sm text-pink-700 group-hover:text-pink-900 transition leading-tight">
            I agree to the{" "}
            <a href="/terms" className="text-pink-700 hover:text-pink-800 hover:underline font-medium">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-pink-700 hover:text-pink-800 hover:underline font-medium">
              Privacy Policy
            </a>
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-pink-700 hover:bg-pink-800 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
        style={{ backgroundColor: '#8b0d3a' }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#6f0a2e'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#8b0d3a'}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating account...
          </span>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
}