import { update } from '@/api/customers';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Customer, CustomerForm, CustomerFormSchema } from '@/schemas/customers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import FormFields from '@/components/admin/dashboard/customers/FormFields';
import { useSearchParams } from 'react-router';

interface UpdateFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  item: Customer;
}

export default function UpdateForm({ setOpen, item }: UpdateFormProps) {
  const { id, name, type, document, address, phone, email } = item;

  const form = useForm<CustomerForm>({
    resolver: zodResolver(CustomerFormSchema),
    defaultValues: {
      name: name,
      type: type,
      document: document,
      address: address ?? '',
      phone: phone ?? '',
      email: email ?? '',
    },
  });

  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: update,
    onMutate: async ({ id, formData }) => {
      await queryClient.cancelQueries({ queryKey: date === null ? ['customers'] : ['customers', date] });

      const previousItems = queryClient.getQueryData(date === null ? ['customers'] : ['customers', date]);

      const { name, type, document, address, phone, email } = formData;

      const updatedItem: Omit<Customer, 'createdAt'> & {
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

      queryClient.setQueryData(date === null ? ['customers'] : ['customers', date], (oldItems: (Customer & { isOptimistic?: boolean })[]) =>
        oldItems.map((item) => (item.id === id ? updatedItem : item)),
      );

      setOpen(false);
      toast.success('Cliente actualizado correctamente');

      return { previousItems };
    },
    onError: (error, _variables, context) => {
      toast.error(error.message);
      queryClient.setQueryData(date === null ? ['customers'] : ['customers', date], context?.previousItems);
    },
    onSuccess: (newItem) => {
      queryClient.setQueryData(date === null ? ['customers'] : ['customers', date], (oldItems: (Customer & { isOptimistic?: boolean })[]) => {
        return oldItems.map((item) => (item.isOptimistic ? newItem : item));
      });
    },
  });

  const onSubmit = (formData: CustomerForm) => {
    mutate({ id, formData });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-2 h-96 overflow-auto sm:h-auto">
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
