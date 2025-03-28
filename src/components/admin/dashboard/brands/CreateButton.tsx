import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { PlusIcon } from 'lucide-react';
import CreateForm from '@/components/admin/dashboard/brands/CreateForm';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function CreateButton() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

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
            <DrawerTitle>Nueva Marca</DrawerTitle>
            <DrawerDescription>Rellene el formulario para crear la marca</DrawerDescription>
          </DrawerHeader>
          <CreateForm setOpen={setOpenDrawer} />
        </DrawerContent>
      </Drawer>

      {/* DESKTOP */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button className="hidden sm:flex">
            <span>Añadir Marca</span>
            <PlusIcon strokeWidth={3} />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-sm">
          <DialogHeader>
            <DialogTitle>Nueva Marca</DialogTitle>
            <DialogDescription>Rellene el formulario para crear una marca</DialogDescription>
          </DialogHeader>
          <CreateForm setOpen={setOpenDialog} />
        </DialogContent>
      </Dialog>
    </>
  );
}
