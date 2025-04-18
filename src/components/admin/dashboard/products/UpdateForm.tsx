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
import { MeasurementUnit } from '@/schemas/measurementUnits';

interface UpdateFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  item: Product;
  categories: Category[];
  brands: Brand[];
  measurementUnits: MeasurementUnit[];
}

export default function UpdateForm({ setOpen, item, categories, brands, measurementUnits }: UpdateFormProps) {
  const {
    id,
    name,
    salePrice,
    stock,
    categoryId,
    brandId,
    images,
    barCode,
    description,
    ecommercePercentageDiscount,
    ecommerceSalePrice,
    measurementQuantity,
    measurementUnitId,
    showInEcommerce,
    sku,
  } = item;

  const form = useForm<ProductForm>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: name,
      salePrice: salePrice,
      ecommerceSalePrice: ecommerceSalePrice || 0,
      categoryId: categoryId || 0,
      measurementUnitId: measurementUnitId || 0,
      brandId: brandId || 0,
      images: images || [],
      newImages: [],
      barCode: barCode || '',
      description: description || '',
      sku: sku || '',
      showInEcommerce: showInEcommerce,
      measurementQuantity: measurementQuantity || 0,
      ecommercePercentageDiscount: ecommercePercentageDiscount || 0,
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
        categoryId,
        brandId,
        newImages,
        images,
        barCode,
        description,
        ecommercePercentageDiscount,
        ecommerceSalePrice,
        measurementQuantity,
        measurementUnitId,
        showInEcommerce,
        sku,
      } = formData;
      const noDeletedProductImages = images.filter((p) => !p.deleted);
      const updatedItem: Omit<Product, 'createdAt'> & {
        isOptimistic?: boolean;
      } = {
        id: id,
        name: name,
        salePrice: salePrice,
        stock: stock,
        categoryId: categoryId || null,
        brandId: brandId || null,
        measurementUnitId: measurementUnitId || null,
        measurementQuantity: measurementQuantity || null,
        barCode: barCode || null,
        description: description || null,
        ecommercePercentageDiscount: ecommercePercentageDiscount || null,
        ecommerceSalePrice: ecommerceSalePrice || null,
        showInEcommerce: showInEcommerce,
        sku: sku || null,
        images:
          noDeletedProductImages.length > 0
            ? noDeletedProductImages
            : newImages.length > 0
              ? [
                  {
                    id: Date.now(),
                    path: URL.createObjectURL(newImages[0]),
                  },
                ]
              : [],
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col overflow-auto">
        <FormFields form={form} categories={categories} brands={brands} measurementUnits={measurementUnits} />
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
