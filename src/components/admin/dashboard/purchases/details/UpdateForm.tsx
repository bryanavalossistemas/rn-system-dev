import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { Product } from '@/schemas/products';
import FormFields from '@/components/admin/dashboard/purchases/details/FormFields';
import { PurchaseDetailForm, PurchaseDetailFormSchema, PurchaseForm } from '@/schemas/purchases';

interface UpdateFormProps {
  purchaseForm: UseFormReturn<PurchaseForm>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  products: Product[];
  item: PurchaseDetailForm;
}

export default function UpdateForm({ purchaseForm, setOpen, products, item }: UpdateFormProps) {
  const { id, productName, quantity, unitPrice, created, productId } = item;
  const form = useForm<PurchaseDetailForm>({
    resolver: zodResolver(PurchaseDetailFormSchema),
    defaultValues: {
      id: id,
      productId: productId,
      productName: productName,
      quantity: quantity,
      unitPrice: unitPrice,
      created: created,
    },
  });

  const onSubmit = (formData: PurchaseDetailForm) => {
    const details = purchaseForm.getValues('purchaseDetails');
    const newDetails = details.map((d) =>
      d.id === id
        ? {
            id: formData.id,
            productId: d.productId,
            productName: formData.productName,
            quantity: formData.quantity,
            unitPrice: formData.unitPrice,
            created: formData.created,
          }
        : d,
    );
    purchaseForm.setValue('purchaseDetails', newDetails);
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
