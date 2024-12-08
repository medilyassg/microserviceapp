import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/pregnancy", // Replace with your API URL
    headers: {
      "Content-Type": "application/json",
    },
  });

// Function to create a new pregnancy record
export const createPregnancy = async (pregnancie) => {
  try {
    const pregnancyResponse = await api.post("/",pregnancie);

    return pregnancyResponse.data; // This will return the created pregnancy data
  } catch (error) {
    throw new Error(`Error creating pregnancy record: ${error.message}`);
  }
};

// Function to get pregnancy details by patient ID
export const getPregnancyDetails = async (patientId) => {
  try {
    const response = await api.get(`/${patientId}`);
    return response.data; // This will return the pregnancy details
  } catch (error) {
    throw new Error(`Error fetching pregnancy details: ${error.message}`);
  }
};

// Function to update pregnancy details
export const updatePregnancy = async (patient) => {
  try {
    const response = await api.put(`/${patient.id}`, patient);

    return response.data; // This will return the updated pregnancy record
  } catch (error) {
    throw new Error(`Error updating pregnancy: ${error.message}`);
  }
};

// Function to delete pregnancy record by patient ID
export const deletePregnancy = async (patientId) => {
  try {
    const response = await api.delete(`/${patientId}`);
    return response.data; // This will return the message confirming the deletion
  } catch (error) {
    throw new Error(`Error deleting pregnancy record: ${error.message}`);
  }
};
export const getAllPregnancies = async () => {
    try {
      const response = await api.get("/all");
      return response.data; // Return the list of pregnancies
    } catch (error) {
      throw new Error(`Error fetching all pregnancies: ${error.message}`);
    }
  };
