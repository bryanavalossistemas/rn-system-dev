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
      documentTypeId: 1,
      supplierId: 0,
      documentDetails: [],
    },
  });

  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: create,
    onMutate: async ({ formData }) => {
      const { supplierId, documentTypeId, documentDetails } = formData;
      await queryClient.cancelQueries({ queryKey: date === null ? ['purchases'] : ['purchases', date] });

      const previousItems = queryClient.getQueryData(date === null ? ['purchases'] : ['purchases', date]);

      const item: Purchase & {
        isOptimistic?: boolean;
      } = {
        id: Date.now(),
        supplierName: suppliers.find((s) => s.id === supplierId)?.name ?? '',
        supplierDocument: suppliers.find((s) => s.id === supplierId)?.document ?? '',
        supplier: suppliers.find((s) => s.id === supplierId),
        document: {
          total: documentDetails.reduce((total, d) => total + d.unitPrice * d.quantity, 0),
          documentType: { id: documentTypeId },
          documentDetails: documentDetails.map((d) => {
            return {
              id: d.id,
              productName: d.productName,
              quantity: d.quantity,
              unitPrice: d.unitPrice,
              product: d.product,
              createdAt: d.createdAt,
              created: d.created,
              deleted: d.deleted,
            };
          }),
        },
        createdAt: new Date(),
        isOptimistic: true,
      };

      queryClient.setQueryData(date === null ? ['purchases'] : ['purchases', date], (oldItems: (Purchase & { isOptimistic?: boolean })[]) => {
        return [item, ...oldItems];
      });

      toast.success('Proveedor creado correctamente');
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
