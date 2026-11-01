import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#071426] text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00A9FF]"></div>
      </div>
    );
  }

  if (!user) {
    const redirectUrl = encodeURIComponent(location.pathname);
    if (allowedRoles?.includes('trainer')) {
      return <Navigate to={`/trainer-login?redirect=${redirectUrl}`} replace />;
    }
    return <Navigate to={`/login?redirect=${redirectUrl}`} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user role is not authorized, redirect to their corresponding dashboard
    if (user.role === 'super_admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user.role === 'trainer') {
      return <Navigate to="/trainer/dashboard" replace />;
    }
    return <Navigate to="/student/dashboard" replace />;
  }

  return <>{children}</>;
};
