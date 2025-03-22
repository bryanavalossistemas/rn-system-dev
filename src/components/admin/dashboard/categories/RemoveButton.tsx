import { remove } from '@/api/categories';
import { Button } from '@/components/ui/button';
import { Category } from '@/schemas/categories';
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
  id: Category['id'];
}

export default function RemoveButton({ id }: RemoveButtonProps) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const { dateOptionCategories: dateOption } = useStore();

  const { mutate, isPending } = useMutation({
    mutationFn: remove,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ['categories', dateOption] });

      const previousCategories = queryClient.getQueryData(['categories', dateOption]);

      queryClient.setQueryData(['categories', dateOption], (oldData: Category[]) => oldData.filter((category) => category.id !== id));

      setOpen(false);
      toast.success('Categoría eliminada correctamente');

      return { previousCategories };
    },
    onError: (_error, _variables, context) => {
      toast.error('Parece que hubo un error al eliminar la categoría');
      queryClient.setQueryData(['categories', dateOption], context?.previousCategories);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', dateOption] });
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
            Esta acción no se puede deshacer. Borrará permanentemente la categoría y eliminará sus datos de nuestros servidores.
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
