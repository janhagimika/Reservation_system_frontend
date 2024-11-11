import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginPage from './LoginPage';
import RegistrationPage from './RegistrationPage';
import UserDashboard from './components/UserDashboard/UserDashboard';
import ManagerDashboard from './components/ManagerDashboard/ManagerDashboard';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user" element={<ProtectedRoute component={UserDashboard} role="USER" />}/>
        <Route path="/manager" element={<ProtectedRoute component={ManagerDashboard} role="MANAGER" />}/>
        <Route path="/admin" element={<ProtectedRoute component={AdminDashboard} role="ADMIN" />}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;