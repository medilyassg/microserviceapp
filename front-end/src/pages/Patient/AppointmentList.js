import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getAppointments, updateAppointment } from "../../services/appointmentService"; // Replace with your service file
import useSweetAlert from "../../components/notifications";
import { getAllUsers } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const PatientAppointmentCalendar = () => {
  const { showSuccessAlert, showErrorAlert } = useSweetAlert();

  const [events, setEvents] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [doctors, setDoctors] = useState([]);

  const navigate=useNavigate()

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const users = await getAllUsers();
        const PatientList = users.users.filter((user) => user.role === "doctor");
        setDoctors(PatientList);
        console.log("Doctors fetched:", PatientList);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchPatients();
  }, []);
  
  
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getAppointments();
        const user = JSON.parse(localStorage.getItem('user')); // Get the connected user
        const users = await getAllUsers();
  
        const PatientList = users.users.filter((user) => user.role === "doctor");
        setDoctors(PatientList);



        if (user) {
          // Filter appointments where patientId matches the logged-in user
          const filteredAppointments = response.filter((appointment) => appointment.patientId === user.id);

          setEvents(
            filteredAppointments.map((appointment) => ({
              title: `${appointment.doctorName} - ${appointment.patientName}`,
              date: appointment.appointmentDate,
              patientId: appointment.patientId,
              doctorId: appointment.doctorId,
              status:appointment.status,

              id: appointment.id,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);
  const statusColors = {
    Pending: "bg-blue-500 text-white",
    Completed: "bg-green-500 text-white",
    Canceled: "bg-red-500 text-white",
    Confirmed: "bg-yellow-500 text-white",
  };

  // Update an appointment's date
  const handleEditAppointment = async (updatedEvent) => {
    try {
      const { id, doctorName, patientName, appointmentDate, patientId ,doctorEmail } = updatedEvent;
      
      const updatedappointment = {
        doctorName,
        patientName,
        appointmentDate,
        patientId,
        doctorEmail
      };
      const updatedAppointment = await updateAppointment(id, updatedappointment);
      setEvents((prevEvents) => [
        ...prevEvents,
        {
          title: `${updatedAppointment.appointment.doctorName} - ${updatedAppointment.appointment.patientName}`,
          date: updatedAppointment.appointment.appointmentDate,
          id: updatedAppointment.appointment.id,
          status:updatedAppointment.appointment.status,
          patientId:updatedAppointment.appointment.patientId,
          doctorId:updatedAppointment.appointment.doctorId,
        },
      ]);
      setIsEditModalOpen(false);
      showSuccessAlert("Appointment updated successfully!");
    } catch (error) {
      console.error("Error updating appointment:", error);
      showErrorAlert("Failed to update appointment.");
    }
  };

  // Handle event click (open edit modal)
  const handleEventClick = (info) => {
    if(info.event.extendedProps.status==="Completed") navigate('/patient/history')
    setCurrentEvent({
      id: info.event.id,
      title: info.event.title,
      date: info.event.start.toISOString().split("T")[0],
      patientId: info.event.extendedProps.patientId,
      doctorId: info.event.extendedProps.doctorId,
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6" style={{ backgroundColor: '#F4F7FB' }}>
      <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">
        Appointment Calendar
      </h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        contentHeight="auto"
        dayHeaderClassNames="bg-indigo-500 text-white font-semibold py-2" // Custom style for day headers
  dayCellClassNames="hover:bg-indigo-100 transition duration-200 ease-in-out" // Hover effect on days
    headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,dayGridWeek,dayGridDay",
      }}
      eventContent={(eventInfo) => {
        const { status } = eventInfo.event.extendedProps;
        const colorClass = statusColors[status] ; // Default color

        return (
          <div
            className={`w-full rounded-md shadow-lg px-2 py-1 text-sm ${colorClass}`}
            title={eventInfo.event.title}
          >
            {eventInfo.event.title}
          </div>
        );
      }}
        eventClick={handleEventClick}
      />

      {/* Edit Appointment Modal */}
      {isEditModalOpen && currentEvent && (
        <EditAppointmentModal
          initialData={currentEvent}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditAppointment}
          doctors={doctors}
        />
      )}
    </div>
  );
};

// Edit Appointment Modal
const EditAppointmentModal = ({ initialData, onClose, onSubmit,doctors }) => {
  const [appointmentDate, setAppointmentDate] = useState(initialData.date);
  const handleSubmit =  (e) => {
    e.preventDefault();
    
        const updatedAppointment = {
            id: initialData.id,
            doctorName: initialData.title.split(" - ")[0],
            patientName: initialData.title.split(" - ")[1],
            appointmentDate,
            patientId: initialData.patientId,
            doctorId: initialData.doctorId,
            doctorEmail: doctors.find(p => p.id === initialData.doctorId)?.email || ""
      
          };
          console.log(updatedAppointment.doctorEmail)
          onSubmit(updatedAppointment);
    
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl mb-4">Edit Appointment</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-md"
            required
          />
          <div className="flex justify-between">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
              Save Changes
            </button>
            <button type="button" onClick={onClose} className="bg-gray-600 text-white px-4 py-2 rounded-md">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientAppointmentCalendar;
