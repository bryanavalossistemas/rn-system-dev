import { create } from '@/api/suppliers';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Supplier, SupplierForm, SupplierFormSchema } from '@/schemas/suppliers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import FormFields from '@/components/admin/dashboard/suppliers/FormFields';
import { useSearchParams } from 'react-router';

interface CreateFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CreateForm({ setOpen }: CreateFormProps) {
  const form = useForm<SupplierForm>({
    resolver: zodResolver(SupplierFormSchema),
    defaultValues: {
      name: '',
      type: 'RUC',
      document: '',
      address: '',
      phone: '',
      email: '',
    },
  });

  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: create,
    onMutate: async ({ formData }) => {
      const { name, type, document, address, phone, email } = formData;
      await queryClient.cancelQueries({ queryKey: date === null ? ['suppliers'] : ['suppliers', date] });

      const previousItems = queryClient.getQueryData(date === null ? ['suppliers'] : ['suppliers', date]);

      const item: Omit<Supplier, 'status' | 'createdAt'> & {
        isOptimistic?: boolean;
      } = {
        id: Date.now(),
        name: name,
        type: type,
        document: document,
        address: address || null,
        phone: phone || null,
        email: email || null,
        isOptimistic: true,
      };

      queryClient.setQueryData(date === null ? ['suppliers'] : ['suppliers', date], (oldItems: (Supplier & { isOptimistic?: boolean })[]) => {
        return [item, ...oldItems];
      });

      toast.success('Proveedor creado correctamente');
      setOpen(false);

      return { previousItems };
    },
    onError: (error, _variables, context) => {
      toast.error(error.message);
      queryClient.setQueryData(date === null ? ['suppliers'] : ['suppliers', date], context?.previousItems);
    },
    onSuccess: (newItem) => {
      queryClient.setQueryData(date === null ? ['suppliers'] : ['suppliers', date], (oldItems: (Supplier & { isOptimistic?: boolean })[]) => {
        return oldItems.map((item) => (item.isOptimistic ? newItem : item));
      });
    },
  });

  const onSubmit = (formData: SupplierForm) => {
    mutate({ formData });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-2">
        <FormFields form={form} />
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
