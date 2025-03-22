import DashboardHeader from '@/components/admin/dashboard/DashboardHeader';
import DashboardTitle from '@/components/admin/dashboard/DashboardTitle';
import { Separator } from '@/components/ui/separator';
import { SidebarInset } from '@/components/ui/sidebar';
import { Table } from '@/components/admin/dashboard/brands/Table';
import CreateButton from '@/components/admin/dashboard/brands/CreateButton';
import CreateButtonDesktop from '@/components/admin/dashboard/brands/CreateButtonDesktop';

const breadcrumb = {
  page: {
    label: 'Marcas',
  },
};

export default function BrandsView() {
  return (
    <SidebarInset>
      <DashboardHeader breadcrumb={breadcrumb} />
      <div className="flex-1 p-2 sm:p-4">
        <div className="sm:flex sm:justify-between sm:items-end">
          <DashboardTitle title="Marcas" description="Listado completo de marcas de productos." />
          <CreateButton />
          <CreateButtonDesktop />
        </div>
        <Separator className="hidden sm:block mt-2" />
        <Table />
      </div>
    </SidebarInset>
  );
}
