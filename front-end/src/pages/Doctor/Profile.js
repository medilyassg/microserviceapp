import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAllUsers, updateUser } from "../../services/authService"; // Assuming your updateUser is in authService
import { useNavigate } from "react-router-dom";
import useSweetAlert from "../../components/notifications";
import { getAllPregnancies } from "../../services/patientService";

const Profile = () => {
  const { showSuccessAlert, showErrorAlert } = useSweetAlert();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [doctorPregnancies, setDoctorPregnancies] = useState([]); // Array to hold pregnancies assigned to the doctor

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setInitialValues({
        name: user.name || '',
        email: user.email || '',
        password: '',
      });
      fetchPregnancyInfo(user.id);
      
    } else {
      console.error('No user found in local storage');
      showErrorAlert('No user data found.');
    }
  }, []);
const [users,setUsers]=useState([])
  const fetchPregnancyInfo = async (patientId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));

      const pregnancies = await getAllPregnancies();
      const filteredPregnancy = pregnancies.filter(p => p.doctorName === user.name);
      const users = await getAllUsers();
        const PatientList = users.users;
        setUsers(PatientList);
      if (filteredPregnancy) {
        setDoctorPregnancies(filteredPregnancy);
      } else {
        showErrorAlert('No pregnancy information found for this user.');
      }
    } catch (error) {
      console.error('Error fetching pregnancy information:', error);
      showErrorAlert('Failed to fetch pregnancy information.');
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .matches(/[a-zA-Z0-9]/, 'Password must be alphanumeric'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { name, email, password } = values;
        const updatedProfile = { name, email, password };
        const user = JSON.parse(localStorage.getItem('user'));

        const response = await updateUser(user.id, updatedProfile);
        if (response) {
          const updatedUser = { ...user, name, email };
          localStorage.setItem('user', JSON.stringify(updatedUser));
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
    <div className="container mx-auto p-6" style={{ backgroundColor: '#F4F7FB' }}>
      <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">Doctor Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Profile Form Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 transition-all hover:shadow-2xl border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Profile</h2>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Leave blank if unchanged"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Pregnancy Info Card */}
        {doctorPregnancies.length > 0 && (
  <div className="bg-white shadow-md rounded-lg p-4 transition-all hover:shadow-lg border border-gray-200">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Assigned Patients</h2>
    <div className="space-y-3">
      {doctorPregnancies.map((pregnancy) => (
        <div key={pregnancy.id} className="bg-indigo-50 p-3 rounded-md shadow-sm">
          <strong className="text-md text-indigo-700">Month of Pregnancy</strong>
          <p className="text-xs text-gray-600">{pregnancy.monthOfPregnancy}</p>
          <strong className="text-md text-indigo-700">City</strong>
          <p className="text-xs text-gray-600">{pregnancy.city}</p>
          <strong className="text-md text-indigo-700">Hospital</strong>
          <p className="text-xs text-gray-600">{pregnancy.hospitalName}</p>
          <strong className="text-md text-indigo-700">Patient Name</strong>
          <p className="text-xs text-gray-600">{users.find(p => p.id === pregnancy.patientId)?.name || ""}</p>
        </div>
      ))}
    </div>
  </div>
)}
  
      </div>
    </div>
  );
};

export default Profile;