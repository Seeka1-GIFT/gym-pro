import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

export default function ProtectedRoute() {
  const auth = useAuth();
  if (!auth.ready) return null; // could render a full page loader here
  if (auth.status !== 'authenticated') return <Navigate to="/login" replace />;
  return <Outlet />;
}
