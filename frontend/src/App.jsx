import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { PatientDashboard } from './pages/PatientDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { QueryForm } from './pages/QueryForm';
import { AppointmentBooking } from './pages/AppointmentBooking';
import { QueriesPage } from './pages/QueriesPage';

/* ─── Auth guard: redirects to /login if not authenticated ── */
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

/* ─── Redirect logged-in users away from login/signup ──────── */
const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

/* ─── Smart dashboard: patient vs doctor based on role ─────── */
const DashboardRouter = () => {
  const { user } = useAuth();
  if (user?.role === 'doctor') return <DoctorDashboard />;
  return <PatientDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-[#0a0c10] text-slate-100 min-h-screen selection:bg-cyan-500/30">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />

            {/* Guest-only routes: redirect to dashboard if already logged in */}
            <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />

            {/* Protected routes: redirect to login if not authenticated */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
            <Route path="/query" element={<ProtectedRoute><QueryForm /></ProtectedRoute>} />
            <Route path="/queries" element={<ProtectedRoute><QueriesPage /></ProtectedRoute>} />
            <Route path="/appointments" element={<ProtectedRoute><AppointmentBooking /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
