import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

// Pages
import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import VisitorList from '../pages/visitors/VisitorList';
import AppointmentList from '../pages/appointments/AppointmentList';
import PassList from '../pages/passes/PassList';
import QRScanner from '../pages/scanner/QRScanner';
import CheckLogs from '../pages/checklogs/CheckLogs';
import Reports from '../pages/reports/Reports';
import UserList from '../pages/users/UserList';

// Layout wrapper for authenticated pages
function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Routes>
            {/* Dashboard - All Authenticated Roles */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Visitors Directory - Admin, Security, Employee */}
            <Route
              path="/visitors"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'SECURITY', 'EMPLOYEE']} />
              }
            >
              <Route index element={<VisitorList />} />
            </Route>

            {/* Appointments - All Roles */}
            <Route path="/appointments" element={<AppointmentList />} />

            {/* Passes - All Roles */}
            <Route path="/passes" element={<PassList />} />

            {/* Security QR Scanner - Admin, Security */}
            <Route
              path="/scanner"
              element={<ProtectedRoute allowedRoles={['ADMIN', 'SECURITY']} />}
            >
              <Route index element={<QRScanner />} />
            </Route>

            {/* Check-In/Out Audit Logs - Admin, Security */}
            <Route
              path="/checklogs"
              element={<ProtectedRoute allowedRoles={['ADMIN', 'SECURITY']} />}
            >
              <Route index element={<CheckLogs />} />
            </Route>

            {/* Reports & Analytics - Admin, Security */}
            <Route
              path="/reports"
              element={<ProtectedRoute allowedRoles={['ADMIN', 'SECURITY']} />}
            >
              <Route index element={<Reports />} />
            </Route>

            {/* User Management - Admin only */}
            <Route
              path="/users"
              element={<ProtectedRoute allowedRoles={['ADMIN']} />}
            >
              <Route index element={<UserList />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/*" element={<AppLayout />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
