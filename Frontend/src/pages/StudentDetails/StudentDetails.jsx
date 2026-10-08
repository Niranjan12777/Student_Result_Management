import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Navbar from '../../components/Navbar/NavBar.jsx';
import Sidebar from '../../components/Sidebar/SideBar.jsx';
import './StudentDetails.css';

const StudentDetails = () => {
  const { id } = useParams();
  const { getStudentById, deleteStudent } = useAuth();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const studentData = getStudentById(id);
    if (studentData) {
      setStudent(studentData);
    } else {
      navigate('/students');
    }
  }, [id, getStudentById, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setDeleting(true);
      try {
        await deleteStudent(id);
        navigate('/students');
      } catch (err) {
        alert('Failed to delete student. Please try again.');
        setDeleting(false);
      }
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

  const getGradeColor = (grade) => {
    const gradeColors = {
      'A+': '#28a745',
      'A': '#28a745',
      'B+': '#17a2b8',
      'B': '#17a2b8',
      'C': '#ffc107',
      'D': '#fd7e14',
      'F': '#dc3545'
    };
    return gradeColors[grade] || '#6c757d';
  };

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          <div className="page-header">
            <h1>Student Details</h1>
            <div className="header-actions">
              <Link to={`/edit-student/${id}`} className="btn btn-edit-header">
                Edit Student
              </Link>
              <button
                onClick={handleDelete}
                className="btn btn-danger"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Student'}
              </button>
            </div>
          </div>

          <div className="details-container">
            <div className="details-card">
              <div className="details-header">
                <div className="details-avatar">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <div className="details-title">
                  <h2>{student.name}</h2>
                  <p>{student.email}</p>
                </div>
                <div
                  className="details-grade-badge"
                  style={{ backgroundColor: getGradeColor(student.grade) }}
                >
                  Grade {student.grade}
                </div>
              </div>

              <div className="details-section">
                <h3>Personal Information</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Roll Number</span>
                    <span className="detail-value">{student.rollNo}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{student.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Course/Program</span>
                    <span className="detail-value">{student.course}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Overall Marks</span>
                    <span className="detail-value">{student.marks}%</span>
                  </div>
                </div>
              </div>

              {student.subjects && student.subjects.length > 0 && (
                <div className="details-section">
                  <h3>Subject-wise Performance</h3>
                  <div className="subjects-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Subject Name</th>
                          <th>Marks Obtained</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {student.subjects.map((subject) => (
                          <tr key={subject._id}>
                            <td>{subject.name}</td>
                            <td>{subject.marks}/100</td>
                            <td>
                              <span
                                className={`status-badge ${subject.marks >= 40 ? 'status-pass' : 'status-fail'
                                  }`}
                              >
                                {subject.marks >= 40 ? 'Pass' : 'Fail'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="details-section">
                <h3>Performance Summary</h3>
                <div className="performance-summary">
                  <div className="summary-item">
                    <div className="summary-circle" style={{ background: getGradeColor(student.grade) }}>
                      {student.marks}%
                    </div>
                    <p>Overall Score</p>
                  </div>
                  <div className="summary-item">
                    <div className="summary-circle" style={{ background: student.marks >= 40 ? '#28a745' : '#dc3545' }}>
                      {student.marks >= 40 ? '✓' : '✗'}
                    </div>
                    <p>{student.marks >= 40 ? 'Passed' : 'Failed'}</p>
                  </div>
                  <div className="summary-item">
                    <div className="summary-circle" style={{ background: '#17a2b8' }}>
                      {student.subjects ? student.subjects.length : 0}
                    </div>
                    <p>Total Subjects</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;