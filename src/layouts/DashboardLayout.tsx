import DashboardSidebar from '@/components/admin/dashboard/ui/DashboardSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Outlet } from 'react-router';

export default function DashboardLayout() {
  const defaultOpen = localStorage.getItem('sidebar') === 'true';

  return (
    <>
      <SidebarProvider defaultOpen={defaultOpen}>
        <DashboardSidebar />
        <Outlet />
      </SidebarProvider>
    </>
  );
}
