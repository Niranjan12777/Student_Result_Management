import React from 'react';
import { Link } from 'react-router-dom';
import './StudentCard.css';

const StudentCard = ({ student, onDelete, isDeleting }) => {
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
    <div className="student-card">
      <div className="student-card-header">
        <div className="student-avatar">
          {student.name.charAt(0).toUpperCase()}
        </div>
        <div className="student-info">
          <h3 className="student-name">{student.name}</h3>
          <p className="student-email">{student.email}</p>
        </div>
      </div>

      <div className="student-card-body">
        <div className="info-row">
          <span className="info-label">Roll No:</span>
          <span className="info-value">{student.rollNo}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Course:</span>
          <span className="info-value">{student.course}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Grade:</span>
          <span
            className="info-value grade-badge"
            style={{ backgroundColor: getGradeColor(student.grade) }}
          >
            {student.grade}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Marks:</span>
          <span className="info-value">{student.marks}%</span>
        </div>
      </div>

      <div className="student-card-footer">
        <Link to={`/student-details/${student._id}`} className="btn btn-view">
          View Details
        </Link>
        <Link to={`/edit-student/${student._id}`} className="btn btn-edit">
          Edit
        </Link>
        <button
          onClick={() => onDelete(student._id)}
          className="btn btn-delete"
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default StudentCard;