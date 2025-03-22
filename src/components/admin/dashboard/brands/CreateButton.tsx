import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { PlusIcon } from 'lucide-react';
import CreateForm from '@/components/admin/dashboard/brands/CreateForm';
import { useState } from 'react';

export default function CreateButton() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="sm:hidden w-full">
          <PlusIcon strokeWidth={3} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Nueva Marca</DrawerTitle>
          <DrawerDescription>Rellene el formulario para crear la marca.</DrawerDescription>
        </DrawerHeader>
        <CreateForm setOpen={setOpen} />
      </DrawerContent>
    </Drawer>
  );
}
