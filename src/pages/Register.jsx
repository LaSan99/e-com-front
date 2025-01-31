import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/api";
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "../store/slices/authSlice";
import { FaUser, FaEnvelope, FaLock, FaShieldAlt } from "react-icons/fa";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      dispatch(registerFailure("Passwords do not match"));
      return;
    }

    try {
      dispatch(registerStart());
      const { data } = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      dispatch(registerSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(
        registerFailure(error.response?.data?.message || "Registration failed")
      );
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative bg-gradient-to-br from-gray-900 via-primary to-primary-hover">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M36%2C34.16%2032%2C38.32%2028%2C34.16%2024%2C38.32%2020%2C34.16%2016%2C38.32%2012%2C34.16%208%2C38.32%204%2C34.16%200%2C38.32%200%2C34.16%204%2C30%200%2C25.84%204%2C21.68%200%2C17.52%204%2C13.36%200%2C9.2%204%2C5.04%200%2C0.88%204%2C-3.28%208%2C0.88%2012%2C-3.28%2016%2C0.88%2020%2C-3.28%2024%2C0.88%2028%2C-3.28%2032%2C0.88%2036%2C-3.28%2040%2C0.88%2044%2C-3.28%2048%2C0.88%2052%2C-3.28%2056%2C0.88%2060%2C-3.28%2060%2C0.88%2056%2C5.04%2060%2C9.2%2056%2C13.36%2060%2C17.52%2056%2C21.68%2060%2C25.84%2056%2C30%2060%2C34.16%2056%2C38.32%2052%2C34.16%2048%2C38.32%2044%2C34.16%2040%2C38.32z%22%20fill%3D%22%23ffffff%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-repeat"></div>

      <div className="max-w-md w-full relative">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2589/2589903.png"
            alt="Sneaker Store"
            className="h-20 w-20 mx-auto mb-4 drop-shadow-xl"
          />
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">
            Create Account
          </h2>
          <p className="text-gray-200 mt-2">Join our sneaker community today</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/95 backdrop-blur-md p-8 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaShieldAlt className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-hover transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 font-semibold"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:text-primary-hover"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
