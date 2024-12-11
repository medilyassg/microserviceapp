import React, { useState, useEffect } from 'react';
import { getAppointments } from '../../services/appointmentService'; // Replace with your actual service
import { FaFilePdf } from 'react-icons/fa'; // Importing React Icon for PDF
import axios from 'axios';

function History() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getAppointments();
        const user = JSON.parse(localStorage.getItem('user')); // Get the connected user

        if (user) {
          // Filter appointments where patientId matches the logged-in user
          const filteredAppointments = response.filter((appointment) => appointment.patientId === user.id & appointment.status==="Completed");

          setEvents(
            filteredAppointments.map((appointment) => ({
              doctorName: appointment.doctorName,
              date: appointment.appointmentDate,
              doctorNotes: appointment.doctorNotes,
              documents: appointment.documents,
              id: appointment.id,
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  const handleDocumentClick = async (doc) => {
    try {
      // Fetch the document using axios (if URL is accessible)
      const response = await axios.get(doc.url, {
        responseType: 'blob', // We want to handle the file as a blob
      });

      // Create a Blob from the response
      const blob = new Blob([response.data], { type: response.headers['content-type'] });

      // Create a link element to simulate the download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = doc.description || 'document'; // Set the filename

      // Append the link to the DOM, click it, and then remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading the document:', error);
    }
  };

  return (
    <div className="container mx-auto p-6" style={{ backgroundColor: '#F4F7FB' }}>
      <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">Appointment History</h2>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((appointment) => (
            <div key={appointment.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-[#2C3E50]">DR.{appointment.doctorName}</h3>
                <p className="text-sm text-[#7F8C8D]">{new Date(appointment.date).toLocaleDateString()}</p>
              </div>

              {/* Doctor's Notes Section */}
              <div className="bg-[#ECF0F1] p-4 rounded-lg shadow-md mb-6">
                <p className="text-xl font-medium text-[#2C3E50]">Doctor's Notes</p>
                <p className="text-[#34495E] mt-3">{appointment.doctorNotes || 'No notes available.'}</p>
              </div>

              {/* Documents Section */}
              {appointment.documents && appointment.documents.length > 0 ? (
                <div className="bg-[#ECF0F1] p-4 rounded-lg shadow-md">
                  <p className="text-xl font-medium text-[#2C3E50]">Documents</p>
                  <ul className="mt-4 space-y-3">
                    {appointment.documents.map((doc, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <FaFilePdf className="text-[#E74C3C] text-xl" /> {/* PDF Icon */}
                        <button
                          onClick={() => handleDocumentClick(doc)}
                          className="text-[#1ABC9C] hover:text-[#16A085] text-lg font-medium transition-colors"
                        >
                          {doc.description}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="mt-2 text-[#BDC3C7]">No documents available.</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-[#7F8C8D]">No completed appointments found.</p>
      )}
    </div>
  );
}

export default History;
