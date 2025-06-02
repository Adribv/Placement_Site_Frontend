import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { SampleDataProvider } from './utils/sampleDataContext';

// Admin imports
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminStudentDashboard from './pages/AdminStudentDashboard';
import AdminLeaderboard from './pages/AdminLeaderboard';
import AdminLayout from './components/admin/AdminLayout';
import BulkUpload from './components/admin/BulkUpload';
import ScoreUpload from './components/admin/ScoreUpload';
import TrainingModuleView from './components/admin/TrainingModuleView';
import AdminAttendance from './pages/admin/AdminAttendance';
import AdminDetailedAttendance from './pages/admin/AdminDetailedAttendance';

// Student imports
import StudentView from './pages/StudentView';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';
import ProtectedRoute from './components/student/ProtectedRoute';
import Leaderboard from './pages/Leaderboard';
import StudentDetailedAttendance from './pages/student/StudentDetailedAttendance';
import StudentAttendanceDetails from './pages/student/StudentAttendanceDetails';

// Other imports
import Students from './pages/Students';
import NotFound from './pages/NotFound';

// Staff imports
import StaffLogin from './pages/StaffLogin';
import StaffDashboard from './pages/StaffDashboard';
import ProtectedStaffRoute from './components/staff/ProtectedStaffRoute';
import StaffManagement from './pages/StaffManagement';
import StaffAttendance from './pages/staff/StaffAttendance';
import StaffDetailedAttendance from './pages/staff/StaffDetailedAttendance';
import AttendanceView from './pages/AttendanceView';
import StaffStudentLogs from './pages/staff/StaffStudentLogs';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <Router>
      <SampleDataProvider>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <Outlet />
                </AdminLayout>
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="students/:studentId/dashboard" element={<AdminStudentDashboard />} />
            <Route path="leaderboard" element={<AdminLeaderboard />} />
            <Route path="bulk-upload" element={<BulkUpload />} />
            <Route path="scores" element={<ScoreUpload />} />
            <Route path="training" element={<TrainingModuleView />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="attendance/detailed" element={<AdminDetailedAttendance />} />
          </Route>
          
          {/* Student Routes */}
          <Route path="/student/login" element={<StudentLogin />} />
          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="attendance" element={<StudentAttendanceDetails />} />
            <Route path="attendance/detailed" element={<StudentDetailedAttendance />} />
          </Route>

          {/* Staff Routes */}
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route
            path="/staff"
            element={
              <ProtectedStaffRoute>
                <Outlet />
              </ProtectedStaffRoute>
            }
          >
            <Route path="dashboard" element={<StaffDashboard />} />
            <Route path="attendance" element={<StaffAttendance />} />
            <Route path="attendance/detailed" element={<StaffDetailedAttendance />} />
            <Route path="student-logs" element={<StaffStudentLogs />} />
          </Route>

          {/* Attendance View Route */}
          <Route path="/attendance/view" element={<AttendanceView />} />

          {/* Default Routes */}
          <Route path="/" element={<Navigate to="/student/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SampleDataProvider>
    </Router>
  );
}

export default App;
