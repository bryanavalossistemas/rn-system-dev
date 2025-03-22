import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { PlusIcon } from 'lucide-react';
import CreateForm from '@/components/admin/dashboard/products/CreateForm';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { findAll as findAllCategories } from '@/api/categories';
import { findAll as findAllBrands } from '@/api/brands';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

export default function CreateButton() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const {
    data: categories = [],
    isError: isErrorCategories,
    isLoading: isLoadingCategories,
    error: errorCategories,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => findAllCategories({}),
    meta: {
      persist: true,
    },
  });

  const {
    data: brands = [],
    isError: isErrorBrands,
    isLoading: isLoadingBrands,
    error: errorBrands,
  } = useQuery({
    queryKey: ['brands'],
    queryFn: () => findAllBrands({}),
    meta: {
      persist: true,
    },
  });

  if (isLoadingCategories || isLoadingBrands) {
    return (
      <>
        <Skeleton className="w-full h-9 sm:hidden" />
        <Skeleton className="hidden sm:inline-flex w-44 h-9" />
      </>
    );
  }

  if (isErrorCategories || isErrorBrands) {
    return (
      <div>
        Error: {errorCategories?.message} {errorBrands?.message}
      </div>
    );
  }

  return (
    <>
      {/* MOBILE */}
      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerTrigger asChild>
          <Button className="sm:hidden w-full">
            <PlusIcon strokeWidth={3} />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Nuevo Producto</DrawerTitle>
            <DrawerDescription>Rellene el formulario para crear un producto</DrawerDescription>
          </DrawerHeader>
          <CreateForm categories={categories} brands={brands} setOpen={setOpenDrawer} />
        </DrawerContent>
      </Drawer>

      {/* DESKTOP */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button className="hidden sm:inline-flex w-44">
            <span>Añadir Producto</span>
            <PlusIcon strokeWidth={3} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo Producto</DialogTitle>
            <DialogDescription>Rellene el formulario para crear un producto</DialogDescription>
          </DialogHeader>
          <CreateForm setOpen={setOpenDialog} categories={categories} brands={brands} />
        </DialogContent>
      </Dialog>
    </>
  );
}
