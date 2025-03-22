import DashboardHeader from '@/components/admin/dashboard/DashboardHeader';
import { SidebarInset } from '@/components/ui/sidebar';

export default function DashboardView() {
  return (
    <>
      <SidebarInset>
        <DashboardHeader
          breadcrumb={{
            page: {
              label: 'Home',
            },
          }}
        />
        <div className="flex-1 flex p-4"></div>
      </SidebarInset>
    </>
  );
}
