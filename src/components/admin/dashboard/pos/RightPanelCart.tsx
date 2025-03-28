import RightPanelHeading from '@/components/admin/dashboard/pos/RightPanelHeading';
import { useCustomers } from '@/hooks/useCustomers';
import RightPanelBody from '@/components/admin/dashboard/pos/RightPanelBody';
import RightPanelFooter from '@/components/admin/dashboard/pos/RightPanelFooter';
import { SaleForm } from '@/schemas/sales';
import { useFormContext, useWatch } from 'react-hook-form';

export default function RightPanelCart() {
  const { data: customers = [] } = useCustomers();

  const { control } = useFormContext<SaleForm>();

  const documentDetails = useWatch({ control: control, name: 'documentDetails' });

  return (
    <div className="w-100 border-l flex flex-col">
      {/* Right Panel - Cart */}
      <RightPanelHeading customers={customers} />

      <RightPanelBody documentDetails={documentDetails} />

      <RightPanelFooter customers={customers} documentDetails={documentDetails} />
    </div>
  );
}
