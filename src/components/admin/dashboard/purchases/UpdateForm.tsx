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
  const { id, document, supplier, createdAt } = item;

  const form = useForm<PurchaseForm>({
    resolver: zodResolver(PurchaseFormSchema),
    defaultValues: {
      documentTypeId: document?.documentType?.id,
      supplierId: supplier?.id,
      documentDetails: document?.documentDetails?.map((d) => {
        return {
          id: d.id,
          productId: d.product.id,
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
  });

  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: update,
    onMutate: async ({ id, formData }) => {
      await queryClient.cancelQueries({ queryKey: date === null ? ['purchases'] : ['purchases', date] });

      const previousItems = queryClient.getQueryData(date === null ? ['purchases'] : ['purchases', date]);

      const { documentTypeId, supplierId, documentDetails } = formData;

      const updatedItem: Purchase & {
        isOptimistic?: boolean;
      } = {
        id: id,
        supplierName: suppliers.find((s) => s.id === supplierId)?.name ?? '',
        supplierDocument: suppliers.find((s) => s.id === supplierId)?.document ?? '',
        supplier: suppliers.find((s) => s.id === supplierId),
        document: {
          documentSerie: document?.documentSerie,
          documentNumber: document?.documentNumber,
          total: documentDetails.filter((d) => d.deleted !== true).reduce((total, d) => total + d.unitPrice * d.quantity, 0),
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
