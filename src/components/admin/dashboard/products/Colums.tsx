import { createColumnHelper } from '@tanstack/react-table';
import { ArrowUpDownIcon } from 'lucide-react';
import { Product } from '@/schemas/products';
import { Checkbox } from '@/components/ui/checkbox';
import RemoveButton from '@/components/admin/dashboard/products/RemoveButton';
import { formatCurrency } from '@/lib/utils';
import UpdateButton from '@/components/admin/dashboard/products/UpdateButton';

const columnHelper = createColumnHelper<Product>();

export const columns = [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableHiding: false,
  }),

  columnHelper.accessor('images', {
    header: () => (
      <div className="flex items-center gap-1 justify-center">
        <span>Imagen</span>
        <ArrowUpDownIcon className="size-4" />
      </div>
    ),
    cell: (info) => {
      const images = info.getValue();
      if (images && images.length > 0) {
        return (
          <div className="flex justify-center">
            <div className="w-20 h-20">
              <img className="w-full h-full object-cover rounded-sm" src={`${images[0].path}`} />
            </div>
          </div>
        );
      } else {
        return (
          <div className="flex justify-center">
            <div className="w-20 h-20">
              <img className="w-full h-full object-cover rounded-sm" src="/placeholder.svg" />
            </div>
          </div>
        );
      }
    },
    enableSorting: false,
  }),

  columnHelper.accessor('name', {
    header: ({ column }) => (
      <div className="flex items-center gap-1 cursor-pointer w-fit" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        <span>Nombre</span>
        <ArrowUpDownIcon className="size-4" />
      </div>
    ),
    cell: (info) => <div className="whitespace-normal">{info.getValue()}</div>,
  }),

  columnHelper.accessor('stock', {
    header: ({ column }) => (
      <div className="flex justify-center">
        <div className="flex items-center gap-1 cursor-pointer w-fit" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Stock</span>
          <ArrowUpDownIcon className="size-4" />
        </div>
      </div>
    ),
    cell: (info) => <div className="flex justify-center">{info.getValue()}</div>,
  }),

  columnHelper.accessor('costPrice', {
    header: ({ column }) => (
      <div className="flex justify-end">
        <div className="flex items-center gap-1 cursor-pointer w-fit" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Costo</span>
          <ArrowUpDownIcon className="size-4" />
        </div>
      </div>
    ),
    cell: (info) => <div className="flex justify-end">{formatCurrency(info.getValue())}</div>,
  }),

  columnHelper.accessor('salePrice', {
    header: ({ column }) => (
      <div className="flex justify-end">
        <div className="flex items-center gap-1 cursor-pointer w-fit" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Venta</span>
          <ArrowUpDownIcon className="size-4" />
        </div>
      </div>
    ),
    cell: (info) => <div className="flex justify-end">{formatCurrency(info.getValue())}</div>,
  }),

  columnHelper.display({
    id: 'action',
    cell: ({ row }) => (
      <div className="flex gap-2 justify-end">
        <UpdateButton item={row.original} />
        <RemoveButton id={row.original.id} />
      </div>
    ),
    enableHiding: false,
  }),
];
