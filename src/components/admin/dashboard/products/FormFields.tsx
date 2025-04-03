import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Brand } from '@/schemas/brands';
import { Category } from '@/schemas/categories';
import { ProductForm } from '@/schemas/products';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';

interface FormFieldsProps {
  form: UseFormReturn<ProductForm>;
  categories: Category[];
  brands: Brand[];
}

export default function FormFields({ form, categories, brands }: FormFieldsProps) {
  const [openPopoverCategories, setOpenPopoverCategories] = useState(false);
  const [openPopoverBrands, setOpenPopoverBrands] = useState(false);
  const [openDrawerCategories, setOpenDrawerCategories] = useState(false);
  const [openDrawerBrands, setOpenDrawerBrands] = useState(false);
  const newImages = useWatch({ control: form.control, name: 'newImages' });
  const images = useWatch({ control: form.control, name: 'images' });

  const handleProductImageChange = (imageId: number) => {
    if (images.length > 0) {
      form.setValue(
        'images',
        images.map((p) => (p.id !== imageId ? p : { ...p, deleted: true })),
      );
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const validImages = [];
      for (const file of files) {
        validImages.push(file);
      }
      form.setValue('newImages', validImages);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  }, []);

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
              <Input placeholder="Harina anita x 50kg" type="text" autoComplete="on" autoFocus {...field} ref={inputRef} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* SALE PRICE */}
      <FormField
        control={form.control}
        name="salePrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Precio de venta</FormLabel>
            <FormControl>
              <Input placeholder="100.00" type="number" autoComplete="on" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* ECOMMERCE SALEPRICE */}
      <FormField
        control={form.control}
        name="ecommerceSalePrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Precio de venta en tienda virtual</FormLabel>
            <FormControl>
              <Input placeholder="110.00" type="number" autoComplete="on" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* COST PRICE */}
      <FormField
        control={form.control}
        name="costPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Precio de costo</FormLabel>
            <FormControl>
              <Input placeholder="100.00" type="number" autoComplete="on" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* STOCK */}
      <FormField
        control={form.control}
        name="stock"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stock</FormLabel>
            <FormControl>
              <Input placeholder="10" type="number" autoComplete="on" step={1} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <>
        {/* CATEGORY ID MOBILE */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem className="flex flex-col sm:hidden">
              <FormLabel>Categoría</FormLabel>
              <Drawer open={openDrawerCategories} onOpenChange={setOpenDrawerCategories}>
                <DrawerTrigger asChild>
                  <FormControl>
                    <Button variant="outline" role="combobox" className={cn('justify-between', !field.value && 'text-muted-foreground')}>
                      {field.value ? categories.find((category) => category.id === field.value)?.name : 'Seleccionar categoría'}
                      <ChevronsUpDownIcon className="opacity-50" />
                    </Button>
                  </FormControl>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Seleccionar Categoría</DrawerTitle>
                    <DrawerDescription>Busque la categoría del producto</DrawerDescription>
                  </DrawerHeader>
                  <Command>
                    <CommandInput placeholder="Buscar categoría..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No se encontró ninguna categoría.</CommandEmpty>
                      <CommandGroup>
                        {categories.map((category) => (
                          <CommandItem
                            value={category.name}
                            key={category.id}
                            onSelect={() => {
                              form.setValue('categoryId', category.id);
                              setOpenDrawerCategories(false);
                            }}
                          >
                            {category.name}
                            <CheckIcon className={cn('ml-auto', category.id === field.value ? 'opacity-100' : 'opacity-0')} />
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

        {/* CATEGORY ID DESKTOP */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem className="hidden sm:flex sm:flex-col">
              <FormLabel>Categoría</FormLabel>
              <Popover open={openPopoverCategories} onOpenChange={setOpenPopoverCategories}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" role="combobox" className={cn('justify-between', !field.value && 'text-muted-foreground')}>
                      {field.value ? categories.find((category) => category.id === field.value)?.name : 'Seleccionar categoría'}
                      <ChevronsUpDownIcon className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[398px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar categoría..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No se encontró ninguna categoría.</CommandEmpty>
                      <CommandGroup>
                        {categories.map((category) => (
                          <CommandItem
                            value={category.name}
                            key={category.id}
                            onSelect={() => {
                              form.setValue('categoryId', category.id);
                              setOpenPopoverCategories(false);
                            }}
                          >
                            {category.name}
                            <CheckIcon className={cn('ml-auto', category.id === field.value ? 'opacity-100' : 'opacity-0')} />
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
      <>
        {/* BRAND ID MOBILE */}
        <FormField
          control={form.control}
          name="brandId"
          render={({ field }) => (
            <FormItem className="flex flex-col sm:hidden">
              <FormLabel>Marca</FormLabel>
              <Drawer open={openDrawerBrands} onOpenChange={setOpenDrawerBrands}>
                <DrawerTrigger asChild>
                  <FormControl>
                    <Button variant="outline" role="combobox" className={cn('justify-between', !field.value && 'text-muted-foreground')}>
                      {field.value ? brands.find((brand) => brand.id === field.value)?.name : 'Seleccionar marca'}
                      <ChevronsUpDownIcon className="opacity-50" />
                    </Button>
                  </FormControl>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Seleccionar Marca</DrawerTitle>
                    <DrawerDescription>Busque la marca del producto</DrawerDescription>
                  </DrawerHeader>
                  <Command>
                    <CommandInput placeholder="Buscar marca..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No se encontró ninguna marca.</CommandEmpty>
                      <CommandGroup>
                        {brands.map((brand) => (
                          <CommandItem
                            value={brand.name}
                            key={brand.id}
                            onSelect={() => {
                              form.setValue('brandId', brand.id);
                              setOpenDrawerBrands(false);
                            }}
                          >
                            {brand.name}
                            <CheckIcon className={cn('ml-auto', brand.id === field.value ? 'opacity-100' : 'opacity-0')} />
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

        {/* BRAND ID DESKTOP */}
        <FormField
          control={form.control}
          name="brandId"
          render={({ field }) => (
            <FormItem className="hidden sm:flex sm:flex-col">
              <FormLabel>Marca</FormLabel>
              <Popover open={openPopoverBrands} onOpenChange={setOpenPopoverBrands}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" role="combobox" className={cn('justify-between', !field.value && 'text-muted-foreground')}>
                      {field.value ? brands.find((brand) => brand.id === field.value)?.name : 'Seleccionar marca'}
                      <ChevronsUpDownIcon className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[398px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar marca..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No se encontró ninguna marca.</CommandEmpty>
                      <CommandGroup>
                        {brands.map((brand) => (
                          <CommandItem
                            value={brand.name}
                            key={brand.id}
                            onSelect={() => {
                              form.setValue('brandId', brand.id);
                              setOpenPopoverBrands(false);
                            }}
                          >
                            {brand.name}
                            <CheckIcon className={cn('ml-auto', brand.id === field.value ? 'opacity-100' : 'opacity-0')} />
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

      {/* IMAGES */}
      <div className="grid gap-2">
        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <FormLabel>Imágenes</FormLabel>
              <FormControl>
                <Input placeholder="imagenes" type="file" accept="image/*" multiple onChange={handleImageChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {images && images.length > 0 && images.some((p) => p.deleted === undefined) && (
          <>
            <div className="flex flex-wrap gap-4 justify-center">
              {images.map(
                (image, index) =>
                  !image.deleted && (
                    <div key={image.id} className="grid">
                      <img
                        src={`${import.meta.env.VITE_API_URL}/${image.path}`}
                        alt={`Vista previa ${index + 1}`}
                        className="w-28 h-28 object-cover rounded-t-sm"
                      />
                      <Button type="button" onClick={() => handleProductImageChange(image.id)} className="rounded-t-none">
                        Eliminar
                      </Button>
                    </div>
                  ),
              )}
            </div>
            <Separator />
          </>
        )}
        {newImages.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center">
            {newImages.map((image, index) => (
              <img key={index} src={URL.createObjectURL(image)} alt={`Vista previa ${index + 1}`} className="w-28 h-28 object-cover rounded" />
            ))}
          </div>
        )}
      </div>

      {/* DESCRIPCION */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción</FormLabel>
            <FormControl>
              <Textarea placeholder="Descripción del producto" autoComplete="on" className="resize-none" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* BARCODE */}
      <FormField
        control={form.control}
        name="barCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Código de barras</FormLabel>
            <FormControl>
              <Input placeholder="12341513413" type="text" autoComplete="on" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* SKU */}
      <FormField
        control={form.control}
        name="sku"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Código interno</FormLabel>
            <FormControl>
              <Input placeholder="HAR-00001" type="text" autoComplete="on" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Measurement Unit */}
      <FormField
        control={form.control}
        name="measurementUnit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Unidad de medida</FormLabel>
            <FormControl>
              <Input placeholder="kg, caja, unidad" type="text" autoComplete="on" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Measurement Quantity */}
      <FormField
        control={form.control}
        name="measurementQuantity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cantidad de medida</FormLabel>
            <FormControl>
              <Input placeholder="10" type="number" autoComplete="on" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* SHOW IN ECOMMERCE */}
      <FormField
        control={form.control}
        name="showInEcommerce"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <FormLabel>¿Mostrar en tienda virtual?</FormLabel>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      {/* ECOMMERCE PERCENTAGE DISCCOUNT */}
      <FormField
        control={form.control}
        name="ecommercePercentageDiscount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Porcentaje de descuento en tienda virtual</FormLabel>
            <FormControl>
              <Input placeholder="10" type="number" autoComplete="on" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
