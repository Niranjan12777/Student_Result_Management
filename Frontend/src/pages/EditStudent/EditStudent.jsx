import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Navbar from '../../components/Navbar/NavBar.jsx';
import Sidebar from '../../components/Sidebar/SideBar.jsx';
import StudentForm from '../../components/StudentForm/StudentForm.jsx';
import './EditStudent.css';

const EditStudent = () => {
  const { id } = useParams();
  const { getStudentById, updateStudent } = useAuth();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const studentData = getStudentById(id);
    if (studentData) {
      setStudent(studentData);
    } else {
      navigate('/students');
    }
  }, [id, getStudentById, navigate]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await updateStudent(id, formData);
      if (result.success) {
        setMessage(result.message);
        setTimeout(() => {
          navigate('/students');
        }, 1500);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to update student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!student) {
    return (
      <div className="app-layout">
        <Navbar />
        <div className="main-content">
          <Sidebar />
          <div className="content-area">
            <div className="loading-container">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          <div className="page-header">
            <h1>Edit Student</h1>
            <p>Update student information</p>
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
            initialData={student}
            onSubmit={handleSubmit}
            buttonText={loading ? "Updating Student..." : "Update Student"}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default EditStudent;