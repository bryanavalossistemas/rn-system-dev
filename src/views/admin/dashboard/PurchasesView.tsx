import DashboardHeader from '@/components/admin/dashboard/DashboardHeader';
import DashboardTitle from '@/components/admin/dashboard/DashboardTitle';
import { Separator } from '@/components/ui/separator';
import { SidebarInset } from '@/components/ui/sidebar';
import { Table } from '@/components/admin/dashboard/purchases/Table';
import CreateButton from '@/components/admin/dashboard/purchases/CreateButton';

const breadcrumb = {
  page: {
    label: 'Compras',
  },
};

export default function PurchasesView() {
  return (
    <SidebarInset>
      <DashboardHeader breadcrumb={breadcrumb} />
      <div className="flex-1 p-2 sm:p-4">
        <div className="sm:flex sm:justify-between sm:items-end">
          <DashboardTitle title="Compras" description="Listado completo de compras" />
          <CreateButton />
        </div>
        <Separator className="hidden sm:block mt-2" />
        <Table />
      </div>
    </SidebarInset>
  );
}
