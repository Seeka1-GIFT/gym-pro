import { lazy, Suspense, startTransition } from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import ProtectedRoute from '../components/ProtectedRoute';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

// lazily load pages to reduce bundle size
const Dashboard = lazy(() => import('../features/dashboard/Dashboard'));
const MembersList = lazy(() => import('../features/members/MembersList'));
const MemberDetail = lazy(() => import('../features/members/MemberDetail'));
const PlansList = lazy(() => import('../features/plans/PlansList'));
const MembershipsList = lazy(() => import('../features/memberships/MembershipsList'));
const AttendanceList = lazy(() => import('../features/attendance/AttendanceList'));
const PaymentsList = lazy(() => import('../features/payments/PaymentsList'));
const ExpensesList = lazy(() => import('../features/expenses/ExpensesList'));
const AssetsList = lazy(() => import('../features/assets/AssetsList'));
const Reports = lazy(() => import('../features/reports/Reports'));
const Settings = lazy(() => import('../features/settings/Settings'));
const Login = lazy(() => import('../pages/Login'));

function AuthRedirect() {
  const auth = useAuth();
  if (!auth.ready) return null;
  return auth.status === 'authenticated' ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}

function Shell() {
  return (
    <AppLayout />
  );
}

// Error boundary component
function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Something went wrong
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="btn"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

export default function createRoutes() {
  return createBrowserRouter([
    {
      path: '/',
      element: <AuthRedirect />,
      errorElement: <ErrorBoundary error={new Error('Route error')} />,
    },
    {
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <Shell />
        </Suspense>
      ),
      children: [
        {
          path: 'login',
          element: <Login />,
          errorElement: <ErrorBoundary error={new Error('Login error')} />
        },
        { 
          element: <ProtectedRoute />,
          children: [
            {
              path: 'dashboard',
              element: <Dashboard />,
              errorElement: <ErrorBoundary error={new Error('Dashboard error')} />
            },
            { 
              path: 'members', 
              element: <MembersList />,
              errorElement: <ErrorBoundary error={new Error('Members error')} />
            },
            { 
              path: 'members/:id', 
              element: <MemberDetail />,
              errorElement: <ErrorBoundary error={new Error('Member detail error')} />
            },
            { 
              path: 'plans', 
              element: <PlansList />,
              errorElement: <ErrorBoundary error={new Error('Plans error')} />
            },
            { 
              path: 'memberships', 
              element: <MembershipsList />,
              errorElement: <ErrorBoundary error={new Error('Memberships error')} />
            },
            { 
              path: 'attendance', 
              element: <AttendanceList />,
              errorElement: <ErrorBoundary error={new Error('Attendance error')} />
            },
            { 
              path: 'payments', 
              element: <PaymentsList />,
              errorElement: <ErrorBoundary error={new Error('Payments error')} />
            },
            { 
              path: 'expenses', 
              element: <ExpensesList />,
              errorElement: <ErrorBoundary error={new Error('Expenses error')} />
            },
            { 
              path: 'assets', 
              element: <AssetsList />,
              errorElement: <ErrorBoundary error={new Error('Assets error')} />
            },
            { 
              path: 'reports', 
              element: <Reports />,
              errorElement: <ErrorBoundary error={new Error('Reports error')} />
            },
            { 
              path: 'settings', 
              element: <Settings />,
              errorElement: <ErrorBoundary error={new Error('Settings error')} />
            }
          ]
        },
      ]
    }
  ]);
}