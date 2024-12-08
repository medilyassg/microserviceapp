import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // for drag and drop
import { getAppointments } from '../../services/appointmentService'; // Replace with your service file

const AppointmentCalendar = () => {
  const [events, setEvents] = useState([]);

  // Fetch appointments from the backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getAppointments();
        setEvents(response.map((appointment) => ({
        title: appointment.doctorName + "-" + appointment.patientName + " " + appointment.status , 
        date: appointment.appointmentDate,
          id: appointment.id,
        })));
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="container mx-auto p-2 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">Appointment Calendar</h2>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
        contentHeight="auto"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay',
        }}
        eventColor="#3a87ad" // Customize the event color
        eventTextColor="#fff" // Customize the text color of events
        eventDisplay="block"
      />
    </div>
  );
};

export default AppointmentCalendar;
