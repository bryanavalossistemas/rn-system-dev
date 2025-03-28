import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CustomerForm } from '@/schemas/customers';
import { useEffect, useRef } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';

interface FormFieldsProps {
  form: UseFormReturn<CustomerForm>;
}

export default function FormFields({ form }: FormFieldsProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  }, []);

  const currentType = useWatch({ control: form.control, name: 'type' });

  return (
    <div className="grid gap-6">
      {/* NOMBRE */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input
                placeholder={currentType === 'RUC' ? 'Representaciones Nataly S.A.C' : 'Alicia Loa y Pardo Menacho'}
                type="text"
                autoComplete="on"
                autoFocus
                {...field}
                ref={inputRef}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* TIPO */}
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>RUC | DNI</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} name="type">
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="RUC">RUC</SelectItem>
                <SelectItem value="DNI">DNI</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* DOCUMENTO */}
      <FormField
        control={form.control}
        name="document"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número de {currentType}</FormLabel>
            <FormControl>
              <Input placeholder={currentType === 'RUC' ? '20600007522' : '75013015'} type="number" autoComplete="on" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* ADDRESS */}
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dirección</FormLabel>
            <FormControl>
              <Input placeholder="Av. Aviacion 671" type="text" autoComplete="on" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* TELEFONO */}
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Teléfono</FormLabel>
            <FormControl>
              <Input placeholder="915115894" type="number" autoComplete="on" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* CORREO */}
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Correo</FormLabel>
            <FormControl>
              <Input placeholder="representacionesnataly@gmail.com" type="email" autoComplete="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
