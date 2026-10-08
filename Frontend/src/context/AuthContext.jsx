import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, studentAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          setCurrentUser(response.data);
          setIsAuthenticated(true);
          await fetchStudents();
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getAllStudents();
      setStudents(response.data);
    } catch (error) {
      console.error('Fetch students error:', error);
    }
  };

  const signup = async (userData) => {
    try {
      await authAPI.signup(userData);
      return { success: true, message: 'Signup successful!' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed!'
      };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      setCurrentUser(user);
      setIsAuthenticated(true);

      await fetchStudents();

      return { success: true, message: 'Login successful!' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid credentials!'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setStudents([]);
  };

  const addStudent = async (studentData) => {
    try {
      const response = await studentAPI.createStudent(studentData);
      setStudents([response.data.student, ...students]);
      return { success: true, message: 'Student added successfully!' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add student!'
      };
    }
  };

  const updateStudent = async (id, studentData) => {
    try {
      const response = await studentAPI.updateStudent(id, studentData);
      setStudents(students.map(s => s._id === id ? response.data.student : s));
      return { success: true, message: 'Student updated successfully!' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update student!'
      };
    }
  };

  const deleteStudent = async (id) => {
    try {
      await studentAPI.deleteStudent(id);
      setStudents(students.filter(s => s._id !== id));
      return { success: true, message: 'Student deleted successfully!' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete student!'
      };
    }
  };

  const getStudentById = (id) => {
    return students.find(student => student._id === id);
  };

  const value = {
    isAuthenticated,
    currentUser,
    students,
    loading,
    signup,
    login,
    logout,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};