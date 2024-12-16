import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import Login from './components/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import ComplaintsPage from './pages/ComplaintsPage';
import TaskList from './components/TaskList';  // Updated import
import OfficerDashboard from './pages/OfficerDashboard';
import TaskDetails from './pages/TaskDetails';
import ProtectedRoute from './components/ProtectedRoute';
import PrincipalOfficerDashboard from './pages/PrincipalOfficerDashboard';
import SeniorOfficerDashboard from './pages/SeniorOfficerDashboard';
import Reports from './pages/Reports';
import MyTasksPage from './pages/MyTasksPage';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin-dashboard"
            element={<ProtectedRoute component={AdminDashboard} role="deputyDirector" />}
          />
          <Route
            path="/user-management"
            element={<ProtectedRoute component={UserManagement} role="deputyDirector" />}
          />
          <Route
            path="/complaints"
            element={<ProtectedRoute component={ComplaintsPage} />}
          />
          <Route
            path="/tasks"
            element={<ProtectedRoute component={TaskList} />}
          />
          <Route
            path="/my-tasks"
            element={<ProtectedRoute component={MyTasksPage} />}
          />
          <Route
            path="/task/:taskId"
            element={<ProtectedRoute component={TaskDetails} />}
          />
          <Route
            path="/officer-dashboard"
            element={<ProtectedRoute component={OfficerDashboard} role="officer" />}
          />
          <Route
            path="/principal-officer-dashboard"
            element={<ProtectedRoute component={PrincipalOfficerDashboard} role="principalOfficer" />}
          />
          <Route
            path="/senior-officer-dashboard"
            element={<ProtectedRoute component={SeniorOfficerDashboard} role="seniorOfficer" />}
          />
          <Route
            path="/reports"
            element={<ProtectedRoute component={Reports} />}
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;