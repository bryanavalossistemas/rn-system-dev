import { create } from '@/api/purchases';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Purchase, PurchaseForm, PurchaseFormSchema } from '@/schemas/purchases';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Supplier } from '@/schemas/suppliers';
import { useSearchParams } from 'react-router';
import FormFields from '@/components/admin/dashboard/purchases/FormFields';

interface CreateFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  suppliers: Supplier[];
}

export default function CreateForm({ setOpen, suppliers }: CreateFormProps) {
  const form = useForm<PurchaseForm>({
    resolver: zodResolver(PurchaseFormSchema),
    defaultValues: {
      documentType: 'Factura',
      supplierId: 0,
      purchaseDetails: [],
    },
  });

  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: create,
    onMutate: async ({ formData }) => {
      const { supplierId, documentType, purchaseDetails } = formData;
      await queryClient.cancelQueries({ queryKey: date === null ? ['purchases'] : ['purchases', date] });

      const previousItems = queryClient.getQueryData(date === null ? ['purchases'] : ['purchases', date]);

      const total = purchaseDetails.reduce((total, d) => total + d.unitPrice * d.quantity, 0);
      const subtotal = total / 1.18;
      const tax = subtotal * 0.18;

      const item: Purchase & {
        isOptimistic?: boolean;
      } = {
        id: Date.now(),
        documentType: documentType,
        supplierName: suppliers.find((s) => s.id === supplierId)?.name ?? '',
        supplierDocumentNumber: suppliers.find((s) => s.id === supplierId)?.documentNumber ?? '',
        supplier: suppliers.find((s) => s.id === supplierId),
        purchaseDetails: purchaseDetails.map((d) => {
          return {
            id: d.id,
            productName: d.productName,
            quantity: d.quantity,
            unitPrice: d.unitPrice,
            productId: d.productId,
            createdAt: new Date(),
            purchaseId: Date.now(),
          };
        }),
        total: total,
        subtotal: subtotal,
        tax: tax,
        supplierId: supplierId,
        documentNumber: documentType === 'Factura' ? 'F001 - ' : 'B001 - ',
        createdAt: new Date(),
        isOptimistic: true,
      };

      queryClient.setQueryData(date === null ? ['purchases'] : ['purchases', date], (oldItems: (Purchase & { isOptimistic?: boolean })[]) => {
        return [item, ...oldItems];
      });

      toast.success('Compra creada correctamente');
      setOpen(false);

      return { previousItems };
    },
    onError: (error, _variables, context) => {
      toast.error(error.message);
      queryClient.setQueryData(date === null ? ['purchases'] : ['purchases', date], context?.previousItems);
    },
    onSuccess: (newItem) => {
      queryClient.setQueryData(date === null ? ['purchases'] : ['purchases', date], (oldItems: (Purchase & { isOptimistic?: boolean })[]) => {
        return oldItems.map((item) => (item.isOptimistic ? newItem : item));
      });
    },
  });

  const onSubmit = (formData: PurchaseForm) => {
    mutate({ formData });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 p-2 flex flex-col">
        <FormFields form={form} suppliers={suppliers} />
        <div className="flex flex-col sm:flex-row-reverse gap-2 mt-2 sm:mt-4">
          <Button type="submit" disabled={isPending}>
            Guardar
          </Button>
          <Button onClick={() => setOpen(false)} type="button" variant="outline">
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
