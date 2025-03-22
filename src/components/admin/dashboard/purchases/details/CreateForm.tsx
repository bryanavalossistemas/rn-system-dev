import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { DetailForm, DetailFormSchema, PurchaseForm } from '@/schemas/purchases';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { Product } from '@/schemas/products';
import FormFields from './FormFields';

interface CreateFormProps {
  purchaseForm: UseFormReturn<PurchaseForm>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  products: Product[];
}

export default function CreateForm({ purchaseForm, setOpen, products }: CreateFormProps) {
  const form = useForm<DetailForm>({
    resolver: zodResolver(DetailFormSchema),
    defaultValues: {
      productId: '',
      productName: '',
      quantity: '',
      unitPrice: '',
    },
  });

  const onSubmit = (formData: DetailForm) => {
    const details = purchaseForm.getValues('documentDetails');
    details.push({
      key: Date.now(),
      productId: formData.productId,
      productName: formData.productName,
      quantity: formData.quantity,
      unitPrice: formData.unitPrice,
    });
    purchaseForm.setValue('documentDetails', details);
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
