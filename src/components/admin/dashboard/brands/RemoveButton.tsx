import { remove } from '@/api/brands';
import { Button } from '@/components/ui/button';
import { Brand } from '@/schemas/brands';
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
  id: Brand['id'];
}

export default function RemoveButton({ id }: RemoveButtonProps) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const { dateOptionBrands: dateOption } = useStore();

  const { mutate, isPending } = useMutation({
    mutationFn: remove,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ['brands', dateOption] });

      const previousItems = queryClient.getQueryData(['brands', dateOption]);

      queryClient.setQueryData(['brands', dateOption], (oldItems: Brand[]) => oldItems.filter((item) => item.id !== id));

      setOpen(false);
      toast.success('Marca eliminada correctamente');

      return { previousItems };
    },
    onError: (_error, _variables, context) => {
      toast.error('Parece que hubo un error al eliminar la marca');
      queryClient.setQueryData(['brands', dateOption], context?.previousItems);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['brands', dateOption] });
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
            Esta acción no se puede deshacer. Borrará permanentemente la marca y eliminará sus datos de nuestros servidores.
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
