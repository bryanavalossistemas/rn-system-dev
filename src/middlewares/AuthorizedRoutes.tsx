import { Navigate, Outlet } from 'react-router';
import useStore from '@/store';

export default function AuthorizedRoutes({ allowedRoles }: { allowedRoles: string[] }) {
  const { user } = useStore();

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const hasAccess = allowedRoles.includes(user.role);

  return hasAccess ? <Outlet /> : <Navigate to="/auth/login" replace />;
}
