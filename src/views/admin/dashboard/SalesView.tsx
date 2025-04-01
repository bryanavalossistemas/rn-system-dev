import DashboardHeader from '@/components/admin/dashboard/ui/DashboardHeader';
import DashboardTitle from '@/components/admin/dashboard/ui/DashboardTitle';
import { Separator } from '@/components/ui/separator';
import { SidebarInset } from '@/components/ui/sidebar';
import { Table } from '@/components/admin/dashboard/sales/Table';
import CreateButton from '@/components/admin/dashboard/sales/CreateButton';

const breadcrumb = {
  page: {
    label: 'Ventas',
  },
};

export default function SalesView() {
  return (
    <SidebarInset>
      <DashboardHeader breadcrumb={breadcrumb} />
      <div className="flex-1 p-2 sm:p-4">
        <div className="sm:flex sm:justify-between sm:items-end">
          <DashboardTitle title="Ventas" description="Listado completo de ventas" />
          <CreateButton />
        </div>
        <Separator className="hidden sm:block mt-2" />
        <Table />
      </div>
    </SidebarInset>
  );
}
