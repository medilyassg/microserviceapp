import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Corrected import



// Create an axios instance
const api = axios.create({
  baseURL: "http://localhost:3000/users/", // Replace with your API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to handle login
export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });

    const { token } = response.data; // Get the token from the response

    // Decode the token to get the user information
    const decodedToken = jwtDecode(token);

    // Store the token and decoded user info in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(decodedToken)); // Save decoded token (user info)

    return response.data; // Return the response data (e.g., user info, token)
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Function to handle user registration
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/register", userData); // Send user data to the backend
    return response.data; // Return the created user data
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Function to update user information
export const updateUser = async (userId, updatedData) => {
  try {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    const response = await api.put(`/${userId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token for authentication
      },
    });
    return response.data; // Return the updated user data
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Function to delete a user
export const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    await api.delete(`/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token for authentication
      },
    });
    return true; // Return success if no error occurs
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Function to get user details (optional, for fetching user info by ID)
export const getUserById = async (userId) => {
  try {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    const response = await api.get(`/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token for authentication
      },
    });
    return response.data; // Return the user data
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};


export const getAllUsers = async () => {
    try {
      const response = await api.get("/all");
      return response.data; // Return the list of pregnancies
    } catch (error) {
      throw new Error(`Error fetching all users: ${error.message}`);
    }
  };
