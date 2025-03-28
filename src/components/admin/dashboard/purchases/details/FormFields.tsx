import { Button } from '@/components/ui/button';
import { DetailForm } from '@/schemas/purchases';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Product } from '@/schemas/products';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface FormFieldsProps {
  form: UseFormReturn<DetailForm>;
  products: Product[];
}

export default function FormFields({ form, products }: FormFieldsProps) {
  const [openProductsDrawer, setOpenProductsDrawer] = useState(false);
  const [openProductsPopover, setOpenProductsPopover] = useState(false);

  return (
    <div className="grid gap-6">
      {/* PRODUCT ID */}
      <>
        {/* MOBILE */}
        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem className="flex flex-col sm:hidden">
              <FormLabel>Producto</FormLabel>
              <Drawer open={openProductsDrawer} onOpenChange={setOpenProductsDrawer}>
                <DrawerTrigger asChild>
                  <FormControl>
                    <Button variant="outline" role="combobox" className={cn('justify-between', !field.value && 'text-muted-foreground')}>
                      {field.value ? products.find((product) => product.id === field.value)?.name : 'Seleccionar producto'}
                      <ChevronsUpDownIcon className="opacity-50" />
                    </Button>
                  </FormControl>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Seleccionar Producto</DrawerTitle>
                    <DrawerDescription>Busque el producto del detalle</DrawerDescription>
                  </DrawerHeader>
                  <Command>
                    <CommandInput placeholder="Buscar producto..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No se encontró ningún producto</CommandEmpty>
                      <CommandGroup>
                        {products.map((product) => (
                          <CommandItem
                            value={product.name}
                            key={product.id}
                            onSelect={() => {
                              form.setValue('productId', product.id);
                              setOpenProductsDrawer(false);
                            }}
                          >
                            {product.name}
                            <CheckIcon className={cn('ml-auto', product.id === field.value ? 'opacity-100' : 'opacity-0')} />
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
          name="productId"
          render={({ field }) => (
            <FormItem className="hidden sm:flex sm:flex-col">
              <FormLabel>Producto</FormLabel>
              <Popover open={openProductsPopover} onOpenChange={setOpenProductsPopover}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button autoFocus variant="outline" role="combobox" className={cn('justify-between', !field.value && 'text-muted-foreground')}>
                      <span className="sm:max-w-87 sm:truncate">
                        {field.value ? products.find((product) => product.id === field.value)?.name : 'Seleccionar producto'}
                      </span>
                      <ChevronsUpDownIcon className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[398px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar producto..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No se encontró ningún producto</CommandEmpty>
                      <CommandGroup>
                        {products.map((product) => (
                          <CommandItem
                            value={product.name}
                            key={product.id}
                            onSelect={() => {
                              form.setValue('productId', product.id);
                              form.setValue('productName', product.name);
                              form.setValue('quantity', 1);
                              form.setValue('unitPrice', product.salePrice);
                              setOpenProductsPopover(false);
                            }}
                          >
                            {product.name}
                            <CheckIcon className={cn('ml-auto', product.id === field.value ? 'opacity-100' : 'opacity-0')} />
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
      </>

      {/* NOMBRE */}
      <FormField
        control={form.control}
        name="productName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input placeholder="Harina Anita x 50Kg" type="text" autoComplete="on" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="quantity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cantidad</FormLabel>
            <FormControl>
              <Input placeholder="5" type="number" autoComplete="on" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="unitPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Precio</FormLabel>
            <FormControl>
              <Input placeholder="100.00" type="number" autoComplete="on" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
