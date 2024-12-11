import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { loginUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Ensure correct import
import bgimg from '../../images/page-banner1.jpg';
import TheNavbarsub from "../../components/TheNavbarsub";
import TheNavbar from "../../components/TheNavbar";
import TheFooter from "../../components/TheFooter";

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
<div>
<TheNavbarsub />
<TheNavbar />
      <div
        style={{
          background: `linear-gradient(0deg
        , #11182773, #111827), url(${bgimg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="h-full py-10"
      >
        <h2 className="text-center text-3xl text-white font-semibold">
          Sign In
        </h2>
      </div>      
      <div style={{marginLeft:"25%"}}className="container  py-5 md:w-3/6">
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={formik.handleSubmit} className="space-y-3">
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
              className="mt-1 p-2 border block w-full shadow sm:text-sm border-gray-200 outline-none focus:border-blue-500  ring-gray-400 rounded-md"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
            )}

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
              className="mt-1 p-2 border block w-full shadow sm:text-sm border-gray-200 outline-none focus:border-blue-500  ring-gray-400 rounded-md"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your password"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
            )}

          <button
            type="submit"
            className="bg-blue-800 hover:bg-blue-900 transition delay-75 text-gray-100 py-2 px-2.5 w-full my-1.5 rounded-md shadow-md"            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="my-4">
          <h3 className="text-center m-0">
            <span>-----</span> Or sign in with <span>-----</span>
          </h3>
          <div className="bg-white max-w-lg py-2.5 mx-auto rounded-md shadow-md">
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={()=>console.log("sign in with google")}
                className="cursor-pointer rounded-full shadow-xl bg-gray-200 p-1"
              >
                <img src="/img/google.png" alt="google" />
              </button>
              <div className="cursor-pointer rounded-full shadow-xl bg-gray-200 p-1">
                <img src="/img/github.png" alt="github" />
              </div>
              <div className="cursor-pointer rounded-full shadow-xl bg-gray-200 p-1">
                <img src="/img/facebook.png" alt="facebook" />
              </div>
            </div>
          </div>

          
        </div>
      </div>
      <TheFooter />
    </div>
  );
};

export default Login;
