import DashboardHeader from '@/components/admin/dashboard/DashboardHeader';
import DashboardTitle from '@/components/admin/dashboard/DashboardTitle';
import { Separator } from '@/components/ui/separator';
import { SidebarInset } from '@/components/ui/sidebar';
import { Table } from '@/components/admin/dashboard/suppliers/Table';
import CreateButton from '@/components/admin/dashboard/suppliers/CreateButton';

const breadcrumb = {
  page: {
    label: 'Proveedores',
  },
};

export default function SuppliersView() {
  return (
    <SidebarInset>
      <DashboardHeader breadcrumb={breadcrumb} />
      <div className="flex-1 p-2 sm:p-4">
        <div className="sm:flex sm:justify-between sm:items-end">
          <DashboardTitle title="Proveedores" description="Listado completo de proveedores" />
          <CreateButton />
        </div>
        <Separator className="hidden sm:block mt-2" />
        <Table />
      </div>
    </SidebarInset>
  );
}
