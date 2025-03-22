import { Navigate, Outlet } from 'react-router';
import useStore from '@/store';

export default function RedirectIfAuthenticated() {
  const { user } = useStore();

  if (user) {
    if (user.roles.includes('admin')) {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}
