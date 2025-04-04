import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BrandForm } from '@/schemas/brands';
import { UseFormReturn } from 'react-hook-form';

interface FormFieldsProps {
  form: UseFormReturn<BrandForm>;
}

export default function FormFields({ form }: FormFieldsProps) {
  return (
    <div>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input placeholder="Anita" type="text" autoComplete="on" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
