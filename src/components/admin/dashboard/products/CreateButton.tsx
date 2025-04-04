import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { PlusIcon } from 'lucide-react';
import CreateForm from '@/components/admin/dashboard/products/CreateForm';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '@/hooks/useCategories';
import { useBrands } from '@/hooks/useBrands';
import { useMeasurementUnits } from '@/hooks/useMeasurementUnits';

interface CreateButtonProps {
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | null | undefined;
}

export default function CreateButton({ className, variant }: CreateButtonProps) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

  const { data: brands = [], isLoading: isLoadingBrands } = useBrands();

  const { data: measurementUnits = [], isLoading: isLoadingMeasurementUnits } = useMeasurementUnits();

  if (isLoadingCategories || isLoadingBrands || isLoadingMeasurementUnits) {
    return (
      <>
        <Skeleton className="w-full h-9 sm:hidden" />
        <Skeleton className="hidden sm:inline-flex w-44 h-9" />
      </>
    );
  }

  return (
    <>
      {/* MOBILE */}
      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerTrigger asChild>
          <Button className="sm:hidden w-full">
            <PlusIcon strokeWidth={3} />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Nuevo Producto</DrawerTitle>
            <DrawerDescription>Rellene el formulario para crear un producto</DrawerDescription>
          </DrawerHeader>
          <CreateForm categories={categories} brands={brands} measurementUnits={measurementUnits} setOpen={setOpenDrawer} />
        </DrawerContent>
      </Drawer>

      {/* DESKTOP */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button className={`hidden sm:inline-flex ${className}`} variant={variant ?? 'default'}>
            <span>Añadir Producto</span>
            <PlusIcon strokeWidth={3} />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-md max-h-[95svh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Nuevo Producto</DialogTitle>
            <DialogDescription>Rellene el formulario para crear un producto</DialogDescription>
          </DialogHeader>
          <CreateForm categories={categories} brands={brands} measurementUnits={measurementUnits} setOpen={setOpenDialog} />
        </DialogContent>
      </Dialog>
    </>
  );
}
