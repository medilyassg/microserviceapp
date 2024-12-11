const express = require('express');
const { sendEmail } = require('../config/ludmilo');
const router = express.Router();

router.post('/notifications', async (req, res) => {
    const { type, payload } = req.body;

    try {
        if (type === 'ACCOUNT_CREATION') {
            const { email, name, password } = payload;

            // Send welcome email to the patient
            await sendEmail(
                email,
                'Welcome to Healthcare Connect!',
                `Dear ${name},
            
Welcome to Healthcare Connect – your gateway to personalized and seamless healthcare management.

We are excited to have you on board! Your account has been successfully created, and you can now access our platform to manage your healthcare needs efficiently.

**Your Login Details:**
- **Email:** ${email}
- **Temporary Password:** ${password}

To get started, please log in and update your password for enhanced security. Our platform allows you to:
- Book and manage appointments with your healthcare providers.
- Access your medical history and consultation records.
- Receive personalized health notifications and reminders.

If you have any questions or need assistance, our support team is here to help. Feel free to reach out to us at support@healthcareconnect.com.

We are committed to providing you with the best healthcare experience.

Warm regards,  
The Healthcare Connect Team`
            );
        } else if (type === 'PATIENT_ADDED') {
            const { doctorEmail, doctorName, patientName, patientEmail, pregnancyMonth, city, hospitalName } = payload;

            // Send email to the doctor about the new patient
            await sendEmail(
                doctorEmail,
                `New Patient Assigned: ${patientName}`,
                `Dear Dr. ${doctorName},

We are pleased to inform you that a new patient has been assigned to you via Healthcare Connect.

**Patient Details:**
- **Name:** ${patientName}
- **Email:** ${patientEmail}
- **Month of Pregnancy:** ${pregnancyMonth}
- **City:** ${city}
- **Hospital:** ${hospitalName}

You can now log in to your dashboard to view and manage the patient's profile, schedule consultations, and provide the necessary care.

If you have any questions or need assistance, please feel free to contact our support team.

Best regards,  
The Healthcare Connect Team`
            );
        } else if (type === 'APPOINTMENT_CREATED') {
            const { patientEmail, patientName, doctorName, appointmentDate } = payload;

            // Send email to the patient about the appointment
            await sendEmail(
                patientEmail,
                'Appointment Confirmation',
                `Dear ${patientName},

Your appointment with Dr. ${doctorName} has been successfully scheduled.

**Appointment Details:**
- **Date:** ${appointmentDate}

Please ensure to arrive 10 minutes early. If you have any questions, feel free to contact us.

Best regards,  
The Healthcare Connect Team`
            );
        }else if (type === 'APPOINTMENT_UPDATED') {
            const {
                patientEmail,
                doctorEmail,
                patientName,
                doctorName,
                newAppointmentDate,
                status
            } = payload;
        
            if (patientEmail) {
                // Send email to the patient about the updated appointment
                await sendEmail(
                    patientEmail,
                    'Your Appointment Status has been Updated',
                    `Dear ${patientName},
        
        Your appointment with Dr. ${doctorName} has been ${status} successfully.
        
        **Updated Appointment Details:**
        - **Appointment Status:** ${status}
        - **New Appointment Date:** ${newAppointmentDate}
        - **Patient Name:** ${patientName}
        - **Patient Email:** ${patientEmail}
        
        If you have any questions or concerns, please feel free to contact Dr. ${doctorName} . 
        
        Best regards,  
        The Healthcare Connect Team`
                );
            }
        
            if (doctorEmail) {
                // Send email to the doctor about the patient's updated appointment
                await sendEmail(
                    doctorEmail,
                    'Patient Appointment Date Updated',
                    `Dear Dr. ${doctorName},
        
        Please be informed that your patient, ${patientName}, has updated their appointment status.
        
        **Updated Appointment Details:**
        - **Patient Name:** ${patientName}
        - **New Appointment Date:** ${newAppointmentDate}
        - **Appointment Status:** ${status}
        
        Please feel free to contact your patient ${patientName} if you need further information.
        
        Best regards,  
        The Healthcare Connect Team`
                );
            }
        }else if (type === 'NOTES_AND_DOCUMENTS_UPDATED') {
            const {
                patientEmail,
                patientName,
                doctorName,
                doctorNotes,
                documents
            } = payload;

            // Send email to the patient about the updated notes and documents
            let emailBody = `Dear ${patientName},

The doctor has updated the details of your appointment with the following notes and documents:

**Doctor's Notes:**
${doctorNotes || 'No notes provided.'}

**Uploaded Documents:**
`;

            // Add document descriptions and links
            if (documents && documents.length > 0) {
                documents.forEach((doc, index) => {
                    emailBody += `Document ${index + 1}: ${doc.description}\nLink: ${doc.url}\n\n`;
                });
            } else {
                emailBody += 'No documents uploaded.\n';
            }

            emailBody += `If you have any questions, feel free to contact Dr. ${doctorName}.

Best regards,  
The Healthcare Connect Team`;

            await sendEmail(
                patientEmail,
                'Doctor has updated your appointment notes and documents',
                emailBody
            );
        }

        res.status(200).send({ message: 'Notification sent successfully' });
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).send({ message: 'Error sending notification' });
    }
});

module.exports = router; 
        

       