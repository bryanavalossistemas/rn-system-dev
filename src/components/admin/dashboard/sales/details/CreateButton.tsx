import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { PlusIcon } from 'lucide-react';
import CreateForm from '@/components/admin/dashboard/sales/details/CreateForm';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { UseFormReturn } from 'react-hook-form';
import { SaleForm } from '@/schemas/sales';
import { useProducts } from '@/hooks/useProducts';

interface CreateButtonProps {
  purchaseForm: UseFormReturn<SaleForm>;
}

export default function CreateButton({ purchaseForm }: CreateButtonProps) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const { data: products = [], isLoading } = useProducts();

  if (isLoading) {
    return (
      <>
        <Skeleton className="w-full h-9 sm:hidden" />
        <Skeleton className="hidden sm:inline-flex w-[110px] h-9" />
      </>
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
            <DrawerTitle>Agregar producto</DrawerTitle>
            <DrawerDescription>Rellene el formulario para agregar el producto</DrawerDescription>
          </DrawerHeader>
          <CreateForm purchaseForm={purchaseForm} setOpen={setOpenDrawer} products={products} />
        </DrawerContent>
      </Drawer>

      {/* DESKTOP */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button className="hidden sm:inline-flex">
            <span>Producto</span>
            <PlusIcon strokeWidth={3} />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-md">
          <DialogHeader>
            <DialogTitle>Agregar producto</DialogTitle>
            <DialogDescription>Rellene el formulario para agregar el producto</DialogDescription>
          </DialogHeader>
          <CreateForm purchaseForm={purchaseForm} setOpen={setOpenDialog} products={products} />
        </DialogContent>
      </Dialog>
    </>
  );
}
