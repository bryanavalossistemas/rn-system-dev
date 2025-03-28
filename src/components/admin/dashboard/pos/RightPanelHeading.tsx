import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import CreateButtonSuppliers from '@/components/admin/dashboard/customers/CreateButton';
import { SaleForm } from '@/schemas/sales';
import { useFormContext, useWatch } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Customer } from '@/schemas/customers';

interface RightPanelHeadingProps {
  customers: Customer[];
}

export default function RightPanelHeading({ customers }: RightPanelHeadingProps) {
  const [openCutomersPopover, setOpenCutomersPopover] = useState(false);
  const { control, setValue } = useFormContext<SaleForm>();

  const documentTypeId = useWatch({ control: control, name: 'documentTypeId' });
  const filteredCustomers = useMemo(() => {
    if (documentTypeId === 1) {
      return customers.filter((c) => c.type === 'RUC');
    } else if (documentTypeId === 2) {
      return customers.filter((c) => c.type === 'DNI');
    }
    return customers;
  }, [customers, documentTypeId]);

  return (
    <div className="p-3 border-b">
      <div className="flex gap-2">
        {/* CUSTOMER ID */}
        <FormField
          control={control}
          name="customerId"
          render={({ field }) => (
            <div className="flex-1">
              <Popover open={openCutomersPopover} onOpenChange={setOpenCutomersPopover}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" role="combobox" className={cn('justify-between w-full', !field.value && 'text-muted-foreground')}>
                      <span className="truncate max-w-[217px]">
                        {field.value ? filteredCustomers.find((customerId) => customerId.id === field.value)?.name : 'Seleccionar cliente'}
                      </span>
                      <ChevronsUpDownIcon className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[267px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar cliente..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No se encontró ningún cliente</CommandEmpty>
                      <CommandGroup>
                        {filteredCustomers.map((customer) => (
                          <CommandItem
                            value={customer.name}
                            key={customer.id}
                            onSelect={() => {
                              setValue('customerId', customer.id);
                              setOpenCutomersPopover(false);
                            }}
                          >
                            <span>{customer.name}</span>
                            <CheckIcon className={cn('ml-auto', customer.id === field.value ? 'opacity-100' : 'opacity-0')} />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                    <CommandSeparator />
                    <CommandGroup>
                      <CreateButtonSuppliers variant="ghost" className="w-full" />
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </div>
          )}
        />

        {/* DOCUMENT TYPE ID */}
        <FormField
          control={control}
          name="documentTypeId"
          render={({ field }) => (
            <FormItem>
              <Select
                name="documentTypeId"
                onValueChange={(value) => {
                  field.onChange(parseInt(value));
                  setValue('customerId', 0);
                }}
                defaultValue={String(field.value)}
              >
                <FormControl>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="min-w-auto w-[100px]">
                  <SelectItem value={'1'}>Factura</SelectItem>
                  <SelectItem value={'2'}>Boleta</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
