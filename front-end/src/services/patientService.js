import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:3000/pregnancy", // Replace with your API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token in the headers
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    // If the token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Function to create a new pregnancy record
export const createPregnancy = async (pregnancie) => {
  try {
    const pregnancyResponse = await api.post("/", pregnancie);
    return pregnancyResponse.data; // Return the created pregnancy data
  } catch (error) {
    throw new Error(`Error creating pregnancy record: ${error.message}`);
  }
};

// Function to get pregnancy details by patient ID
export const getPregnancyDetails = async (patientId) => {
  try {
    const response = await api.get(`/${patientId}`);
    return response.data; // Return the pregnancy details
  } catch (error) {
    throw new Error(`Error fetching pregnancy details: ${error.message}`);
  }
};

// Function to update pregnancy details
export const updatePregnancy = async (patient) => {
  try {
    const response = await api.put(`/${patient.id}`, patient);
    return response.data; // Return the updated pregnancy record
  } catch (error) {
    throw new Error(`Error updating pregnancy: ${error.message}`);
  }
};

// Function to delete pregnancy record by patient ID
export const deletePregnancy = async (patientId) => {
  try {
    const response = await api.delete(`/${patientId}`);
    return response.data; // Return the message confirming the deletion
  } catch (error) {
    throw new Error(`Error deleting pregnancy record: ${error.message}`);
  }
};

// Function to fetch all pregnancy records
export const getAllPregnancies = async () => {
  try {
    const response = await api.get("/all");
    return response.data; // Return the list of pregnancies
  } catch (error) {
    throw new Error(`Error fetching all pregnancies: ${error.message}`);
  }
};
