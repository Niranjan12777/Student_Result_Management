import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Navbar from '../../components/Navbar/NavBar.jsx';
import Sidebar from '../../components/Sidebar/SideBar.jsx';
import StudentForm from '../../components/StudentForm/StudentForm.jsx';
import './AddStudent.css';

const AddStudent = () => {
  const { addStudent } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await addStudent(formData);
      if (result.success) {
        setMessage(result.message);
        setTimeout(() => {
          navigate('/students');
        }, 1500);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to add student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          <div className="page-header">
            <h1>Add New Student</h1>
            <p>Enter student details to add to the system</p>
          </div>

          {message && (
            <div className="success-alert">
              <span className="alert-icon">✅</span>
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="error-alert">
              <span className="alert-icon">❌</span>
              <span>{error}</span>
            </div>
          )}

          <StudentForm
            onSubmit={handleSubmit}
            buttonText={loading ? "Adding Student..." : "Add Student"}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default AddStudent;