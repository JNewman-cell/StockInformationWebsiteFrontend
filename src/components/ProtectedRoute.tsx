import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@stackframe/react';
import Loading from '../components/Loading';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = useUser();
  const location = useLocation();

  // Show loading while checking authentication status
  if (user === undefined) {
    return <Loading message="Checking authentication..." fullPage />;
  }

  // Redirect to home page if not authenticated
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Render the protected component if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;