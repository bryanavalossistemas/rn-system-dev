import { update } from '@/api/categories';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Category, UpdateCategoryFormSchema, UpdateCategoryForm as UpdateCategoryFormType } from '@/schemas/categories';
import useStore from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface UpdateFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  category: Category;
}

export default function UpdateForm({ setOpen, category }: UpdateFormProps) {
  const { id, name } = category;

  const form = useForm<UpdateCategoryFormType>({
    resolver: zodResolver(UpdateCategoryFormSchema),
    defaultValues: { name },
  });

  const queryClient = useQueryClient();

  const { dateOptionCategories: dateOption } = useStore();

  const { mutate, isPending } = useMutation({
    mutationFn: update,
    onMutate: async ({ id, formData }) => {
      await queryClient.cancelQueries({ queryKey: ['categories', dateOption] });

      const previousCategories = queryClient.getQueryData(['categories', dateOption]);

      queryClient.setQueryData(['categories', dateOption], (oldData: Category[]) =>
        oldData.map((category) => (category.id === id ? { ...category, ...formData, isOptimistic: true } : category)),
      );

      setOpen(false);
      toast.success('Categoría actualizada correctamente');

      return { previousCategories };
    },
    onError: (_error, _variables, context) => {
      toast.error('Parece que hubo un error al actualizar la categoría');
      queryClient.setQueryData(['categories', dateOption], context?.previousCategories);
    },
    onSuccess: (newCategory) => {
      queryClient.setQueryData(['categories', dateOption], (oldCategories: Category & { isOptimistic?: boolean }[]) => {
        return oldCategories.map((category) => (category.isOptimistic ? newCategory : category));
      });
    },
  });

  const onSubmit = (formData: UpdateCategoryFormType) => {
    mutate({ id, formData });
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  }, []);

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
                  <Input placeholder="Harinas" type="text" autoComplete="on" {...field} ref={inputRef} />
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
