import { update } from '@/api/sales';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Sale, SaleForm, SaleFormSchema } from '@/schemas/sales';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Customer } from '@/schemas/customers';
import { useSearchParams } from 'react-router';
import FormFields from '@/components/admin/dashboard/sales/FormFields';

interface UpdateFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  item: Sale;
  customers: Customer[];
}

export default function UpdateForm({ setOpen, item, customers }: UpdateFormProps) {
  const { id, createdAt, documentType, customerId, saleDetails, documentNumber } = item;

  const form = useForm<SaleForm>({
    resolver: zodResolver(SaleFormSchema),
    defaultValues: {
      documentType: documentType,
      customerId: customerId,
      saleDetails: saleDetails.map((d) => {
        return {
          id: d.id,
          productId: d.productId,
          productName: d.productName,
          quantity: d.quantity,
          unitPrice: d.unitPrice,
          costPrice: d.costPrice,
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
      await queryClient.cancelQueries({ queryKey: date === null ? ['sales'] : ['sales', date] });

      const previousItems = queryClient.getQueryData(date === null ? ['sales'] : ['sales', date]);

      const { documentType, customerId, saleDetails } = formData;

      const total = saleDetails.reduce((total, d) => total + d.unitPrice * d.quantity, 0);
      const subtotal = total / 1.18;
      const tax = subtotal * 0.18;

      const updatedItem: Sale & {
        isOptimistic?: boolean;
      } = {
        id: id,
        customerName: customers.find((s) => s.id === customerId)?.name ?? '',
        customerDocumentNumber: customers.find((s) => s.id === customerId)?.documentNumber ?? '',
        customer: customers.find((s) => s.id === customerId),
        total: total,
        subtotal: subtotal,
        tax: tax,
        documentType: documentType,
        documentNumber: documentNumber,
        customerId: customerId,
        saleDetails: saleDetails.map((d) => {
          return {
            id: d.id,
            purchaseId: id,
            productId: d.productId,
            productName: d.productName,
            quantity: d.quantity,
            unitPrice: d.unitPrice,
            createdAt: new Date(),
            costPrice: d.costPrice,
            saleId: id,
          };
        }),
        createdAt: createdAt,
        isOptimistic: true,
      };

      queryClient.setQueryData(date === null ? ['sales'] : ['sales', date], (oldItems: (Sale & { isOptimistic?: boolean })[]) =>
        oldItems.map((item) => (item.id === id ? updatedItem : item)),
      );

      setOpen(false);
      toast.success('Venta actualizada correctamente');

      return { previousItems };
    },
    onError: (error, _variables, context) => {
      toast.error(error.message);
      queryClient.setQueryData(date === null ? ['sales'] : ['sales', date], context?.previousItems);
    },
    onSuccess: (newItem) => {
      queryClient.setQueryData(date === null ? ['sales'] : ['sales', date], (oldItems: (Sale & { isOptimistic?: boolean })[]) => {
        return oldItems.map((item) => (item.isOptimistic ? newItem : item));
      });
    },
  });

  const onSubmit = (formData: SaleForm) => {
    mutate({ id, formData });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 p-2 flex flex-col">
        <FormFields form={form} customers={customers} />
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
