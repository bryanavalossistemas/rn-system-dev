import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDownIcon } from 'lucide-react';
import { TableCell, TableHead } from '@/components/ui/table';
import { Supplier } from '@/schemas/suppliers';
import { Checkbox } from '@/components/ui/checkbox';
import RemoveButton from '@/components/admin/dashboard/suppliers/RemoveButton';
import UpdateButton from './UpdateButton';

export const columns: ColumnDef<Supplier>[] = [
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
    accessorKey: 'type',
    header: ({ column }) => {
      return (
        <TableHead className="text-left">
          <div className="inline-flex items-center gap-x-1 cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            <span>Tipo</span>
            <ArrowUpDownIcon size={16} />
          </div>
        </TableHead>
      );
    },
    cell: ({ row }) => <TableCell className="text-left font-semibold capitalize">{row.original.type}</TableCell>,
  },
  {
    accessorKey: 'document',
    header: ({ column }) => {
      return (
        <TableHead className="text-left">
          <div className="inline-flex gap-x-1 cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            <span>Número</span>
            <ArrowUpDownIcon size={16} />
          </div>
        </TableHead>
      );
    },
    cell: ({ row }) => <TableCell className="text-left font-semibold">{row.original.document}</TableCell>,
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
