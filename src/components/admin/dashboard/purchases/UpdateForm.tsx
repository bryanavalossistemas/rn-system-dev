import { update } from '@/api/purchases';
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

interface UpdateFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  item: Purchase;
  suppliers: Supplier[];
}

export default function UpdateForm({ setOpen, item, suppliers }: UpdateFormProps) {
  const { id, createdAt, documentType, supplierId, purchaseDetails, documentNumber } = item;

  const form = useForm<PurchaseForm>({
    resolver: zodResolver(PurchaseFormSchema),
    defaultValues: {
      documentType: documentType,
      supplierId: supplierId,
      purchaseDetails: purchaseDetails?.map((d) => {
        return {
          id: d.id,
          productId: d.productId,
          productName: d.productName,
          quantity: d.quantity,
          unitPrice: d.unitPrice,
        };
      }),
    },
  });

  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: update,
    onMutate: async ({ id, formData }) => {
      await queryClient.cancelQueries({ queryKey: date === null ? ['purchases'] : ['purchases', date] });

      const previousItems = queryClient.getQueryData(date === null ? ['purchases'] : ['purchases', date]);

      const { documentType, supplierId, purchaseDetails } = formData;

      const total = purchaseDetails.reduce((total, d) => total + d.unitPrice * d.quantity, 0);
      const subtotal = total / 1.18;
      const tax = subtotal * 0.18;

      const updatedItem: Purchase & {
        isOptimistic?: boolean;
      } = {
        id: id,
        supplierName: suppliers.find((s) => s.id === supplierId)?.name ?? '',
        supplierDocumentNumber: suppliers.find((s) => s.id === supplierId)?.documentNumber ?? '',
        supplier: suppliers.find((s) => s.id === supplierId),
        total: total,
        subtotal: subtotal,
        tax: tax,
        documentType: documentType,
        documentNumber: documentNumber,
        supplierId: supplierId,
        purchaseDetails: purchaseDetails.map((d) => {
          return {
            id: d.id,
            purchaseId: id,
            productId: d.productId,
            productName: d.productName,
            quantity: d.quantity,
            unitPrice: d.unitPrice,
            createdAt: new Date(),
          };
        }),
        createdAt: createdAt,
        isOptimistic: true,
      };

      queryClient.setQueryData(date === null ? ['purchases'] : ['purchases', date], (oldItems: (Purchase & { isOptimistic?: boolean })[]) =>
        oldItems.map((item) => (item.id === id ? updatedItem : item)),
      );

      setOpen(false);
      toast.success('Compra actualizada correctamente');

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
    mutate({ id, formData });
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
