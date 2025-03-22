import { update } from '@/api/purchases';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Purchase, PurchaseForm, PurchaseFormSchema } from '@/schemas/purchases';
import useStore from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn, formatCurrency } from '@/lib/utils';
import { CheckIcon, ChevronsUpDownIcon, TrashIcon } from 'lucide-react';
import CreateButton from './details/CreateButton';
import { TableCell, TableHeader, TableRow, Table, TableCaption, TableBody, TableFooter, TableHead } from '@/components/ui/table';
import UpdateButton from './details/UpdateButton';
import { Supplier } from '@/schemas/suppliers';

interface UpdateFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  item: Purchase;
  suppliers: Supplier[];
}

export default function UpdateForm({ setOpen, item, suppliers }: UpdateFormProps) {
  const { id, document, supplier } = item;

  const form = useForm<PurchaseForm>({
    resolver: zodResolver(PurchaseFormSchema),
    defaultValues: {
      supplierId: String(supplier?.id),
      documentTypeId: String(document?.documentType?.id),
      documentDetails:
        document?.documentDetails?.map((d) => {
          return {
            id: d.id,
            productId: String(d.product?.id),
            productName: d.productName,
            quantity: String(d.quantity),
            unitPrice: String(d.unitPrice),
          };
        }) ?? [],
    },
  });

  const queryClient = useQueryClient();

  const { dateOptionPurchases: dateOption } = useStore();

  const { mutate, isPending } = useMutation({
    mutationFn: update,
    onMutate: async ({ id, formData }) => {
      await queryClient.cancelQueries({ queryKey: ['purchases', dateOption] });

      const previousItems = queryClient.getQueryData(['purchases', dateOption]);

      const { documentTypeId, supplierId, documentDetails } = formData;

      const updatedItem: Purchase & {
        isOptimistic?: boolean;
      } = {
        id: id,
        supplierName: suppliers.find((s) => String(s.id) === supplierId)?.name ?? '',
        supplierDocument: suppliers.find((s) => String(s.id) === supplierId)?.document ?? '',
        supplier: { id: parseInt(supplierId) },
        document: {
          documentSerie: document?.documentSerie,
          documentNumber: document?.documentNumber,
          total: documentDetails.filter((d) => d.deleted !== true).reduce((total, d) => total + parseFloat(d.unitPrice) * parseInt(d.quantity), 0),
          documentType: { id: parseInt(documentTypeId) },
          documentDetails: documentDetails.map((d) => {
            return {
              id: d.id ? d.id : (d.key ?? Date.now()),
              productName: d.productName,
              quantity: parseInt(d.quantity),
              unitPrice: parseFloat(d.unitPrice),
            };
          }),
        },
        createdAt: new Date(),
        isOptimistic: true,
      };

      queryClient.setQueryData(['purchases', dateOption], (oldItems: Purchase[]) => oldItems.map((item) => (item.id === id ? updatedItem : item)));

      setOpen(false);
      toast.success('Compra actualizada correctamente');

      return { previousItems };
    },
    onError: (error, _variables, context) => {
      toast.error(error.message);
      queryClient.setQueryData(['purchases', dateOption], context?.previousItems);
    },
    onSuccess: (newItem) => {
      queryClient.setQueryData(['purchases', dateOption], (oldItems: Purchase & { isOptimistic?: boolean }[]) => {
        return oldItems.map((item) => (item.isOptimistic ? newItem : item));
      });
    },
  });

  const onSubmit = (formData: PurchaseForm) => {
    mutate({ id, formData });
  };

  const [openSuppliersDrawer, setOpenSuppliersDrawer] = useState(false);
  const [openSuppliersPopover, setOpenSuppliersPopover] = useState(false);

  const currentDocumentTypeId = useWatch({ control: form.control, name: 'documentTypeId' });

  const [currentSuppliers, setCurrentSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    setCurrentSuppliers(suppliers.filter((s) => s.type === (currentDocumentTypeId === '1' ? 'RUC' : 'DNI')));
    form.setValue('supplierId', '');
  }, [currentDocumentTypeId, form, suppliers]);

  useEffect(() => {
    if (supplier) {
      form.setValue('supplierId', String(supplier.id));
    }
  }, [form, supplier]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 p-2 flex flex-col">
        <div className="grid gap-6 sm:grid-cols-2 sm:flex sm:justify-between sm:gap-4">
          <div className="grid gap-6 sm:flex sm:gap-2 flex-1">
            {/* DOCUMENT TYPE */}
            <FormField
              control={form.control}
              name="documentTypeId"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={'1'}>Factura</SelectItem>
                      <SelectItem value={'2'}>Boleta</SelectItem>
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
                name="supplierId"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:hidden">
                    <FormLabel>Proveedor</FormLabel>
                    <Drawer open={openSuppliersDrawer} onOpenChange={setOpenSuppliersDrawer}>
                      <DrawerTrigger asChild>
                        <FormControl>
                          <Button variant="outline" role="combobox" className={cn('justify-between', !field.value && 'text-muted-foreground')}>
                            {field.value ? currentSuppliers.find((supplier) => String(supplier.id) === field.value)?.name : 'Seleccionar proveedor'}
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
                              {currentSuppliers.map((supplier) => (
                                <CommandItem
                                  value={supplier.name}
                                  key={supplier.id}
                                  onSelect={() => {
                                    form.setValue('supplierId', String(supplier.id));
                                    setOpenSuppliersDrawer(false);
                                  }}
                                >
                                  {supplier.name}
                                  <CheckIcon className={cn('ml-auto', String(supplier.id) === field.value ? 'opacity-100' : 'opacity-0')} />
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
                name="supplierId"
                render={({ field }) => (
                  <FormItem className="hidden sm:flex sm:flex-col">
                    <Popover open={openSuppliersPopover} onOpenChange={setOpenSuppliersPopover}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" role="combobox" className={cn('justify-between', !field.value && 'text-muted-foreground')}>
                            {field.value ? currentSuppliers.find((supplier) => String(supplier.id) === field.value)?.name : 'Seleccionar proveedor'}
                            <ChevronsUpDownIcon className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[398px] p-0">
                        <Command>
                          <CommandInput placeholder="Buscar proveedor..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>No se encontró ningún proveedor</CommandEmpty>
                            <CommandGroup>
                              {currentSuppliers.map((supplier) => (
                                <CommandItem
                                  value={supplier.name}
                                  key={supplier.id}
                                  onSelect={() => {
                                    form.setValue('supplierId', String(supplier.id));
                                    setOpenSuppliersPopover(false);
                                  }}
                                >
                                  {supplier.name}
                                  <CheckIcon className={cn('ml-auto', String(supplier.id) === field.value ? 'opacity-100' : 'opacity-0')} />
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
            name="documentDetails"
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
                        <TableRow key={detail.id ?? detail.key}>
                          <TableCell>
                            <div className="flex gap-x-2">
                              <TrashIcon
                                className="text-red-600 w-5 h-5"
                                onClick={() => {
                                  if (detail.key) {
                                    form.setValue(
                                      'documentDetails',
                                      field.value.filter((p) => p.id !== detail.id),
                                    );
                                  } else {
                                    form.setValue(
                                      'documentDetails',
                                      field.value.map((p) => (p.id === detail.id ? { ...p, deleted: true } : p)),
                                    );
                                  }
                                }}
                              />
                              <UpdateButton purchaseForm={form} item={detail} />
                            </div>
                          </TableCell>
                          <TableCell>{detail.productName}</TableCell>
                          <TableCell className="text-center">{Number(detail.quantity)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(Number(detail.unitPrice))}</TableCell>
                          <TableCell className="text-right">{formatCurrency(Number(detail.unitPrice) * Number(detail.quantity))}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={4}>Total</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          field.value
                            .filter((d) => d.deleted === undefined)
                            .reduce((acummulator, detail) => acummulator + Number(detail.unitPrice) * Number(detail.quantity), 0),
                        )}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col sm:flex-row-reverse gap-2 mt-2 sm:mt-4">
          <Button type="submit" disabled={isPending}>
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
