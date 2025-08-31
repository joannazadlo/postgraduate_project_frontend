import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type PrivateRouteProps = {
  children: React.ReactNode;
}

export default function PrivateRoute({ children } : PrivateRouteProps) {
  const { currentUser, loading } = useAuth();

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  if (!currentUser) { return <Navigate replace to="/auth" />}

  return children;
};
