import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { PurchaseForm, VoucherDetailForm, VoucherDetailFormSchema } from '@/schemas/purchases';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { Product } from '@/schemas/products';
import FormFields from '@/components/admin/dashboard/purchases/details/FormFields';

interface CreateFormProps {
  purchaseForm: UseFormReturn<PurchaseForm>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  products: Product[];
}

export default function CreateForm({ purchaseForm, setOpen, products }: CreateFormProps) {
  const form = useForm<VoucherDetailForm>({
    resolver: zodResolver(VoucherDetailFormSchema),
    defaultValues: {
      id: Date.now(),
      productId: 0,
      productName: '',
      quantity: 0,
      unitPrice: 0,
      created: true,
    },
  });

  const onSubmit = (formData: VoucherDetailForm) => {
    const oldDetails = purchaseForm.getValues('voucherDetails');
    purchaseForm.setValue('voucherDetails', [
      {
        id: formData.id,
        product: { name: formData.productName },
        productId: formData.productId,
        unitPrice: formData.unitPrice,
        quantity: formData.quantity,
        created: formData.created,
      },
      ...oldDetails,
    ]);
    setOpen(false);
  };

  return (
    <Form {...form}>
      <form className="flex flex-col p-2">
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
