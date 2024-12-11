import React, { useState } from 'react';
import axios from 'axios';

function NotesAndDocumentsForm({ isOpen, onClose, onUploadSuccess, id ,patientEmail}) {
  const [doctorNotes, setDoctorNotes] = useState('');
  const [fileDescriptions, setFileDescriptions] = useState([]);
  const [files, setFiles] = useState([]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setFileDescriptions(selectedFiles.map(() => ''));
  };

  const handleDescriptionChange = (index, value) => {
    const updatedDescriptions = [...fileDescriptions];
    updatedDescriptions[index] = value;
    setFileDescriptions(updatedDescriptions);
  };

  const handleUpload = async () => {
    if (files.length !== fileDescriptions.length) {
      alert('Each file must have a description.');
      return;
    }

    const formData = new FormData();
    formData.append('doctorNotes', doctorNotes);

    fileDescriptions.forEach((desc, index) => {
      formData.append(`documentDescriptions[${index}]`, desc);
    });

    files.forEach((file) => {
      formData.append('documents', file);
    });

    try {
      const response = await axios.patch(
        `http://localhost:3003/api/appointments/${id}/notes-and-documents`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

    const notificationPayload = {
      type: "NOTES_AND_DOCUMENTS_UPDATED",
      payload: {
        patientEmail,
        patientName:response.data.appointment.patientName,
        doctorName:response.data.appointment.doctorName,
        doctorNotes:response.data.appointment.doctorNotes,
        documents:response.data.appointment.documents
      },
    };

    // Send notification to the back-end
    await fetch("http://localhost:3005/api/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notificationPayload),
    });
      console.log('Upload successful:', response.data);
      onUploadSuccess(response.data);
      setDoctorNotes('');
      setFiles([]);
      setFileDescriptions([]);
      onClose();
    } catch (error) {
      console.error('Upload failed:', error.response.data);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-1/2">
        <div className="flex justify-between items-center border-b px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-800">Upload Documents</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Doctor Notes */}
          <textarea
            className="w-full border-2 border-gray-300 rounded-lg p-4 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Enter doctor notes..."
            value={doctorNotes}
            onChange={(e) => setDoctorNotes(e.target.value)}
          ></textarea>

          {/* File Upload with Stylish Drop Area */}
          <div className="border-2 border-gray-300 border-dashed rounded-lg p-6 text-center space-y-4 bg-gray-50">
            <input
              type="file"
              multiple
              className="hidden"
              id="file-input"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-input"
              className="cursor-pointer text-gray-600 hover:text-blue-600 text-xl font-medium"
            >
              Drag & Drop Files or Click to Select Files
            </label>
            <p className="text-gray-500 text-sm">
              Supported formats: PDF, DOCX, JPG, PNG
            </p>
          </div>

          {/* File Descriptions */}
          {files.map((file, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4">
              <p className="flex-1 text-sm text-gray-700">{file.name}</p>
              <input
                type="text"
                className="flex-1 border-2 border-gray-300 rounded-lg p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description..."
                value={fileDescriptions[index] || ''}
                onChange={(e) => handleDescriptionChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end items-center border-t px-4 py-3">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotesAndDocumentsForm;
