import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import Navbar from '../../components/Navbar/NavBar.jsx';
import Sidebar from '../../components/Sidebar/SideBar.jsx';
import StudentCard from '../../components/StudentCard/StudentCard.jsx';
import './StudentList.css';

const StudentList = () => {
  const { students, deleteStudent } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setDeleting(id);
      try {
        await deleteStudent(id);
      } catch (err) {
        alert('Failed to delete student. Please try again.');
      } finally {
        setDeleting(null);
      }
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade ? student.grade === filterGrade : true;
    return matchesSearch && matchesGrade;
  });

  const grades = ['A+', 'A', 'B+', 'B', 'C', 'D', 'F'];

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          <div className="page-header">
            <h1>All Students</h1>
            <p>Manage and view all student records</p>
          </div>

          <div className="filters-section">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by name, roll no, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-box">
              <label htmlFor="gradeFilter">Filter by Grade:</label>
              <select
                id="gradeFilter"
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="filter-select"
              >
                <option value="">All Grades</option>
                {grades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="students-count">
            Showing {filteredStudents.length} of {students.length} students
          </div>

          {filteredStudents.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h2>No Students Found</h2>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="students-grid">
              {filteredStudents.map(student => (
                <StudentCard
                  key={student._id}
                  student={student}
                  onDelete={handleDelete}
                  isDeleting={deleting === student._id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentList;