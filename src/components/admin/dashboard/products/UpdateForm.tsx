import { update } from '@/api/products';
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

interface UpdateFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  item: Product;
  categories: Category[];
  brands: Brand[];
}

export default function UpdateForm({ setOpen, item, categories, brands }: UpdateFormProps) {
  const { id, name, salePrice, costPrice, stock, categoryId, brandId, images: oldImages } = item;

  const form = useForm<ProductForm>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: name,
      salePrice: salePrice,
      costPrice: costPrice,
      stock: stock,
      categoryId: categoryId ?? undefined,
      brandId: brandId ?? undefined,
      oldImages,
    },
  });

  const queryClient = useQueryClient();

  const { dateOptionProducts: dateOption } = useStore();

  const { mutate, isPending } = useMutation({
    mutationFn: update,
    onMutate: async ({ id, formData }) => {
      await queryClient.cancelQueries({ queryKey: ['products', dateOption] });

      const previousItems = queryClient.getQueryData(['products', dateOption]);

      const { name, salePrice, costPrice, stock, categoryId, brandId, images, oldImages } = formData;
      const noDeletedProductImages = oldImages ? oldImages.filter((p) => p.deleted === undefined) : [];
      const newImages = images ? images : [];
      const updatedItem: Omit<Product, 'active' | 'createdAt'> & {
        isOptimistic?: boolean;
      } = {
        id: id,
        name: name,
        salePrice: salePrice,
        costPrice: costPrice,
        stock: stock,
        categoryId: categoryId ?? null,
        brandId: brandId ?? null,
        // images:
        //   noDeletedProductImages.length > 0
        //     ? noDeletedProductImages
        //     : images && images.length > 0
        //       ? [
        //           {
        //             id: Date.now(),
        //             path: URL.createObjectURL(images[0]),
        //           },
        //         ]
        //       : [],
        images:
          newImages.length > 0
            ? [
                {
                  id: Date.now(),
                  path: URL.createObjectURL(newImages[0]),
                },
              ]
            : noDeletedProductImages.length > 0
              ? noDeletedProductImages
              : [],
        isOptimistic: true,
      };

      queryClient.setQueryData(['products', dateOption], (oldItems: Product[]) => oldItems.map((item) => (item.id === id ? updatedItem : item)));

      setOpen(false);
      toast.success('Producto actualizado correctamente');

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
    mutate({ id, formData });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-2 h-96 overflow-scroll sm:h-fit sm:max-h-[750px] sm:overflow-auto">
        <FormFields form={form} categories={categories} brands={brands} oldImages={oldImages} />
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
