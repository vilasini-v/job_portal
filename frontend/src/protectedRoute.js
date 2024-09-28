// src/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
    if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  return children;
}

export default ProtectedRoute;
