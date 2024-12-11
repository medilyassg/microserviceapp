import React, { useState, useEffect } from "react";
import { FaUserPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import useSweetAlert from "../../components/notifications";
import {
  getAllUsers,
  registerUser,
  updateUser,
  deleteUser,
} from "../../services/authService";

const ManageDoctors = () => {
  const [users, setUsers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { showSuccessAlert, showErrorAlert } = useSweetAlert();

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        const doctorUsers = users.users.filter((user) => user.role === "doctor");
        setUsers(doctorUsers);
      } catch (error) {
        showErrorAlert("Error fetching users data.");
      }
    };
    fetchUsers();
  }, []);

  const handleAddUser = async (user) => {
    try {
      const newUser = await registerUser({ ...user, role: "doctor" });
      setUsers([...users, newUser.user]);
      showSuccessAlert("Doctor added successfully!");
      setIsAddModalOpen(false);
    } catch (error) {
      showErrorAlert("Failed to add doctor.");
    }
  };

  const handleEditUser = async (updatedUser) => {
    try {
      const response = await updateUser(updatedUser.id, updatedUser);
      setUsers(
        users.map((user) =>
          user.id === updatedUser.id ? response.user : user
        )
      );
      showSuccessAlert("Doctor updated successfully!");
      setIsEditModalOpen(false);
    } catch (error) {
      showErrorAlert("Failed to update user.");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
      showSuccessAlert("Doctor deleted successfully!");
      setIsDeleteModalOpen(false);
    } catch (error) {
      showErrorAlert("Failed to delete user.");
    }
  };

  return (
    <div className="container mx-auto p-6" style={{ backgroundColor: '#F4F7FB' }}>
      <div className="flex justify-between items-center m-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Manage Doctors</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center py-2 px-4 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 transition duration-300"
        >
          <FaUserPlus className="mr-2" />
          Add New Doctor
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto shadow-md rounded-lg bg-white">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="py-3 px-6 text-left text-gray-600">Name</th>
              <th className="py-3 px-6 text-left text-gray-600">Email</th>
              <th className="py-3 px-6 text-left text-gray-600">Role</th>
              <th className="py-3 px-6 text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="py-3 px-6 text-gray-800">{user.name}</td>
                <td className="py-3 px-6 text-gray-600">{user.email}</td>
                <td className="py-3 px-6 text-gray-600">{user.role}</td>
                <td className="py-3 px-6 text-gray-600">
                  <button
                    onClick={() => {
                      setCurrentUser(user);
                      setIsEditModalOpen(true);
                    }}
                    className="mr-4 text-yellow-500 hover:text-yellow-600 transition duration-300"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentUser(user);
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

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Add New Doctor</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const user = {
                  name: e.target.name.value,
                  email: e.target.email.value,
                  password: e.target.password.value,
                };
                handleAddUser(user);
              }}
            >
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                required
              />
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

      {/* Edit User Modal */}
      {isEditModalOpen && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Edit Doctor</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedUser = {
                  id: currentUser.id,
                  name: e.target.name.value,
                  email: e.target.email.value,
                  password: e.target.password.value,
                  role: currentUser.role, // Keep the same role as before
                };
                handleEditUser(updatedUser);
              }}
            >
              <input
                type="text"
                name="name"
                defaultValue={currentUser.name}
                placeholder="Name"
                className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="email"
                name="email"
                defaultValue={currentUser.email}
                placeholder="Email"
                className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password (Leave blank to keep current)"
                className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-300"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {isDeleteModalOpen && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Delete Doctor</h3>
            <p className="text-gray-600">Are you sure you want to delete {currentUser.name}?</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleDeleteUser(currentUser.id)}
                className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition duration-300"
              >
                Yes, Delete
              </button>
              <button
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

export default ManageDoctors;
