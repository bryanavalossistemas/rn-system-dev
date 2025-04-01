import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { PlusIcon } from 'lucide-react';
import CreateForm from '@/components/admin/dashboard/sales/CreateForm';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useCustomers } from '@/hooks/useCustomers';

export default function CreateButton() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const { data: customers = [], isLoading } = useCustomers();

  if (isLoading) {
    return (
      <>
        <Skeleton className="w-full h-9 sm:hidden" />
        <Skeleton className="hidden sm:inline-flex w-44 h-9" />
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
            <DrawerTitle>Nueva Venta</DrawerTitle>
            <DrawerDescription>Rellene el formulario para crear una venta</DrawerDescription>
          </DrawerHeader>
          <CreateForm setOpen={setOpenDrawer} customers={customers} />
        </DrawerContent>
      </Drawer>

      {/* DESKTOP */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button className="hidden sm:inline-flex">
            <span>Añadir Venta</span>
            <PlusIcon strokeWidth={3} />
          </Button>
        </DialogTrigger>
        <DialogContent className="min-w-200 min-h-[50svh] max-h-[85svh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Nueva Venta</DialogTitle>
            <DialogDescription>Rellene el formulario para crear una venta</DialogDescription>
          </DialogHeader>
          <CreateForm setOpen={setOpenDialog} customers={customers} />
        </DialogContent>
      </Dialog>
    </>
  );
}
