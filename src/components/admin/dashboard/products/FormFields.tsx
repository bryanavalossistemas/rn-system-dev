import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Brand } from '@/schemas/brands';
import { Category } from '@/schemas/categories';
import { ProductForm } from '@/schemas/products';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface FormFieldsProps {
  form: UseFormReturn<ProductForm>;
  categories: Category[];
  brands: Brand[];
  oldImages?: {
    path: string;
    id: number;
  }[];
}

export default function FormFields({ form, categories, brands, oldImages }: FormFieldsProps) {
  const [openPopoverCategories, setOpenPopoverCategories] = useState(false);
  const [openPopoverBrands, setOpenPopoverBrands] = useState(false);
  const [openDrawerCategories, setOpenDrawerCategories] = useState(false);
  const [openDrawerBrands, setOpenDrawerBrands] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [productImages, setProductImages] = useState<ProductForm['oldImages']>(oldImages);

  const handleProductImageChange = (imageId: number) => {
    if (productImages) {
      const newProductImages = productImages.map((p) => (p.id !== imageId ? p : { ...p, deleted: true }));
      setProductImages(newProductImages);
      form.setValue('oldImages', newProductImages);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const validImages = [];
      for (const file of files) {
        validImages.push(file);
      }
      setImages(validImages);
      form.setValue('images', validImages.length > 0 ? validImages : undefined);
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
        {/* MOBILE */}
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
        {/* DESKTOP */}
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
        {/* MOBILE */}
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
        {/* DESKTOP */}
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
        {productImages && productImages.length > 0 && productImages.some((p) => p.deleted === undefined) && (
          <>
            <div className="flex flex-wrap gap-4 justify-center">
              {productImages.map(
                (image, index) =>
                  !image.deleted && (
                    <div key={image.id} className="grid">
                      <img src={image.path} alt={`Vista previa ${index + 1}`} className="w-28 h-28 object-cover rounded-t-sm" />
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
        {images.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center">
            {images.map((image, index) => (
              <img key={index} src={URL.createObjectURL(image)} alt={`Vista previa ${index + 1}`} className="w-28 h-28 object-cover rounded" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
