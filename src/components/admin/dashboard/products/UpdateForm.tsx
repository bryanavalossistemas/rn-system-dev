import { update } from '@/api/products';
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

interface UpdateFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  item: Product;
  categories: Category[];
  brands: Brand[];
}

export default function UpdateForm({ setOpen, item, categories, brands }: UpdateFormProps) {
  const {
    id,
    name,
    salePrice,
    costPrice,
    stock,
    categoryId,
    brandId,
    images,
    barCode,
    description,
    ecommercePercentageDiscount,
    ecommerceSalePrice,
    measurementQuantity,
    measurementUnit,
    showInEcommerce,
    sku,
  } = item;

  const form = useForm<ProductForm>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: name,
      salePrice: salePrice,
      ecommerceSalePrice: ecommerceSalePrice,
      costPrice: costPrice,
      stock: stock,
      categoryId: categoryId || 0,
      brandId: brandId || 0,
      images: images,
      newImages: [],
      barCode: barCode || '',
      description: description || '',
      sku: sku || '',
      measurementUnit: measurementUnit || '',
      ecommercePercentageDiscount: ecommercePercentageDiscount,
      measurementQuantity: measurementQuantity,
      showInEcommerce: showInEcommerce,
    },
  });

  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: update,
    onMutate: async ({ id, formData }) => {
      await queryClient.cancelQueries({ queryKey: date === null ? ['products'] : ['products', date] });

      const previousItems = queryClient.getQueryData(date === null ? ['products'] : ['products', date]);

      const {
        name,
        salePrice,
        costPrice,
        stock,
        categoryId,
        brandId,
        newImages,
        images,
        barCode,
        description,
        ecommercePercentageDiscount,
        ecommerceSalePrice,
        measurementQuantity,
        measurementUnit,
        showInEcommerce,
        sku,
      } = formData;
      const noDeletedProductImages = images.length > 0 ? images.filter((p) => p.deleted === undefined) : [];
      const updatedItem: Omit<Product, 'createdAt'> & {
        isOptimistic?: boolean;
      } = {
        id: id,
        name: name,
        salePrice: salePrice,
        costPrice: costPrice,
        stock: stock,
        categoryId: categoryId ?? null,
        brandId: brandId ?? null,
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
        barCode: barCode,
        description: description,
        ecommercePercentageDiscount: ecommercePercentageDiscount,
        ecommerceSalePrice: ecommerceSalePrice,
        measurementQuantity: measurementQuantity,
        measurementUnit: measurementUnit,
        showInEcommerce: showInEcommerce,
        sku: sku,
        isOptimistic: true,
      };

      queryClient.setQueryData(date === null ? ['products'] : ['products', date], (oldItems: (Product & { isOptimistic?: boolean })[]) =>
        oldItems.map((item) => (item.id === id ? updatedItem : item)),
      );

      setOpen(false);
      toast.success('Producto actualizado correctamente');

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
    mutate({ id, formData });
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
