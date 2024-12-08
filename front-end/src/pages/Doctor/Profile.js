import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { updateUser } from '../../services/authService'; // Assuming your updateUser is in authService
import { useNavigate } from 'react-router-dom';
import useSweetAlert from "../../components/notifications";

const Profile = () => {
  const { showSuccessAlert, showErrorAlert } = useSweetAlert();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  // Fetch the user's profile only once when the component mounts
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); // Get user from localStorage
    if (user) {
      setInitialValues({
        name: user.name || '',
        email: user.email || '',
        password: '',
      });
    } else {
      console.error('No user found in local storage');
      showErrorAlert('No user data found.');
    }
  }, []); // Empty dependency array means it runs only once when the component mounts

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .matches(/[a-zA-Z0-9]/, 'Password must be alphanumeric'),
    
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    enableReinitialize: true, 
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { name, email, password } = values;
        const updatedProfile = { name, email, password };
        const user = JSON.parse(localStorage.getItem('user')); // Assuming the user is stored in localStorage

        // Update the user profile
        const response = await updateUser(user.id, updatedProfile); // Pass the correct userId here

        // If the update is successful, update the form and local storage
        if (response ) {
          // Update the user in localStorage
          const updatedUser = { ...user, name, email }; // You can update more fields as needed
          localStorage.setItem('user', JSON.stringify(updatedUser));

          // Update the form values with the new data
          setInitialValues({ ...updatedUser, password: '' });

          showSuccessAlert('Profile updated successfully');
        } else {
          showErrorAlert('Failed to update profile');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        showErrorAlert('Failed to update profile');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
  <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Edit Profile</h2>
  <form onSubmit={formik.handleSubmit} className="space-y-6">
    {/* Name Field */}
    <div>
      <label htmlFor="name" className="block text-lg font-medium text-gray-700">Name</label>
      <input
        type="text"
        id="name"
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        required
      />
      {formik.touched.name && formik.errors.name && (
        <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
      )}
    </div>

    {/* Email Field */}
    <div>
      <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        required
      />
      {formik.touched.email && formik.errors.email && (
        <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
      )}
    </div>

    {/* Password Field */}
    <div>
      <label htmlFor="password" className="block text-lg font-medium text-gray-700">New Password</label>
      <input
        type="password"
        id="password"
        name="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="Keep it empty if you don't want to change the password"
        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      />
      {formik.touched.password && formik.errors.password && (
        <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
      )}
    </div>

    {/* Submit Button */}
    <div className="flex justify-center">
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        disabled={loading}
      >
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </div>
  </form>
</div>

  );
};

export default Profile;
