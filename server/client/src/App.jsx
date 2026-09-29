import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Interrogate from './pages/Interrogate';
import StressTest from './pages/StressTest';
import ResumeRoaster from './pages/ResumeRoaster';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-cyber-neonCyan border-t-transparent rounded-full animate-spin"></div>
          <span className="font-mono text-xs text-cyber-neonCyan uppercase tracking-widest">
            AUTHENTICATING OPERATIVE PROTOCOL...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-cyber-bg text-cyber-text selection:bg-cyber-neonCyan selection:text-black">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/interrogate" 
            element={
              <ProtectedRoute>
                <Interrogate />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/stress-test" 
            element={
              <ProtectedRoute>
                <StressTest />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/resume-roaster" 
            element={
              <ProtectedRoute>
                <ResumeRoaster />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
