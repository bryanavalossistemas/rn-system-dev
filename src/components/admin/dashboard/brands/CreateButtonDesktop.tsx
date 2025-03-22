import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CreateForm from '@/components/admin/dashboard/brands/CreateForm';
import { useState } from 'react';

export default function CreateButtonDesktop() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="hidden sm:inline-flex w-44">
          <span>Añadir Marca</span>
          <PlusIcon strokeWidth={3} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva Marca</DialogTitle>
          <DialogDescription>Rellene el formulario para crear la marca.</DialogDescription>
        </DialogHeader>
        <CreateForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
