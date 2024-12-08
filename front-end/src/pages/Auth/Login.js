import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { loginUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Ensure correct import

const Login = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Use navigate in the component

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Please enter your email"),
      password: Yup.string()
        .min(6, "Password should be at least 6 characters")
        .required("Please enter your password"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        // Call the login API
        const response = await loginUser(values.email, values.password);
        console.log("Login Successful:", response);

        // Decode the token to get the user info
        const decodedToken = jwtDecode(response.token);
        // Store the token and decoded user info in localStorage
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(decodedToken));

        // Redirect based on the user's role
        if (decodedToken.role === "admin") {
          navigate("/admin"); // Redirect to admin dashboard
        } else if (decodedToken.role === "doctor") {
          navigate("/doctor"); // Redirect to doctor dashboard
        } else {
          navigate("/patient"); // Redirect to patient dashboard
        }
      } catch (error) {
        setError(error.message); // Set error message if login fails
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your password"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition duration-150"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
