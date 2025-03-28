import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import SalePDF from '@/components/admin/dashboard/pos/SalePDF';
import { SaleForm } from '@/schemas/sales';
import { useFormContext } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { create } from '@/api/sales';
import { toast } from 'sonner';
import { Customer } from '@/schemas/customers';

interface RightPanelFooterProps {
  customers: Customer[];
  documentDetails: SaleForm['documentDetails'];
}

export default function RightPanelFooter({ customers, documentDetails }: RightPanelFooterProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const { handleSubmit, getValues } = useFormContext<SaleForm>();

  const { total, subtotal, tax } = useMemo(() => {
    const total = documentDetails.reduce((sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 0), 0);
    const subtotal = total / 1.18;
    const tax = subtotal * 0.18;

    return {
      total: parseFloat(total.toFixed(2)),
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
    };
  }, [documentDetails]);

  const { mutate, isPending } = useMutation({
    mutationFn: create,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success('Venta creada correctamente');
      setOpenDialog(true);
    },
  });

  const onSubmit = (formData: SaleForm) => {
    mutate({ formData });
  };

  return (
    <div className="p-3 border-t">
      <div className="flex justify-between mb-2">
        <span className="text-gray-600">Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span className="text-gray-600">Tax (18%)</span>
        <span>{formatCurrency(tax)}</span>
      </div>
      <div className="flex justify-between mb-3">
        <span className="font-bold">Total</span>
        <span className="font-bold">{formatCurrency(total)}</span>
      </div>
      <Button
        type="button"
        onClick={handleSubmit(onSubmit)}
        className="w-full h-14 text-lg cursor-pointer"
        disabled={documentDetails.length === 0 || isPending}
      >
        Guardar
      </Button>
      <SalePDF
        documentDetails={documentDetails}
        customer={customers.find((c) => c.id === getValues('customerId'))}
        total={total}
        subtotal={subtotal}
        tax={tax}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
    </div>
  );
}
