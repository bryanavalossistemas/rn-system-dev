import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { DetailForm, DetailFormSchema, PurchaseForm } from '@/schemas/purchases';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { Product } from '@/schemas/products';
import FormFields from './FormFields';

interface UpdateFormProps {
  purchaseForm: UseFormReturn<PurchaseForm>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  products: Product[];
  item: DetailForm;
}

export default function UpdateForm({ purchaseForm, setOpen, products, item }: UpdateFormProps) {
  const { id, productId, productName, quantity, unitPrice } = item;
  const form = useForm<DetailForm>({
    resolver: zodResolver(DetailFormSchema),
    defaultValues: {
      id: id,
      productId: productId,
      productName: productName,
      quantity: quantity,
      unitPrice: unitPrice,
    },
  });

  const onSubmit = (formData: DetailForm) => {
    const details = purchaseForm.getValues('documentDetails');
    const newDetails = details.map((d) => (d.id === id ? formData : d));
    purchaseForm.setValue('documentDetails', newDetails);
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
