import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import UpdateForm from '@/components/admin/dashboard/sales/UpdateForm';
import { Sale } from '@/schemas/sales';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useCustomers } from '@/hooks/useCustomers';

interface UpdateButtonProps {
  item: Sale;
}

export default function UpdateButton({ item }: UpdateButtonProps) {
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
      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerTrigger asChild>
          <Button className="sm:hidden" size="icon">
            <PencilIcon />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Editar Venta</DrawerTitle>
            <DrawerDescription>Actualice los datos de la venta</DrawerDescription>
          </DrawerHeader>
          <UpdateForm setOpen={setOpenDrawer} item={item} customers={customers} />
        </DrawerContent>
      </Drawer>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button className="hidden sm:flex">
            <span>Editar</span>
            <PencilIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className="min-w-200 min-h-[50svh] max-h-[85svh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Editar Venta</DialogTitle>
            <DialogDescription>Actualice los datos de la venta</DialogDescription>
          </DialogHeader>
          <UpdateForm setOpen={setOpenDialog} item={item} customers={customers} />
        </DialogContent>
      </Dialog>
    </>
  );
}
