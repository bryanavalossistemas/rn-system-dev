import { create } from '@/api/products';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Brand } from '@/schemas/brands';
import { Category } from '@/schemas/categories';
import { Product, ProductForm, ProductFormSchema } from '@/schemas/products';
import useStore from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import FormFields from './FormFields';

interface CreateFormProps {
  categories: Category[];
  brands: Brand[];
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CreateForm({ categories, brands, setOpen }: CreateFormProps) {
  const form = useForm<ProductForm>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: '',
      salePrice: 0,
      costPrice: 0,
      stock: 0,
    },
  });

  const queryClient = useQueryClient();

  const { dateOptionProducts: dateOption } = useStore();

  const { mutate, isPending } = useMutation({
    mutationFn: create,
    onMutate: async ({ formData }) => {
      await queryClient.cancelQueries({ queryKey: ['products', dateOption] });

      const previousItems = queryClient.getQueryData(['products', dateOption]);

      const { name, salePrice, costPrice, stock, categoryId, brandId, images } = formData;

      const item: Omit<Product, 'active' | 'createdAt'> & {
        isOptimistic?: boolean;
      } = {
        id: Date.now(),
        name: name,
        salePrice: salePrice,
        costPrice: costPrice,
        stock: stock,
        categoryId: categoryId ?? null,
        brandId: brandId ?? null,
        images: images && [{ id: Date.now(), path: URL.createObjectURL(images[images.length - 1]) }],
        isOptimistic: true,
      };

      queryClient.setQueryData(['products', dateOption], (oldItems: Product[]) => {
        return [item, ...oldItems];
      });

      toast.success('Producto creado correctamente');
      setOpen(false);

      return { previousItems };
    },
    onError: (error, _variables, context) => {
      toast.error(error.message);
      queryClient.setQueryData(['products', dateOption], context?.previousItems);
    },
    onSuccess: (newItem) => {
      queryClient.setQueryData(['products', dateOption], (oldItems: Product & { isOptimistic?: boolean }[]) => {
        return oldItems.map((item) => (item.isOptimistic ? newItem : item));
      });
    },
  });

  const onSubmit = (formData: ProductForm) => {
    mutate({ formData });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-2 h-96 overflow-scroll sm:h-fit sm:max-h-[750px] sm:overflow-auto">
        <FormFields form={form} categories={categories} brands={brands} />
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
