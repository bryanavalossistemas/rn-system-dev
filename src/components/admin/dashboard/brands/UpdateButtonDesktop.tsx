import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Brand } from '@/schemas/brands';
import { PencilIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import UpdateForm from '@/components/admin/dashboard/brands/UpdateForm';

interface UpdateButtonDesktopProps {
  item: Brand;
}

export default function UpdateButtonDesktop({ item }: UpdateButtonDesktopProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="hidden sm:flex">
          <span>Editar</span>
          <PencilIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Marca</DialogTitle>
          <DialogDescription>Actualiza el formulario para editar la marca.</DialogDescription>
        </DialogHeader>
        <UpdateForm setOpen={setOpen} item={item} />
      </DialogContent>
    </Dialog>
  );
}
