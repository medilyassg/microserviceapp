import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // for interaction
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../../services/appointmentService"; // Replace with your service file
import useSweetAlert from "../../components/notifications";
import NotesAndDocumentsForm from "./NotesAndDocumentsForm";
import { getAllUsers } from "../../services/authService";

const DoctorAppointmentCalendar = () => {
  const { showSuccessAlert, showErrorAlert } = useSweetAlert();

  const [events, setEvents] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false); // Modal to choose Update/Delete
  const [currentEvent, setCurrentEvent] = useState({patientId:null});
  const [selectedDate, setSelectedDate] = useState(null);
  const [patients, setPatients] = useState([]);
  const [isModalNotesOpen, setIsModalNotesOpen] = useState(false);

useEffect( ()=>{
  const fetchpatients=async()=>{
    const users = await getAllUsers();
    const PatientList = users.users.filter((user) => user.role === "patient");
    setPatients(PatientList);
  }
  fetchpatients()
},[events])

  const handleUploadSuccess = (data) => {
    showSuccessAlert('Documents uploaded successfully!');
    setIsActionModalOpen(false)
  };
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getAppointments();
        const user = JSON.parse(localStorage.getItem('user')); // Get the connected user
        const filteredAppointments = response.filter((appointment) => appointment.doctorId === user.id);

        setEvents(
          filteredAppointments.map((appointment) => ({
            title: `${appointment.doctorName} - ${appointment.patientName}`,
            date: appointment.appointmentDate,
            status:appointment.status,
            patientId:appointment.patientId,
            id: appointment.id,
          }))
        );
        const users = await getAllUsers();
        const PatientList = users.users.filter((user) => user.role === "patient");
        setPatients(PatientList);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    

    fetchAppointments();
  }, []);

  // Add a new appointment
  const handleAddAppointment = async (appointment) => {
    try {
      const createdAppointment = await createAppointment(appointment);
      setEvents((prevEvents) => [
        ...prevEvents,
        {
          title: `${createdAppointment.doctorName} - ${createdAppointment.patientName}`,
          date: createdAppointment.appointmentDate,
          id: createdAppointment.id,
          status:createdAppointment.status,
          patientId:createdAppointment.patientId,
        },
      ]);
      showSuccessAlert('Appointment created successfully');
      setIsAddModalOpen(false);
    } catch (error) {
      showErrorAlert('Failed to create appointment');
      console.error("Error creating appointment:", error);
    }
  };

  // Update an appointment
  const handleEditAppointment = async (updatedEvent) => {
    try {
      const { id, doctorName, patientName, status, appointmentDate,patientId,patientEmail } = updatedEvent;
      const updatedappointment = {
        doctorName,
        patientName,
        status,
        appointmentDate,
        patientId,
        patientEmail
      };
      const updatedAppointment= await updateAppointment(id, updatedappointment);
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

  // Delete an appointment
  const handleDeleteAppointment = async (id) => {
    try {

       await deleteAppointment(id);
       setEvents((prevEvents) => prevEvents.filter((event) => event.id != id));

      setIsDeleteModalOpen(false);
      showSuccessAlert("Appointment adeleted successfully!");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      showErrorAlert("Failed to delete appointment.");
    }
  };

  // Handle event click (open action modal)
  const handleEventClick = (info) => {
    setCurrentEvent({
      id: info.event.id,
      title: info.event.title,
      date: info.event.start.toISOString().split('T')[0],
      status: info.event.extendedProps.status,
      patientId: info.event.extendedProps.patientId,
      doctorIdId: info.event.extendedProps.patientId,
    });
    setIsActionModalOpen(true);
  };
  const statusColors = {
    Pending: "bg-blue-500 text-white",
    Completed: "bg-green-500 text-white",
    Canceled: "bg-red-500 text-white",
    Confirmed: "bg-yellow-500 text-white",
  };

  return (
    <div className="container mx-auto p-6" style={{ backgroundColor: '#F4F7FB' }}>
      <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">
        Appointment Calendar
      </h2>
      {/* Add Appointment Button */}
      

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        contentHeight="auto"
        customButtons={{
          myCustomButton: {
            text: "Add new Appointment",
            click: () => setIsAddModalOpen(true),
            class: "flex items-center py-3 px-5 bg-indigo-600 text-white rounded-lg shadow-lg transform transition-all duration-300 hover:bg-indigo-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          },
        }}
        
        dayHeaderClassNames="bg-indigo-500 text-white font-semibold py-2" // Custom style for day headers
  dayCellClassNames="hover:bg-indigo-100 transition duration-200 ease-in-out" // Hover effect on days

        headerToolbar={{
          left: "prev,next today myCustomButton",
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
        dayCellContent={(dayCell) => (
          <div className="flex justify-center items-center text-gray-700 font-medium">
            {dayCell.dayNumberText}
          </div>
        )}
        dateClick={(info) => {
          setSelectedDate(info.dateStr);
          setIsAddModalOpen(true);
        }}
        eventClick={handleEventClick}
      />

      {/* Add Appointment Modal */}
      {isAddModalOpen && (
        <AddAppointmentModal
          selectedDate={selectedDate}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddAppointment}
          patients={patients}
        />
      )}

      {/* Edit Appointment Modal */}
      {isEditModalOpen && currentEvent && (
        <EditAppointmentModal
          initialData={currentEvent}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditAppointment}
          patients={patients}
        />
      )}

      {/* Action Modal (Choose Update or Delete) */}
      {isActionModalOpen && currentEvent && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex justify-center items-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-2xl w-96 max-w-lg">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Appointment Actions</h3>
      <p className="text-gray-700 mb-6">
        What would you like to do with the appointment for <span className="font-semibold text-gray-900">{currentEvent.title}</span>?
      </p>
      <div className="flex flex-col space-y-4">
        {/* Update Button */}
        <button
          onClick={() => {
            setIsActionModalOpen(false);
            setIsEditModalOpen(true);
          }}
          className="bg-blue-600 text-white text-lg px-6 py-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
        >
          Update Appointment
        </button>

        {/* Delete Button */}
        <button
          onClick={() => {
            setIsDeleteModalOpen(true);
            
            setIsActionModalOpen(false);
          }}
          className="bg-red-600 text-white text-lg px-6 py-3 rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 transition duration-200"
        >
          Delete Appointment
        </button>

        {/* Open Upload Modal Button */}
        {currentEvent.status==="Completed" ?
        <button
        onClick={() => setIsModalNotesOpen(true)}
        className="bg-indigo-600 text-white text-lg px-6 py-3 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200"
      >
        Add Notes/Upload Files
      </button>:<button
        onClick={() => {setIsActionModalOpen(false)
           showErrorAlert("Complete The Appointment To Add notes And Apload the files")}}
        className="bg-indigo-600 text-white text-lg px-6 py-3 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200"
      >
        Add Notes/Upload Files
      </button>}
        

        {/* Cancel Button */}
        <button
          onClick={() => setIsActionModalOpen(false)}
          className="bg-gray-600 text-white text-lg px-6 py-3 rounded-md shadow-md hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition duration-200"
        >
          Close Modal
        </button>
      </div>
    </div>
  </div>
)}
{isDeleteModalOpen && currentEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Delete Doctor</h3>
            <p className="text-gray-600">Are you sure you want to delete {currentEvent.name}?</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleDeleteAppointment(currentEvent.id)}
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

      <NotesAndDocumentsForm
        isOpen={isModalNotesOpen}
        onClose={() => setIsModalNotesOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        id={currentEvent && currentEvent.id}
        patientEmail={patients.find(p => p.id === currentEvent.patientId)?.email || ""}
      />
    </div>
  );
};

// Add Appointment Modal
const AddAppointmentModal = ({ selectedDate, onClose, onSubmit, patients }) => {
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientEmail,setPatientEmail]=useState("")
  const [appointmentDate, setAppointmentDate] = useState(selectedDate);
  const [status, setStatus] = useState("Pending");
  const user = JSON.parse(localStorage.getItem('user')); // Get the connected user

  const handlePatientChange = (e) => {
    const selectedPatientId = e.target.value;
    const selectedPatient = patients.find(
      (p) => p.id === parseInt(selectedPatientId)
    );
    setPatientId(selectedPatientId);
    setPatientName(selectedPatient ? selectedPatient.name : "");
    setPatientEmail(selectedPatient ? selectedPatient.email : "");

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));

    const newAppointment = {
      doctorName:user.name,
      doctorId: user.id, // Example, replace with actual doctor ID
      patientId,
      patientName,
      patientEmail,
      status,
      appointmentDate,
    };
    onSubmit(newAppointment);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl mb-4">Add Appointment</h3>
        <form onSubmit={handleSubmit}>
          
          <select
            value={patientId}
            onChange={handlePatientChange}
            className="w-full px-4 py-2 mb-4 border rounded-md"
            required
          >
            <option value="">Select Patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-md"
            required
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-md"
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Canceled">Canceled</option>
          </select>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Appointment Modal
const EditAppointmentModal = ({
  initialData,
  onClose,
  onSubmit,
  patients,
}) => {
  const [patientName, setPatientName] = useState(initialData.title.split(' - ')[1]);
  const [appointmentDate, setAppointmentDate] = useState(initialData.date);
  const [status, setStatus] = useState(initialData.status);
  const [patientId, setPatientId] = useState(initialData.patientId);
  const [patientEmail, setPatientEmail] = useState(
    patients.find(p => p.id === initialData.patientId)?.email || ""
  );
  const handlePatientChange = (e) => {
    const selectedPatientId = e.target.value;
    const selectedPatient = patients.find(
      (p) => p.id === parseInt(selectedPatientId)
    );
    setPatientId(selectedPatientId);
    setPatientName(selectedPatient ? selectedPatient.name : "");
    setPatientEmail(selectedPatient ? selectedPatient.email : "");

  };
  const user = JSON.parse(localStorage.getItem('user')); // Get the connected user

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedAppointment = {
      id:initialData.id,
      doctorName:user.name,
      doctorId: 1, // Example, replace with actual doctor ID
      patientId,
      patientName,
      patientEmail,
      status,
      appointmentDate,
    };
    onSubmit(updatedAppointment);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl mb-4">Edit Appointment</h3>
        <form onSubmit={handleSubmit}>
          
          <select
            value={patientId}
            onChange={handlePatientChange}
            className="w-full px-4 py-2 mb-4 border rounded-md"
            required
          >
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-md"
            required
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-md"
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Canceled">Canceled</option>
          </select>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorAppointmentCalendar;
