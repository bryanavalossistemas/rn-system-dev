import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDownIcon, ImageIcon } from 'lucide-react';
import { TableCell, TableHead } from '@/components/ui/table';
import { Product } from '@/schemas/products';
import { Checkbox } from '@/components/ui/checkbox';
import RemoveButton from '@/components/admin/dashboard/products/RemoveButton';
import { formatCurrency } from '@/lib/utils';
import UpdateButton from './UpdateButton';

export const columns: ColumnDef<Product>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <TableHead>
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </TableHead>
    ),
    cell: ({ row }) => (
      <TableCell>
        <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
      </TableCell>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'images',
    header: ({ column }) => {
      return (
        <TableHead className="w-1/12 text-center">
          <div className="inline-flex items-center gap-x-1 cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            <span>Imagen</span>
            <ArrowUpDownIcon size={16} />
          </div>
        </TableHead>
      );
    },
    cell: ({ row }) => {
      if (row.original.images && row.original.images.length > 0) {
        return (
          <TableCell>
            <div className="flex justify-center">
              <div className="w-20 h-20 p-2.5">
                <img className="w-full h-full object-cover rounded-sm" src={`${row.original.images[0].path}`} />
              </div>
            </div>
          </TableCell>
        );
      } else {
        return (
          <TableCell>
            <div className="flex justify-center">
              <ImageIcon className="text-muted-foreground w-20 h-20" strokeWidth={0.8} />
            </div>
          </TableCell>
        );
      }
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <TableHead>
          <div className="inline-flex items-center gap-x-1 cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            <span>Nombre</span>
            <ArrowUpDownIcon size={16} />
          </div>
        </TableHead>
      );
    },
    cell: ({ row }) => <TableCell className="whitespace-normal">{row.original.name}</TableCell>,
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => {
      return (
        <TableHead className="text-center">
          <div className="inline-flex items-center gap-x-1 cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            <span>Stock</span>
            <ArrowUpDownIcon size={16} />
          </div>
        </TableHead>
      );
    },
    cell: ({ row }) => <TableCell className="text-center font-semibold">{row.original.stock}</TableCell>,
  },
  {
    accessorKey: 'costPrice',
    header: ({ column }) => {
      return (
        <TableHead className="text-center">
          <div className="inline-flex items-center gap-x-1 cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            <span>Costo</span>
            <ArrowUpDownIcon size={16} />
          </div>
        </TableHead>
      );
    },
    cell: ({ row }) => (
      <TableCell>
        <div className="font-semibold text-center">{formatCurrency(row.original.costPrice)}</div>
      </TableCell>
    ),
  },
  {
    accessorKey: 'salePrice',
    header: ({ column }) => {
      return (
        <TableHead className="text-center">
          <div className="inline-flex items-center gap-x-1 cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            <span>Venta</span>
            <ArrowUpDownIcon size={16} />
          </div>
        </TableHead>
      );
    },
    cell: ({ row }) => (
      <TableCell>
        <div className="font-semibold text-center">{formatCurrency(row.original.salePrice)}</div>
      </TableCell>
    ),
  },
  {
    id: 'action',
    header: () => {
      return <TableHead className="w-1/12" />;
    },
    cell: ({ row }) => (
      <TableCell>
        <div className="flex gap-2 justify-end">
          <UpdateButton item={row.original} />
          <RemoveButton id={row.original.id} />
        </div>
      </TableCell>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
