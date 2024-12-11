import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // for drag and drop
import { getAppointments } from "../../services/appointmentService"; // Replace with your service file

const AppointmentCalendar = () => {
  const [events, setEvents] = useState([]);

  // Fetch appointments from the backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getAppointments();
        setEvents(
          response.map((appointment) => ({
            title: `${appointment.doctorName} - ${appointment.patientName}`,
            date: appointment.appointmentDate,
            id: appointment.id,
            extendedProps: {
              status: appointment.status, // Include the status here
            },
          }))
        );
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  // Define status-based colors
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

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
        
        dayHeaderClassNames="bg-indigo-500 text-white font-semibold py-2" // Custom style for day headers
  dayCellClassNames="hover:bg-indigo-100 transition duration-200 ease-in-out" // Hover effect on days
        contentHeight="auto"
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
        dayCellContent={(dayCell) => (
          <div className="flex justify-center items-center text-gray-700 font-medium">
            {dayCell.dayNumberText}
          </div>
        )}
      />
    </div>
  );
};

export default AppointmentCalendar;
