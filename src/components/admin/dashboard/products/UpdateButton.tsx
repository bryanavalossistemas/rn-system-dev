import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import UpdateForm from '@/components/admin/dashboard/products/UpdateForm';
import { Product } from '@/schemas/products';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '@/hooks/useCategories';
import { useBrands } from '@/hooks/useBrands';

interface UpdateButtonProps {
  item: Product;
}

export default function UpdateButton({ item }: UpdateButtonProps) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

  const { data: brands = [], isLoading: isLoadingBrands } = useBrands();

  if (isLoadingCategories || isLoadingBrands) {
    return (
      <>
        <Skeleton className="w-9 h-9 sm:hidden" />
        <Skeleton className="w-[86.83px] h-9 hidden sm:block" />
      </>
    );
  }

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
            <DrawerTitle>Editar producto</DrawerTitle>
            <DrawerDescription>Actualiza el formulario para editar el producto</DrawerDescription>
          </DrawerHeader>
          <UpdateForm setOpen={setOpenDrawer} item={item} categories={categories} brands={brands} />
        </DrawerContent>
      </Drawer>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button className="hidden sm:flex">
            <span>Editar</span>
            <PencilIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-md max-h-[95svh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Editar producto</DialogTitle>
            <DialogDescription>Actualiza el formulario para editar el producto</DialogDescription>
          </DialogHeader>
          <UpdateForm setOpen={setOpenDialog} item={item} categories={categories} brands={brands} />
        </DialogContent>
      </Dialog>
    </>
  );
}
