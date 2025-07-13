import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../firebase/authContext';

export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}