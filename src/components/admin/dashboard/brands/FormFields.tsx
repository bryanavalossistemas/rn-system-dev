import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BrandForm } from '@/schemas/brands';
import { useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface FormFieldsProps {
  form: UseFormReturn<BrandForm>;
}

export default function FormFields({ form }: FormFieldsProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  }, []);

  return (
    <div>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input placeholder="Anita" type="text" autoComplete="on" autoFocus {...field} ref={inputRef} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
