import React, { useState, useEffect } from 'react';
import './StudentForm.css';

const StudentForm = ({ initialData, onSubmit, buttonText, disabled }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNo: '',
    course: '',
    marks: '',
    grade: '',
    subjects: []
  });

  const [subject, setSubject] = useState({ name: '', marks: '' });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const calculateGrade = (marks) => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C';
    if (marks >= 40) return 'D';
    return 'F';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    if (name === 'marks') {
      updatedData.grade = calculateGrade(parseInt(value) || 0);
    }

    setFormData(updatedData);
  };

  const handleSubjectChange = (e) => {
    const { name, value } = e.target;
    setSubject({ ...subject, [name]: value });
  };

  const addSubject = () => {
    if (subject.name && subject.marks) {
      // Don't add _id here - let MongoDB generate it
      setFormData({
        ...formData,
        subjects: [...formData.subjects, {
          name: subject.name,
          marks: parseInt(subject.marks)
        }]
      });
      setSubject({ name: '', marks: '' });
    }
  };

  const removeSubject = (index) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Remove any _id fields that might exist in subjects before submitting
    const cleanedData = {
      ...formData,
      subjects: formData.subjects.map(({ name, marks }) => ({ name, marks }))
    };
    onSubmit(cleanedData);
  };

  return (
    <form className="student-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="name">Student Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter student name"
            required
            disabled={disabled}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
            disabled={disabled}
          />
        </div>

        <div className="form-group">
          <label htmlFor="rollNo">Roll Number *</label>
          <input
            type="text"
            id="rollNo"
            name="rollNo"
            value={formData.rollNo}
            onChange={handleChange}
            placeholder="Enter roll number"
            required
            disabled={disabled}
          />
        </div>

        <div className="form-group">
          <label htmlFor="course">Course/Program *</label>
          <input
            type="text"
            id="course"
            name="course"
            value={formData.course}
            onChange={handleChange}
            placeholder="e.g., Computer Science"
            required
            disabled={disabled}
          />
        </div>

        <div className="form-group">
          <label htmlFor="marks">Overall Marks (%) *</label>
          <input
            type="number"
            id="marks"
            name="marks"
            value={formData.marks}
            onChange={handleChange}
            placeholder="Enter marks"
            min="0"
            max="100"
            required
            disabled={disabled}
          />
        </div>

        <div className="form-group">
          <label htmlFor="grade">Grade</label>
          <input
            type="text"
            id="grade"
            name="grade"
            value={formData.grade}
            readOnly
            placeholder="Auto-calculated"
            className="readonly-input"
          />
        </div>
      </div>

      <div className="subjects-section">
        <h3>Subjects</h3>
        <div className="subject-input-group">
          <input
            type="text"
            name="name"
            value={subject.name}
            onChange={handleSubjectChange}
            placeholder="Subject name"
            className="subject-input"
            disabled={disabled}
          />
          <input
            type="number"
            name="marks"
            value={subject.marks}
            onChange={handleSubjectChange}
            placeholder="Marks"
            min="0"
            max="100"
            className="subject-input"
            disabled={disabled}
          />
          <button
            type="button"
            onClick={addSubject}
            className="btn btn-add-subject"
            disabled={disabled}
          >
            Add Subject
          </button>
        </div>

        <div className="subjects-list">
          {formData.subjects.map((sub, index) => (
            <div key={index} className="subject-item">
              <span className="subject-name">{sub.name}</span>
              <span className="subject-marks">{sub.marks} marks</span>
              <button
                type="button"
                onClick={() => removeSubject(index)}
                className="btn-remove-subject"
                disabled={disabled}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary btn-submit"
          disabled={disabled}
        >
          {buttonText || 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;