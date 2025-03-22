import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import UpdateForm from '@/components/admin/dashboard/purchases/UpdateForm';
import { Purchase } from '@/schemas/purchases';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { findAll } from '@/api/suppliers';
import { Skeleton } from '@/components/ui/skeleton';

interface UpdateButtonProps {
  item: Purchase;
}

export default function UpdateButton({ item }: UpdateButtonProps) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const {
    data: suppliers = [],
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['suppliers'],
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
      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerTrigger asChild>
          <Button className="sm:hidden" size="icon">
            <PencilIcon />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Editar Compra</DrawerTitle>
            <DrawerDescription>Actualice los datos de la Compra</DrawerDescription>
          </DrawerHeader>
          <UpdateForm setOpen={setOpenDrawer} item={item} suppliers={suppliers} />
        </DrawerContent>
      </Drawer>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button className="hidden sm:flex">
            <span>Editar</span>
            <PencilIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className="min-w-[75vw] min-h-[50vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Editar Compra</DialogTitle>
            <DialogDescription>Actualice los datos de la Compra</DialogDescription>
          </DialogHeader>
          <UpdateForm setOpen={setOpenDialog} item={item} suppliers={suppliers} />
        </DialogContent>
      </Dialog>
    </>
  );
}
