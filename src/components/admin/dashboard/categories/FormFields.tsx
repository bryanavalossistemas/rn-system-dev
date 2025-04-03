import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { CategoryForm } from '@/schemas/categories';
import { useEffect, useRef } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';

interface FormFieldsProps {
  form: UseFormReturn<CategoryForm>;
}

export default function FormFields({ form }: FormFieldsProps) {
  const newImage = useWatch({ control: form.control, name: 'newImage' });
  const oldImage = useWatch({ control: form.control, name: 'oldImage' });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      if (files.length) {
        for (const file of files) {
          form.setValue('oldImage', null);
          form.setValue('newImage', file);
        }
      } else {
        form.setValue('newImage', null);
      }
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  }, []);

  return (
    <div className="grid gap-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input placeholder="Harinas" type="text" autoComplete="on" autoFocus {...field} ref={inputRef} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid gap-2">
        <FormField
          control={form.control}
          name="newImage"
          render={() => (
            <FormItem>
              <FormLabel>Imagen</FormLabel>
              <FormControl>
                <Input placeholder="imagenes" type="file" accept="newImage/*" multiple={false} onChange={handleImageChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {oldImage && (
          <>
            <div className="flex justify-center">
              <div className="grid">
                <img src={`${import.meta.env.VITE_API_URL}/${oldImage}`} alt={`${oldImage}`} className="w-28 h-28 object-cover rounded-t-sm" />
                <Button type="button" onClick={() => form.setValue('oldImage', null)} className="rounded-t-none">
                  Eliminar
                </Button>
              </div>
            </div>
            <Separator />
          </>
        )}

        {newImage && (
          <div className="flex justify-center">
            <img src={URL.createObjectURL(newImage)} alt={`${newImage}`} className="w-28 h-28 object-cover rounded-t-sm" />
          </div>
        )}
      </div>
    </div>
  );
}
