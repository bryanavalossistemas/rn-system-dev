import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import UpdateForm from '@/components/admin/dashboard/categories/UpdateForm';
import { Category } from '@/schemas/categories';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface UpdateButtonProps {
  item: Category;
}

export default function UpdateButton({ item }: UpdateButtonProps) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

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
            <DrawerTitle>Editar Categoría</DrawerTitle>
            <DrawerDescription>Actualiza el formulario para editar una categoria</DrawerDescription>
          </DrawerHeader>
          <UpdateForm setOpen={setOpenDrawer} item={item} />
        </DrawerContent>
      </Drawer>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button className="hidden sm:flex">
            <span>Editar</span>
            <PencilIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-sm">
          <DialogHeader>
            <DialogTitle>Editar Categoría</DialogTitle>
            <DialogDescription>Actualiza el formulario para editar una categoria</DialogDescription>
          </DialogHeader>
          <UpdateForm setOpen={setOpenDialog} item={item} />
        </DialogContent>
      </Dialog>
    </>
  );
}
