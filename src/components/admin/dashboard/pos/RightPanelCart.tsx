import RightPanelHeading from '@/components/admin/dashboard/pos/RightPanelHeading';
import { useCustomers } from '@/hooks/useCustomers';
import RightPanelBody from '@/components/admin/dashboard/pos/RightPanelBody';
import RightPanelFooter from '@/components/admin/dashboard/pos/RightPanelFooter';
import { SaleForm } from '@/schemas/sales';
import { useFormContext, useWatch } from 'react-hook-form';

export default function RightPanelCart() {
  const { data: customers = [] } = useCustomers();

  const { control } = useFormContext<SaleForm>();

  const saleDetails = useWatch({ control: control, name: 'saleDetails' });

  return (
    <div className="w-100 border-l flex flex-col">
      {/* Right Panel - Cart */}
      <RightPanelHeading customers={customers} />

      <RightPanelBody saleDetails={saleDetails} />

      <RightPanelFooter customers={customers} saleDetails={saleDetails} />
    </div>
  );
}
