import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { Product } from '@/schemas/products';
import FormFields from '@/components/admin/dashboard/purchases/details/FormFields';
import { PurchaseForm, VoucherDetail, VoucherDetailForm, VoucherDetailFormSchema } from '@/schemas/purchases';

interface UpdateFormProps {
  purchaseForm: UseFormReturn<PurchaseForm>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  products: Product[];
  item: VoucherDetail;
}

export default function UpdateForm({ purchaseForm, setOpen, products, item }: UpdateFormProps) {
  const { id, product, quantity, unitPrice, created, productId } = item;
  const form = useForm<VoucherDetailForm>({
    resolver: zodResolver(VoucherDetailFormSchema),
    defaultValues: {
      id: id,
      productId: productId,
      productName: product.name,
      quantity: quantity,
      unitPrice: unitPrice,
      created: created,
    },
  });

  const onSubmit = (formData: VoucherDetailForm) => {
    const details = purchaseForm.getValues('voucherDetails');
    const newDetails = details.map((d) =>
      d.id === id
        ? {
            id: formData.id,
            productId: formData.productId,
            product: { name: formData.productName },
            quantity: formData.quantity,
            unitPrice: formData.unitPrice,
            created: formData.created,
          }
        : d,
    );
    purchaseForm.setValue('voucherDetails', newDetails);
    setOpen(false);
  };

  return (
    <Form {...form}>
      <form className="grid-rows-1 p-2">
        <FormFields form={form} products={products} />
        <div className="flex flex-col sm:flex-row-reverse gap-2 mt-2 sm:mt-4">
          <Button type="button" onClick={form.handleSubmit(onSubmit)}>
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
