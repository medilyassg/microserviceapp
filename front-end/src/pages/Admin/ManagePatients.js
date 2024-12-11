import React, { useState, useEffect } from "react";
import { FaUserPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import useSweetAlert from "../../components/notifications";
import {
  getAllPregnancies,
  createPregnancy,
  updatePregnancy,
  deletePatient,
  deletePregnancy,
} from "../../services/patientService";
import { getAllUsers } from "../../services/authService";

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const { showSuccessAlert, showErrorAlert } = useSweetAlert();
  const [doctors, setDoctors] = useState([]);
  const [userlist,setuserlist]=useState([])
  useEffect(() => {
    const fetchPregnancies = async () => {
      try {
        const pregnancies = await getAllPregnancies();
        setPatients(pregnancies);
        const users = await getAllUsers();
        const doctorList = users.users.filter((user) => user.role === "doctor");
        setuserlist(users.users)
        setDoctors(doctorList);

      } catch (error) {
        showErrorAlert("Error fetching pregnancies data.");
      }
    };
    fetchPregnancies();
  }, []);

  const handleAddPatient = async (patient) => {
    try {
      const addedPatient = await createPregnancy(patient);
      setPatients([...patients, addedPatient]);
      const doctor = doctors.find((doc) => doc.name === patient.doctorName);

    if (!doctor) throw new Error("Doctor not found");

    // Prepare the payload for notification
    const notificationPayload = {
      type: "PATIENT_ADDED",
      payload: {
        doctorEmail: doctor.email, // Ensure the doctor's email is included in the data
        doctorName: doctor.name,
        patientName: patient.name,
        patientEmail: patient.email,
        pregnancyMonth: patient.monthOfPregnancy,
        city: patient.city,
        hospitalName: patient.hospitalName,
      },
    };

    // Send notification to the back-end
    await fetch("http://localhost:3005/api/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notificationPayload),
    });
      showSuccessAlert("New patient added successfully!");
      setIsAddModalOpen(false);
    } catch (error) {
      showErrorAlert("Failed to add patient.");
    }
  };

  const handleEditPatient = async (updatedPatient) => {
    try {
      const response = await updatePregnancy(updatedPatient);
      setPatients(
        patients.map((patient) =>
          patient.id === updatedPatient.id ? response : patient
        )
      );
      showSuccessAlert("Patient updated successfully!");
      setIsEditModalOpen(false);
    } catch (error) {
      showErrorAlert("Failed to update patient.");
    }
  };

  const handleDeletePatient = async (id) => {
    try {
      await deletePregnancy(id);
      setPatients(patients.filter((patient) => patient.id !== id));
      showSuccessAlert("Patient deleted successfully!");
      setIsDeleteModalOpen(false);
    } catch (error) {
      showErrorAlert("Failed to delete patient.");
    }
  };

  return (
    <div className="container mx-auto p-6" style={{ backgroundColor: '#F4F7FB' }}>
    <div className="flex justify-between items-center m-4 mb-6">
      <h2 className="text-2xl font-semibold text-gray-800">Manage pregnancies</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center py-2 px-4 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 transition duration-300"
        >
          <FaUserPlus className="mr-2" />
          Add New Pregnancy
        </button>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg bg-white">
        <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="py-3 px-6 text-left text-gray-600">Patient Name</th>
            <th className="py-3 px-6 text-left text-gray-600">Month of Pregnancy</th>
            <th className="py-3 px-6 text-left text-gray-600">City</th>
            <th className="py-3 px-6 text-left text-gray-600">Doctor</th>
            <th className="py-3 px-6 text-left text-gray-600">Hospital</th>
            <th className="py-3 px-6 text-left text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id} className="border-t">
              <td className="py-3 px-6 text-gray-800">{userlist.find(p => p.id === patient.patientId)?.name || ""}</td>
              <td className="py-3 px-6 text-gray-800">{patient.monthOfPregnancy}</td>
              <td className="py-3 px-6 text-gray-800">{patient.city}</td>
              <td className="py-3 px-6 text-gray-800">{patient.doctorName}</td>
              <td className="py-3 px-6 text-gray-800">{patient.hospitalName}</td>
              <td className="py-3 px-6 text-gray-800">
                <button
                  onClick={() => {
                    setCurrentPatient(patient);
                    setIsEditModalOpen(true);
                  }}
                  className="mr-4 text-yellow-500 hover:text-yellow-600 transition duration-300"
                  >
                  <FaEdit />
                </button>
                <button
                  onClick={() => {
                    setCurrentPatient(patient);
                    setIsDeleteModalOpen(true);
                  }}
                  className="text-red-500 hover:text-red-600 transition duration-300"
                  >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {/* Add Patient Modal */}
      {isAddModalOpen && (
       <div className="fixed  inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
       <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
         <h3 className="text-2xl font-semibold text-gray-800 mb-6">Add New Pregnancy</h3>
         <form
           onSubmit={(e) => {
             e.preventDefault();
             const patient = {
               name: e.target.name.value,
               email: e.target.email.value,
               password: e.target.password.value,
               monthOfPregnancy: e.target.monthOfPregnancy.value,
               city: e.target.city.value,
               hospitalName: e.target.hospitalName.value,
               doctorName: e.target.doctorName.value,
             };
             handleAddPatient(patient);
           }}
         >
           {/* Pairing Patient Name and Email Address */}
           <div className="flex space-x-4 mb-4">
             <input
               type="text"
               name="name"
               placeholder="Patient Name"
               className="w-1/2 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
               required
             />
             <input
               type="email"
               name="email"
               placeholder="Email Address"
               className="w-1/2 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
               required
             />
           </div>
     
           {/* Pairing City and Hospital Name */}
           <div className="flex space-x-4 mb-4">
             <input
               type="text"
               name="city"
               placeholder="City"
               className="w-1/2 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
               required
             />
             <input
               type="text"
               name="hospitalName"
               placeholder="Hospital Name"
               className="w-1/2 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
               required
             />
           </div>
     
           {/* Dropdown and Month of Pregnancy */}
           <div className="flex space-x-4 mb-4">
             <select
               name="doctorName"
               className="w-1/2 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
               required
             >
               <option value="" disabled selected>
                 Select Doctor
               </option>
               {doctors.map((doctor) => (
                 <option key={doctor.id} value={doctor.name}>
                   {doctor.name}
                 </option>
               ))}
             </select>
             <input
               type="number"
               name="monthOfPregnancy"
               placeholder="Month of Pregnancy"
               className="w-1/2 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
               min="1"
               max="9"
               required
             />
           </div>
     
           {/* Password */}
           <input
             type="password"
             name="password"
             placeholder="Password"
             className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
             required
           />
     
           {/* Buttons */}
           <div className="flex justify-between mt-4">
             <button
               type="submit"
               className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-300"
             >
               Save
             </button>
             <button
               type="button"
               onClick={() => setIsAddModalOpen(false)}
               className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition duration-300"
             >
               Cancel
             </button>
           </div>
         </form>
       </div>
     </div>
     
)}


      {/* Edit Patient Modal */}
      {isEditModalOpen && currentPatient && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 className="text-xl mb-4">Edit Pregnancy</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const updatedPatient = {
                id: currentPatient.id,
                monthOfPregnancy: e.target.monthOfPregnancy.value,
                city: e.target.city.value,
                doctorName: e.target.doctorName.value,
                hospitalName: e.target.hospitalName.value,
              };
              handleEditPatient(updatedPatient);
            }}
          >
            {/* Pairing City and Hospital Name */}
            <div className="flex space-x-4 mb-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="city">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  defaultValue={currentPatient.city}
                  placeholder="City"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="hospitalName">
                  Hospital Name
                </label>
                <input
                  type="text"
                  id="hospitalName"
                  name="hospitalName"
                  defaultValue={currentPatient.hospitalName}
                  placeholder="Hospital Name"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
      
            {/* Pairing Doctor Name and Month of Pregnancy */}
            <div className="flex space-x-4 mb-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="doctorName">
                  Doctor Name
                </label>
                <select
                  id="doctorName"
                  name="doctorName"
                  defaultValue={currentPatient.doctorName}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="" disabled>
                    Select Doctor
                  </option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.name}>
                      {doctor.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="monthOfPregnancy">
                  Month of Pregnancy
                </label>
                <input
                  type="number"
                  id="monthOfPregnancy"
                  name="monthOfPregnancy"
                  defaultValue={currentPatient.monthOfPregnancy}
                  placeholder="Month"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  min="1"
                  max="9"
                  required
                />
              </div>
            </div>
      
            {/* Buttons */}
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      
      )}

      {/* Delete Patient Modal */}
      {isDeleteModalOpen && currentPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Delete Patient</h3>
            <p className="text-gray-600">Are you sure you want to delete this patient?</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleDeletePatient(currentPatient.id)}
                className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition duration-300"
              >
                Yes, Delete
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePatients;
