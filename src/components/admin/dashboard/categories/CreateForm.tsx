import { create } from '@/api/categories';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CreateCategoryForm as CreateCategoryFormType, CreateCategoryFormSchema, Category } from '@/schemas/categories';
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
  const form = useForm<CreateCategoryFormType>({
    resolver: zodResolver(CreateCategoryFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const queryClient = useQueryClient();

  const { dateOptionCategories: dateOption } = useStore();

  const { mutate, isPending } = useMutation({
    mutationFn: create,
    onMutate: async ({ formData }) => {
      await queryClient.cancelQueries({ queryKey: ['categories', dateOption] });

      const previousCategories = queryClient.getQueryData(['categories', dateOption]);

      const category = {
        id: Date.now(),
        ...formData,
        isOptimistic: true,
      };

      queryClient.setQueryData(['categories', dateOption], (oldCategories: Category[]) => {
        return [category, ...oldCategories];
      });

      toast.success('Categoría creada correctamente');
      setOpen(false);

      return { previousCategories };
    },
    onError: (_error, _variables, context) => {
      toast.error('Parece que hubo un error al crear la categoría');
      queryClient.setQueryData(['categories', dateOption], context?.previousCategories);
    },
    onSuccess: (newCategory) => {
      queryClient.setQueryData(['categories', dateOption], (oldCategories: Category & { isOptimistic?: boolean }[]) => {
        return oldCategories.map((category) => (category.isOptimistic ? newCategory : category));
      });
    },
  });

  const onSubmit = (formData: CreateCategoryFormType) => {
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
                  <Input placeholder="Harinas" type="text" autoComplete="on" autoFocus {...field} />
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
