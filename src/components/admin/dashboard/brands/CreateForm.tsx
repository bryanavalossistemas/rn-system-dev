import { create } from '@/api/brands';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CreateBrandForm as CreateBrandFormType, CreateBrandFormSchema, Brand } from '@/schemas/brands';
import useStore from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface CreateFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CreateForm({ setOpen }: CreateFormProps) {
  const form = useForm<CreateBrandFormType>({
    resolver: zodResolver(CreateBrandFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const queryClient = useQueryClient();

  const { dateOptionBrands: dateOption } = useStore();

  const { mutate, isPending } = useMutation({
    mutationFn: create,
    onMutate: async ({ formData }) => {
      await queryClient.cancelQueries({ queryKey: ['brands', dateOption] });

      const previousItems = queryClient.getQueryData(['brands', dateOption]);

      const item = {
        id: Date.now(),
        ...formData,
        isOptimistic: true,
      };

      queryClient.setQueryData(['brands', dateOption], (oldItems: Brand[]) => {
        return [item, ...oldItems];
      });

      toast.success('Marca creada correctamente');
      setOpen(false);

      return { previousItems };
    },
    onError: (_error, _variables, context) => {
      toast.error('Parece que hubo un error al crear la marca');
      queryClient.setQueryData(['brands', dateOption], context?.previousItems);
    },
    onSuccess: (newItem) => {
      queryClient.setQueryData(['brands', dateOption], (oldItems: Brand & { isOptimistic?: boolean }[]) => {
        return oldItems.map((item) => (item.isOptimistic ? newItem : item));
      });
    },
  });

  const onSubmit = (formData: CreateBrandFormType) => {
    mutate({ formData });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-2 sm:p-0">
        <div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Anita" type="text" autoComplete="on" autoFocus {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
