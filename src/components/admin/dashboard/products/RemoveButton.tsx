import { remove } from '@/api/products';
import { Button } from '@/components/ui/button';
import { Product } from '@/schemas/products';
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
  id: Product['id'];
}

export default function RemoveButton({ id }: RemoveButtonProps) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const { dateOptionProducts: dateOption } = useStore();

  const { mutate, isPending } = useMutation({
    mutationFn: remove,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ['products', dateOption] });

      const previousItems = queryClient.getQueryData(['products', dateOption]);

      queryClient.setQueryData(['products', dateOption], (oldItems: Product[]) => oldItems.filter((item) => item.id !== id));

      setOpen(false);
      toast.success('Producto eliminado correctamente');

      return { previousItems };
    },
    onError: (_error, _variables, context) => {
      console.log(_error);
      toast.error('Parece que hubo un error al eliminar el producto');
      queryClient.setQueryData(['products', dateOption], context?.previousItems);
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
            Esta acción no se puede deshacer. Borrará permanentemente el producto y eliminará sus datos de nuestros servidores.
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
