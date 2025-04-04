import { create } from '@/api/customers';
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

interface CreateFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CreateForm({ setOpen }: CreateFormProps) {
  const form = useForm<CustomerForm>({
    resolver: zodResolver(CustomerFormSchema),
    defaultValues: {
      name: '',
      documentType: 'RUC',
      documentNumber: '',
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
      const { name, documentType, documentNumber, address, phone, email } = formData;
      await queryClient.cancelQueries({ queryKey: date === null ? ['customers'] : ['customers', date] });

      const previousItems = queryClient.getQueryData(date === null ? ['customers'] : ['customers', date]);

      const item: Omit<Customer, 'createdAt'> & {
        isOptimistic?: boolean;
      } = {
        id: Date.now(),
        name: name,
        documentType: documentType,
        documentNumber: documentNumber,
        address: address,
        phone: phone,
        email: email,
        isOptimistic: true,
      };

      queryClient.setQueryData(date === null ? ['customers'] : ['customers', date], (oldItems: (Customer & { isOptimistic?: boolean })[]) => {
        return [item, ...oldItems];
      });

      toast.success('Cliente creado correctamente');
      setOpen(false);

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
    mutate({ formData });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col overflow-auto">
        <FormFields form={form} />
        <div className="p-2 flex flex-col sm:flex-row-reverse gap-2 mt-2 sm:mt-4">
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
