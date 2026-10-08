import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from '././pages/Login/Login.jsx';
import Signup from '././pages/SignUp/SignUp.jsx';
import Dashboard from '././pages/Dashboard/DashBoard.jsx';
import StudentList from '././pages/StudentList/StudentList.jsx';
import AddStudent from '././pages/AddStudent/AddStudent.jsx';
import EditStudent from '././pages/EditStudent/EditStudent.jsx';
import StudentDetails from '././pages/StudentDetails/StudentDetails.jsx';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/students" element={<PrivateRoute><StudentList /></PrivateRoute>} />
      <Route path="/add-student" element={<PrivateRoute><AddStudent /></PrivateRoute>} />
      <Route path="/edit-student/:id" element={<PrivateRoute><EditStudent /></PrivateRoute>} />
      <Route path="/student-details/:id" element={<PrivateRoute><StudentDetails /></PrivateRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;