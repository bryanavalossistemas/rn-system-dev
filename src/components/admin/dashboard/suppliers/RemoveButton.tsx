import { remove } from '@/api/suppliers';
import { Button } from '@/components/ui/button';
import { Supplier } from '@/schemas/suppliers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { TrashIcon } from 'lucide-react';
import useStore from '@/store';

interface RemoveButtonProps {
  id: Supplier['id'];
}

export default function RemoveButton({ id }: RemoveButtonProps) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const { dateOptionSuppliers: dateOption } = useStore();

  const { mutate, isPending } = useMutation({
    mutationFn: remove,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ['suppliers', dateOption] });

      const previousItems = queryClient.getQueryData(['suppliers', dateOption]);

      queryClient.setQueryData(['suppliers', dateOption], (oldItems: Supplier[]) => oldItems.filter((item) => item.id !== id));

      setOpen(false);
      toast.success('Proveedor eliminado correctamente');

      return { previousItems };
    },
    onError: (error, _variables, context) => {
      toast.error(error.message);
      queryClient.setQueryData(['suppliers', dateOption], context?.previousItems);
    },
  });

  const onClick = () => {
    mutate({ id });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div>
          <Button className="sm:hidden" size="icon">
            <TrashIcon />
          </Button>
          <Button className="hidden sm:flex">
            <span>Eliminar</span>
            <TrashIcon />
          </Button>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[calc(100%-1.5rem)] p-2 sm:p-4">
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Borrará permanentemente el proveedor y eliminará sus datos de nuestros servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={onClick}>
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
