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
import { useSearchParams } from 'react-router';

interface RemoveButtonProps {
  id: Brand['id'];
}

export default function RemoveButton({ id }: RemoveButtonProps) {
  const [open, setOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: remove,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: date === null ? ['categories'] : ['categories', date] });

      const previousItems = queryClient.getQueryData(date === null ? ['categories'] : ['categories', date]);

      queryClient.setQueryData(date === null ? ['categories'] : ['categories', date], (oldItems: Brand[]) =>
        oldItems.filter((item) => item.id !== id),
      );

      setOpen(false);
      toast.success('Marca eliminada correctamente');

      return { previousItems };
    },
    onError: (error, _variables, context) => {
      toast.error(error.message);
      queryClient.setQueryData(date === null ? ['categories'] : ['categories', date], context?.previousItems);
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
      <AlertDialogContent className="max-w-[calc(100%-1.5rem)] p-2 sm:p-4 sm:w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Borrará permanentemente la marca y eliminará sus datos de nuestros servidores
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
