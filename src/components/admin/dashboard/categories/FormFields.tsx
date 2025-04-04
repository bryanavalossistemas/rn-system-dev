import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { CategoryForm } from '@/schemas/categories';
import { UseFormReturn, useWatch } from 'react-hook-form';

interface FormFieldsProps {
  form: UseFormReturn<CategoryForm>;
}

export default function FormFields({ form }: FormFieldsProps) {
  const newImage = useWatch({ control: form.control, name: 'newImage' });
  const image = useWatch({ control: form.control, name: 'image' });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      if (files.length) {
        for (const file of files) {
          form.setValue('newImage', file);
        }
        // Delete oldImage if exists
        if (image) {
          form.setValue('image', null);
        }
      } else {
        form.setValue('newImage', null);
      }
    }
  };

  return (
    <div className="grid gap-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input placeholder="Harinas" type="text" autoComplete="on" {...field} />
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
        {image && (
          <>
            <div className="flex justify-center">
              <div className="grid">
                <img src={`${import.meta.env.VITE_API_URL}/uploads/${image}`} alt={`${image}`} className="w-28 h-28 object-cover rounded-t-sm" />
                <Button type="button" onClick={() => form.setValue('image', null)} className="rounded-t-none">
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
