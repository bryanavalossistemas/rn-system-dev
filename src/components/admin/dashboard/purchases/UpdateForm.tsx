import { update } from '@/api/purchases';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Supplier } from '@/schemas/suppliers';
import { useSearchParams } from 'react-router';
import FormFields from '@/components/admin/dashboard/purchases/FormFields';
import { Purchase, PurchaseForm, PurchaseFormSchema } from '@/schemas/purchases';

interface UpdateFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  item: Purchase;
  suppliers: Supplier[];
}

export default function UpdateForm({ setOpen, item, suppliers }: UpdateFormProps) {
  const { id, createdAt, supplierId, voucher } = item;

  const form = useForm<PurchaseForm>({
    resolver: zodResolver(PurchaseFormSchema),
    defaultValues: {
      documentType: voucher.documentType,
      supplierId: supplierId,
      voucherDetails: voucher.voucherDetails.map((d) => {
        return {
          id: d.id,
          unitPrice: d.unitPrice,
          quantity: d.quantity,
          product: { name: d.product.name },
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

      const { documentType, supplierId, voucherDetails } = formData;

      const total = voucherDetails.reduce((total, d) => total + d.unitPrice * d.quantity, 0);
      const subtotal = total / 1.18;
      const tax = subtotal * 0.18;

      const updatedItem: Purchase & {
        isOptimistic?: boolean;
      } = {
        id: id,
        supplier: { name: suppliers.find((s) => s.id === supplierId)?.name || '' },
        supplierId: supplierId,
        voucher: {
          documentType: documentType,
          serie: '',
          number: '',
          total: total,
          subtotal: subtotal,
          tax: tax,
          voucherDetails: voucherDetails.map((v) => {
            return {
              id: v.id,
              unitPrice: v.unitPrice,
              quantity: v.quantity,
              product: v.product,
            };
          }),
        },
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
