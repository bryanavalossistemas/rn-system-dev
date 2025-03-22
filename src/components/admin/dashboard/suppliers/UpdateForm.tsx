import { update } from '@/api/suppliers';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Supplier, SupplierForm, SupplierFormSchema } from '@/schemas/suppliers';
import useStore from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import FormFields from './FormFields';

interface UpdateFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  item: Supplier;
}

export default function UpdateForm({ setOpen, item }: UpdateFormProps) {
  const { id, name, type, document, address, phone, email } = item;

  const form = useForm<SupplierForm>({
    resolver: zodResolver(SupplierFormSchema),
    defaultValues: {
      name: name,
      type: type,
      document: document,
      address: address ?? '',
      phone: phone ?? '',
      email: email ?? '',
    },
  });

  const queryClient = useQueryClient();

  const { dateOptionSuppliers: dateOption } = useStore();

  const { mutate, isPending } = useMutation({
    mutationFn: update,
    onMutate: async ({ id, formData }) => {
      await queryClient.cancelQueries({ queryKey: ['suppliers', dateOption] });

      const previousItems = queryClient.getQueryData(['suppliers', dateOption]);

      const { name, type, document, address, phone, email } = formData;

      const updatedItem: Omit<Supplier, 'status' | 'createdAt'> & {
        isOptimistic?: boolean;
      } = {
        id: id,
        name: name,
        type: type,
        document: document,
        address: address || null,
        phone: phone || null,
        email: email || null,
        isOptimistic: true,
      };

      queryClient.setQueryData(['suppliers', dateOption], (oldItems: Supplier[]) => oldItems.map((item) => (item.id === id ? updatedItem : item)));

      setOpen(false);
      toast.success('Proveedor actualizado correctamente');

      return { previousItems };
    },
    onError: (error, _variables, context) => {
      toast.error(error.message);
      queryClient.setQueryData(['suppliers', dateOption], context?.previousItems);
    },
    onSuccess: (newItem) => {
      queryClient.setQueryData(['suppliers', dateOption], (oldItems: Supplier & { isOptimistic?: boolean }[]) => {
        return oldItems.map((item) => (item.isOptimistic ? newItem : item));
      });
    },
  });

  const onSubmit = (formData: SupplierForm) => {
    mutate({ id, formData });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-2 h-96 overflow-scroll sm:h-fit sm:max-h-[750px] sm:overflow-auto">
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
