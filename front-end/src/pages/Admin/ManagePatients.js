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

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const { showSuccessAlert, showErrorAlert } = useSweetAlert();

  useEffect(() => {
    const fetchPregnancies = async () => {
      try {
        const pregnancies = await getAllPregnancies();
        setPatients(pregnancies);
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
    <div className="p-6">
      {/* Button to add new patient */}
      <div className="mb-4">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center py-2 px-4 bg-indigo-600 text-white rounded-md"
        >
          <FaUserPlus className="mr-2" />
          Add New Patient
        </button>
      </div>

      {/* Patients Table */}
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Name</th>
            <th className="py-2 px-4 border-b text-left">Month of Pregnancy</th>
            <th className="py-2 px-4 border-b text-left">City</th>
            <th className="py-2 px-4 border-b text-left">Doctor</th>
            <th className="py-2 px-4 border-b text-left">Hospital</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td className="py-2 px-4 border-b">{patient.name}</td>
              <td className="py-2 px-4 border-b">{patient.monthOfPregnancy}</td>
              <td className="py-2 px-4 border-b">{patient.city}</td>
              <td className="py-2 px-4 border-b">{patient.doctorName}</td>
              <td className="py-2 px-4 border-b">{patient.hospitalName}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => {
                    setCurrentPatient(patient);
                    setIsEditModalOpen(true);
                  }}
                  className="mr-2 text-yellow-500"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => {
                    setCurrentPatient(patient);
                    setIsDeleteModalOpen(true);
                  }}
                  className="text-red-500"
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Patient Modal */}
      {isAddModalOpen && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h3 className="text-xl mb-4">Add New Patient</h3>
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
        <input
          type="text"
          name="name"
          placeholder="Patient Name"
          className="w-full px-4 py-2 mb-4 border rounded-md"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          className="w-full px-4 py-2 mb-4 border rounded-md"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-2 mb-4 border rounded-md"
          required
        />
        <input
          type="number"
          name="monthOfPregnancy"
          placeholder="Month of Pregnancy"
          className="w-full px-4 py-2 mb-4 border rounded-md"
          min="1"
          max="9"
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          className="w-full px-4 py-2 mb-4 border rounded-md"
          required
        />
        <input
          type="text"
          name="hospitalName"
          placeholder="Hospital Name"
          className="w-full px-4 py-2 mb-4 border rounded-md"
          required
        />
        <input
          type="text"
          name="doctorName"
          placeholder="Doctor Name"
          className="w-full px-4 py-2 mb-4 border rounded-md"
          required
        />
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(false)}
            className="bg-red-600 text-white px-4 py-2 rounded-md"
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
            <h3 className="text-xl mb-4">Edit Patient</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedPatient = {
                  id: currentPatient.id,
                  monthOfPregnancy: e.target.monthOfPregnancy.value,
                  city: e.target.city.value,
                  doctorName: e.target.doctorName.value,
                  hospitalname: e.target.hospitalname.value,

                };
                handleEditPatient(updatedPatient);
              }}
            >
              <input
                type="text"
                name="hospitalname"
                defaultValue={currentPatient.hospitalName}
                className="w-full px-4 py-2 mb-4 border rounded-md"
                required
              />
              <input
                type="text"
                name="monthOfPregnancy"
                defaultValue={currentPatient.monthOfPregnancy}
                className="w-full px-4 py-2 mb-4 border rounded-md"
                required
              />
              <input
                type="text"
                name="city"
                defaultValue={currentPatient.city}
                className="w-full px-4 py-2 mb-4 border rounded-md"
                required
              />
              <input
                type="text"
                name="doctorName"
                defaultValue={currentPatient.doctorName}
                className="w-full px-4 py-2 mb-4 border rounded-md"
                required
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md"
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl mb-4">Delete Patient</h3>
            <p>Are you sure you want to delete this patient?</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleDeletePatient(currentPatient.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Yes, Delete
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md"
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
