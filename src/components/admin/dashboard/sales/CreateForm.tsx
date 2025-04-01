import { create } from '@/api/sales';
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

interface CreateFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  customers: Customer[];
}

export default function CreateForm({ setOpen, customers }: CreateFormProps) {
  const form = useForm<SaleForm>({
    resolver: zodResolver(SaleFormSchema),
    defaultValues: {
      documentType: 'Factura',
      customerId: 0,
      saleDetails: [],
    },
  });

  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: create,
    onMutate: async ({ formData }) => {
      const { customerId, documentType, saleDetails } = formData;
      await queryClient.cancelQueries({ queryKey: date === null ? ['sales'] : ['sales', date] });

      const previousItems = queryClient.getQueryData(date === null ? ['sales'] : ['sales', date]);

      const total = saleDetails.reduce((total, d) => total + d.unitPrice * d.quantity, 0);
      const subtotal = total / 1.18;
      const tax = subtotal * 0.18;

      const saleId = Date.now();

      const item: Sale & {
        isOptimistic?: boolean;
      } = {
        id: saleId,
        documentType: documentType,
        customerName: customers.find((s) => s.id === customerId)?.name ?? '',
        customerDocumentNumber: customers.find((s) => s.id === customerId)?.documentNumber ?? '',
        customer: customers.find((s) => s.id === customerId),
        saleDetails: saleDetails.map((d) => {
          return {
            id: d.id,
            productName: d.productName,
            quantity: d.quantity,
            unitPrice: d.unitPrice,
            productId: d.productId,
            costPrice: d.costPrice,
            saleId: saleId,
            createdAt: new Date(),
            purchaseId: Date.now(),
          };
        }),
        total: total,
        subtotal: subtotal,
        tax: tax,
        customerId: customerId,
        documentNumber: documentType === 'Factura' ? 'F001 - ' : 'B001 - ',
        createdAt: new Date(),
        isOptimistic: true,
      };

      queryClient.setQueryData(date === null ? ['sales'] : ['sales', date], (oldItems: (Sale & { isOptimistic?: boolean })[]) => {
        return [item, ...oldItems];
      });

      toast.success('Compra creada correctamente');
      setOpen(false);

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
    mutate({ formData });
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
