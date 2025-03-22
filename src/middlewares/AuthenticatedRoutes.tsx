import { Navigate, Outlet } from 'react-router';
import useStore from '@/store';

export default function AuthenticatedRoutes() {
  const { token } = useStore();
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}
