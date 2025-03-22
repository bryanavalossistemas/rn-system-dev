import { update } from '@/api/brands';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Brand, UpdateBrandFormSchema, UpdateBrandForm as UpdateBrandFormType } from '@/schemas/brands';
import useStore from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface UpdateFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  item: Brand;
}

export default function UpdateForm({ setOpen, item }: UpdateFormProps) {
  const { id, name } = item;

  const form = useForm<UpdateBrandFormType>({
    resolver: zodResolver(UpdateBrandFormSchema),
    defaultValues: { name },
  });

  const queryClient = useQueryClient();

  const { dateOptionBrands: dateOption } = useStore();

  const { mutate, isPending } = useMutation({
    mutationFn: update,
    onMutate: async ({ id, formData }) => {
      await queryClient.cancelQueries({ queryKey: ['brands', dateOption] });

      const previousItems = queryClient.getQueryData(['brands', dateOption]);

      queryClient.setQueryData(['brands', dateOption], (oldItems: Brand[]) =>
        oldItems.map((item) => (item.id === id ? { ...item, ...formData, isOptimistic: true } : item)),
      );

      setOpen(false);
      toast.success('Marca actualizada correctamente');

      return { previousItems };
    },
    onError: (_error, _variables, context) => {
      toast.error('Parece que hubo un error al actualizar la marca');
      queryClient.setQueryData(['brands', dateOption], context?.previousItems);
    },
    onSuccess: (newItem) => {
      queryClient.setQueryData(['brands', dateOption], (oldItems: Brand & { isOptimistic?: boolean }[]) => {
        return oldItems.map((item) => (item.isOptimistic ? newItem : item));
      });
    },
  });

  const onSubmit = (formData: UpdateBrandFormType) => {
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
                  <Input placeholder="Anita" type="text" autoComplete="on" {...field} ref={inputRef} />
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
