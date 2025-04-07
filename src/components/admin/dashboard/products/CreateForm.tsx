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
import { MeasurementUnit } from '@/schemas/measurementUnits';

interface CreateFormProps {
  categories: Category[];
  brands: Brand[];
  measurementUnits: MeasurementUnit[];
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CreateForm({ categories, brands, measurementUnits, setOpen }: CreateFormProps) {
  const form = useForm<ProductForm>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: '',
      salePrice: 0,
      ecommerceSalePrice: 0,
      categoryId: 0,
      measurementUnitId: 0,
      measurementQuantity: 0,
      brandId: 0,
      newImages: [],
      images: [],
      description: '',
      barCode: '',
      sku: '',
      showInEcommerce: true,
      ecommercePercentageDiscount: 0,
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

      const {
        name,
        salePrice,
        categoryId,
        brandId,
        measurementUnitId,
        measurementQuantity,
        newImages,
        barCode,
        description,
        showInEcommerce,
        sku,
        ecommercePercentageDiscount,
        ecommerceSalePrice,
      } = formData;

      const item: Omit<Product, 'createdAt'> & {
        isOptimistic?: boolean;
      } = {
        id: Date.now(),
        name: name,
        salePrice: salePrice,
        ecommerceSalePrice: ecommerceSalePrice || null,
        stock: 0,
        categoryId: categoryId || null,
        brandId: brandId || null,
        images: newImages.length > 0 ? [{ id: Date.now(), path: URL.createObjectURL(newImages[0]) }] : [],
        barCode: barCode || null,
        description: description || null,
        measurementUnitId: measurementUnitId || null,
        sku: sku || null,
        measurementQuantity: measurementQuantity || null,
        ecommercePercentageDiscount: ecommercePercentageDiscount || null,
        showInEcommerce: showInEcommerce,
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
