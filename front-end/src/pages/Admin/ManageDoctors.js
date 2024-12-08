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
        const adminUsers = users.users.filter(user => user.role === "doctor");
        setUsers(adminUsers);
      } catch (error) {
        showErrorAlert("Error fetching users data.");
      }
    };
    fetchUsers();
  }, []);

  const handleAddUser = async (user) => {
    try {
      // Set the default role to "admin"
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
      const response = await updateUser(updatedUser.id,updatedUser);
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
      showSuccessAlert("User deleted successfully!");
      setIsDeleteModalOpen(false);
    } catch (error) {
      showErrorAlert("Failed to delete user.");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center py-2 px-4 bg-indigo-600 text-white rounded-md"
        >
          <FaUserPlus className="mr-2" />
          Add New User
        </button>
      </div>

      {/* Users Table */}
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Name</th>
            <th className="py-2 px-4 border-b text-left">Email</th>
            <th className="py-2 px-4 border-b text-left">Role</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.role}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => {
                    setCurrentUser(user);
                    setIsEditModalOpen(true);
                  }}
                  className="mr-2 text-yellow-500"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => {
                    setCurrentUser(user);
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

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl mb-4">Add New User</h3>
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
                className="w-full px-4 py-2 mb-4 border rounded-md"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
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
              {/* No select input for role, it will always be 'admin' */}
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

      {/* Edit User Modal */}
      {isEditModalOpen && currentUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl mb-4">Edit User</h3>
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
                className="w-full px-4 py-2 mb-4 border rounded-md"
                required
              />
              <input
                type="email"
                name="email"
                defaultValue={currentUser.email}
                placeholder="Email"
                className="w-full px-4 py-2 mb-4 border rounded-md"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password (Leave blank to keep current)"
                className="w-full px-4 py-2 mb-4 border rounded-md"
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md"
                >
                  Save Changes
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

      {/* Delete User Modal */}
      {isDeleteModalOpen && currentUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl mb-4">Delete User</h3>
            <p>Are you sure you want to delete {currentUser.name}?</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleDeleteUser(currentUser.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Yes, Delete
              </button>
              <button
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

export default ManageDoctors;

