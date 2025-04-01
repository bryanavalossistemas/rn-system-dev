import { create } from '@/api/products';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Brand } from '@/schemas/brands';
import { Category } from '@/schemas/categories';
import { Product, ProductForm, ProductFormSchema } from '@/schemas/products';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import FormFields from '@/components/admin/dashboard/products/FormFields';
import { useSearchParams } from 'react-router';

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
      categoryId: 0,
      brandId: 0,
      newImages: [],
      images: [],
    },
  });

  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: create,
    onMutate: async ({ formData }) => {
      await queryClient.cancelQueries({ queryKey: date === null ? ['products'] : ['products', date] });

      const previousItems = queryClient.getQueryData(date === null ? ['products'] : ['products', date]);

      const { name, salePrice, costPrice, stock, categoryId, brandId, newImages } = formData;

      const item: Omit<Product, 'createdAt'> & {
        isOptimistic?: boolean;
      } = {
        id: Date.now(),
        name: name,
        salePrice: salePrice,
        costPrice: costPrice,
        stock: stock,
        categoryId: categoryId ?? null,
        brandId: brandId ?? null,
        images: newImages.length > 0 ? [{ id: Date.now(), path: URL.createObjectURL(newImages[newImages.length - 1]) }] : [],
        isOptimistic: true,
      };

      queryClient.setQueryData(date === null ? ['products'] : ['products', date], (oldItems: (Product & { isOptimistic?: boolean })[]) => {
        return [item, ...oldItems];
      });

      toast.success('Producto creado correctamente');
      setOpen(false);

      return { previousItems };
    },
    onError: (error, _variables, context) => {
      toast.error(error.message);
      queryClient.setQueryData(date === null ? ['products'] : ['products', date], context?.previousItems);
    },
    onSuccess: (newItem) => {
      queryClient.setQueryData(date === null ? ['products'] : ['products', date], (oldItems: (Product & { isOptimistic?: boolean })[]) => {
        return oldItems.map((item) => (item.isOptimistic ? newItem : item));
      });
    },
  });

  const onSubmit = (formData: ProductForm) => {
    mutate({ formData });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-2">
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
