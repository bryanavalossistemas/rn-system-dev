import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import UpdateForm from '@/components/admin/dashboard/brands/UpdateForm';
import { Brand } from '@/schemas/brands';

interface UpdateButtonProps {
  item: Brand;
}

export default function UpdateButton({ item }: UpdateButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="icon">
          <PencilIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Editar Marca</DrawerTitle>
          <DrawerDescription>Actualiza el formulario para editar la marca.</DrawerDescription>
        </DrawerHeader>
        <UpdateForm setOpen={setOpen} item={item} />
      </DrawerContent>
    </Drawer>
  );
}
