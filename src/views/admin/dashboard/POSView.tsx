import DashboardHeader from '@/components/admin/dashboard/ui/DashboardHeader';
import { SidebarInset } from '@/components/ui/sidebar';
import { SaleForm, SaleFormSchema } from '@/schemas/sales';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import LeftPanelProducts from '@/components/admin/dashboard/pos/LeftPanelProducts';
import RightPanelCart from '@/components/admin/dashboard/pos/RightPanelCart';

const breadcrumb = {
  page: {
    label: 'Punto de Venta',
  },
};

export default function POSView() {
  const form = useForm<SaleForm>({
    resolver: zodResolver(SaleFormSchema),
    defaultValues: {
      documentType: 'Factura',
      customerId: 0,
      saleDetails: [],
    },
  });

  return (
    <>
      <SidebarInset className="max-h-svh h-svh">
        <DashboardHeader breadcrumb={breadcrumb} />

        <FormProvider {...form}>
          <div className="flex flex-1 h-[calc(100svh-57px)]">
            {/* Left Panel - Products */}
            <LeftPanelProducts />

            {/* Right Panel - Cart */}
            <RightPanelCart />
          </div>
        </FormProvider>
      </SidebarInset>
    </>
  );
}
