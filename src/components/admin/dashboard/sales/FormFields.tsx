import { Button } from '@/components/ui/button';
import { SaleForm } from '@/schemas/sales';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn, formatCurrency } from '@/lib/utils';
import { CheckIcon, ChevronsUpDownIcon, TrashIcon } from 'lucide-react';
import CreateButton from '@/components/admin/dashboard/sales/details/CreateButton';
import { TableCell, TableHeader, TableRow, Table, TableCaption, TableBody, TableFooter, TableHead } from '@/components/ui/table';
import UpdateButton from '@/components/admin/dashboard/sales/details/UpdateButton';
import { Customer } from '@/schemas/customers';
import { useMemo, useState } from 'react';

interface FormFieldsProps {
  form: UseFormReturn<SaleForm>;
  customers: Customer[];
}

export default function FormFields({ form, customers }: FormFieldsProps) {
  const [openCustomersDrawer, setOpenCustomersDrawer] = useState(false);
  const [openCustomersPopover, setOpenCustomersPopover] = useState(false);
  const currentDocumentType = useWatch({ control: form.control, name: 'documentType' });

  const filteredCustomers = useMemo(() => {
    if (currentDocumentType === 'Factura') {
      return customers.filter((c) => c.documentType === 'RUC');
    } else if (currentDocumentType === 'Boleta') {
      return customers.filter((c) => c.documentType === 'DNI');
    }
    return customers;
  }, [customers, currentDocumentType]);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 sm:flex sm:justify-between sm:gap-4">
        <div className="grid gap-6 sm:flex sm:gap-2 flex-1">
          {/* DOCUMENT TYPE */}
          <FormField
            control={form.control}
            name="documentType"
            render={({ field }) => (
              <FormItem>
                <Select
                  name="documentType"
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue('customerId', 0);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="min-w-auto w-[100px]">
                    <SelectItem value={'Factura'}>Factura</SelectItem>
                    <SelectItem value={'Boleta'}>Boleta</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* SUPPLIER ID */}
          <div className="flex-1">
            {/* MOBILE */}
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem className="flex flex-col sm:hidden">
                  <FormLabel>Proveedor</FormLabel>
                  <Drawer open={openCustomersDrawer} onOpenChange={setOpenCustomersDrawer}>
                    <DrawerTrigger asChild>
                      <FormControl>
                        <Button variant="outline" role="combobox" className={cn('justify-between', !field.value && 'text-muted-foreground')}>
                          {field.value ? filteredCustomers.find((supplier) => supplier.id === field.value)?.name : 'Seleccionar proveedor'}
                          <ChevronsUpDownIcon className="opacity-50" />
                        </Button>
                      </FormControl>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Seleccionar Proveedor</DrawerTitle>
                        <DrawerDescription>Busque el proveedor de la compra</DrawerDescription>
                      </DrawerHeader>
                      <Command>
                        <CommandInput placeholder="Buscar proveedor..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No se encontró ningún proveedor</CommandEmpty>
                          <CommandGroup>
                            {filteredCustomers.map((supplier) => (
                              <CommandItem
                                value={supplier.name}
                                key={supplier.id}
                                onSelect={() => {
                                  form.setValue('customerId', supplier.id);
                                  setOpenCustomersDrawer(false);
                                }}
                              >
                                {supplier.name}
                                <CheckIcon className={cn('ml-auto', supplier.id === field.value ? 'opacity-100' : 'opacity-0')} />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </DrawerContent>
                  </Drawer>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* DESKTOP */}
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem className="hidden sm:flex sm:flex-col">
                  <Popover open={openCustomersPopover} onOpenChange={setOpenCustomersPopover}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" role="combobox" className={cn('justify-between', !field.value && 'text-muted-foreground')}>
                          <span className="truncate max-w-[465px]">
                            {field.value ? filteredCustomers.find((supplier) => supplier.id === field.value)?.name : 'Seleccionar proveedor'}
                          </span>
                          <ChevronsUpDownIcon className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[517.39px] p-0">
                      <Command>
                        <CommandInput placeholder="Buscar proveedor..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No se encontró ningún proveedor</CommandEmpty>
                          <CommandGroup>
                            {filteredCustomers.map((supplier) => (
                              <CommandItem
                                value={supplier.name}
                                key={supplier.id}
                                onSelect={() => {
                                  form.setValue('customerId', supplier.id);
                                  setOpenCustomersPopover(false);
                                }}
                              >
                                {supplier.name}
                                <CheckIcon className={cn('ml-auto', supplier.id === field.value ? 'opacity-100' : 'opacity-0')} />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <CreateButton purchaseForm={form} />
      </div>
      <div className="flex-1 mt-4">
        <FormField
          control={form.control}
          name="saleDetails"
          render={({ field }) => (
            <FormItem>
              <Table>
                <TableCaption>Detalles de la compra</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead />
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-center">Cantidad</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {field.value
                    .filter((d) => d.deleted === undefined)
                    .map((detail) => (
                      <TableRow key={detail.id}>
                        <TableCell>
                          <div className="flex gap-x-2">
                            <TrashIcon
                              className="text-red-600 w-5 h-5"
                              onClick={() => {
                                if (detail.created) {
                                  form.setValue(
                                    'saleDetails',
                                    field.value.filter((p) => p.id !== detail.id),
                                  );
                                } else {
                                  form.setValue(
                                    'saleDetails',
                                    field.value.map((p) => (p.id === detail.id ? { ...p, deleted: true } : p)),
                                  );
                                }
                              }}
                            />
                            <UpdateButton purchaseForm={form} item={detail} />
                          </div>
                        </TableCell>
                        <TableCell className="truncate max-w-[460px]">{detail.productName}</TableCell>
                        <TableCell className="text-center">{detail.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(detail.unitPrice)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(detail.unitPrice * detail.quantity)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4}>Total</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(field.value.reduce((acummulator, detail) => acummulator + detail.unitPrice * detail.quantity, 0))}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
