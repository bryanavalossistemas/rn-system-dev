import { update } from '@/api/brands';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Brand, BrandForm, BrandFormSchema } from '@/schemas/brands';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router';
import { toast } from 'sonner';
import FormFields from '@/components/admin/dashboard/brands/FormFields';

interface UpdateFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  item: Brand;
}

export default function UpdateForm({ setOpen, item }: UpdateFormProps) {
  const { id, name } = item;

  const form = useForm<BrandForm>({
    resolver: zodResolver(BrandFormSchema),
    defaultValues: { name: name },
  });

  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: update,
    onMutate: async ({ id, formData }) => {
      await queryClient.cancelQueries({ queryKey: date === null ? ['brands'] : ['brands', date] });

      const previousItems = queryClient.getQueryData(date === null ? ['brands'] : ['brands', date]);

      const { name } = formData;
      const updatedItem: Omit<Brand, 'createdAt'> & { isOptimistic: boolean } = {
        id: id,
        name: name,
        isOptimistic: true,
      };

      queryClient.setQueryData(date === null ? ['brands'] : ['brands', date], (oldItems: (Brand & { isOptimistic?: boolean })[]) =>
        oldItems.map((item) => (item.id === id ? updatedItem : item)),
      );

      setOpen(false);
      toast.success('Marca actualizada correctamente');

      return { previousItems };
    },
    onError: (error, _variables, context) => {
      toast.error(error.message);
      queryClient.setQueryData(date === null ? ['brands'] : ['brands', date], context?.previousItems);
    },
    onSuccess: (newItem) => {
      queryClient.setQueryData(date === null ? ['brands'] : ['brands', date], (oldItems: (Brand & { isOptimistic?: boolean })[]) => {
        return oldItems.map((item) => (item.isOptimistic ? newItem : item));
      });
    },
  });

  const onSubmit = (formData: BrandForm) => {
    mutate({ id, formData });
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
