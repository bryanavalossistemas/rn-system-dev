import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { PencilIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { findAll } from '@/api/products';
import { Skeleton } from '@/components/ui/skeleton';
import { UseFormReturn } from 'react-hook-form';
import { DetailForm, PurchaseForm } from '@/schemas/purchases';
import UpdateForm from './UpdateForm';

interface UpdateButtonProps {
  purchaseForm: UseFormReturn<PurchaseForm>;
  item: DetailForm;
}

export default function UpdateButton({ purchaseForm, item }: UpdateButtonProps) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const {
    data: products = [],
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => findAll({}),
    meta: {
      persist: true,
    },
  });

  if (isLoading) {
    return (
      <>
        <Skeleton className="w-full h-9 sm:hidden" />
        <Skeleton className="hidden sm:inline-flex w-44 h-9" />
      </>
    );
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
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
            <DrawerTitle>Editar Producto</DrawerTitle>
            <DrawerDescription>Actualice el formulario para editar el producto</DrawerDescription>
          </DrawerHeader>
          <UpdateForm purchaseForm={purchaseForm} setOpen={setOpenDrawer} products={products} item={item} />
        </DrawerContent>
      </Drawer>

      {/* DESKTOP */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <PencilIcon className="text-blue-600 w-5 h-5" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>Actualice el formulario para editar el producto</DialogDescription>
          </DialogHeader>
          <UpdateForm purchaseForm={purchaseForm} setOpen={setOpenDialog} products={products} item={item} />
        </DialogContent>
      </Dialog>
    </>
  );
}
