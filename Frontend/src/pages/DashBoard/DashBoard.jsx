import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Navbar from '../../components/Navbar/NavBar.jsx';
import Sidebar from '../../components/Sidebar/SideBar.jsx';
import './Dashboard.css';

const Dashboard = () => {
  const { students } = useAuth();

  const totalStudents = students.length;
  const passedStudents = students.filter(s => parseFloat(s.marks) >= 40).length;
  const failedStudents = totalStudents - passedStudents;
  const averageMarks = students.length > 0
    ? (students.reduce((sum, s) => sum + parseFloat(s.marks), 0) / students.length).toFixed(2)
    : 0;

  const gradeDistribution = students.reduce((acc, student) => {
    acc[student.grade] = (acc[student.grade] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          <div className="page-header">
            <h1>Dashboard</h1>
            <p>Overview of student performance</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card stat-primary">
              <div className="stat-icon">👥</div>
              <div className="stat-details">
                <h3>Total Students</h3>
                <p className="stat-number">{totalStudents}</p>
              </div>
            </div>

            <div className="stat-card stat-success">
              <div className="stat-icon">✅</div>
              <div className="stat-details">
                <h3>Passed</h3>
                <p className="stat-number">{passedStudents}</p>
              </div>
            </div>

            <div className="stat-card stat-danger">
              <div className="stat-icon">❌</div>
              <div className="stat-details">
                <h3>Failed</h3>
                <p className="stat-number">{failedStudents}</p>
              </div>
            </div>

            <div className="stat-card stat-info">
              <div className="stat-icon">📊</div>
              <div className="stat-details">
                <h3>Average Marks</h3>
                <p className="stat-number">{averageMarks}%</p>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h2>Grade Distribution</h2>
              <div className="grade-list">
                {Object.entries(gradeDistribution).map(([grade, count]) => (
                  <div key={grade} className="grade-item">
                    <span className="grade-label">Grade {grade}</span>
                    <div className="grade-bar-container">
                      <div
                        className="grade-bar"
                        style={{ width: `${(count / totalStudents) * 100}%` }}
                      ></div>
                    </div>
                    <span className="grade-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card">
              <h2>Quick Actions</h2>
              <div className="quick-actions">
                <Link to="/add-student" className="action-btn">
                  <span className="action-icon">➕</span>
                  <span>Add New Student</span>
                </Link>
                <Link to="/students" className="action-btn">
                  <span className="action-icon">👥</span>
                  <span>View All Students</span>
                </Link>
              </div>
            </div>
          </div>

          {students.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h2>No Students Yet</h2>
              <p>Start by adding your first student to the system</p>
              <Link to="/add-student" className="btn btn-primary">
                Add Student
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;