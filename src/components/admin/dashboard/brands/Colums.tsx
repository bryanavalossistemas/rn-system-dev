import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDownIcon } from 'lucide-react';
import { TableCell, TableHead } from '@/components/ui/table';
import { Brand } from '@/schemas/brands';
import { Checkbox } from '@/components/ui/checkbox';
import UpdateButtonDesktop from '@/components/admin/dashboard/brands/UpdateButtonDesktop';
import RemoveButton from '@/components/admin/dashboard/brands/RemoveButton';

export const columns: ColumnDef<Brand>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <TableHead className="w-fit">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </TableHead>
    ),
    cell: ({ row }) => (
      <TableCell className="w-fit">
        <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
      </TableCell>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <TableHead className="w-fit">
          <div className="inline-flex items-center gap-x-1 cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            <span>ID</span>
            <ArrowUpDownIcon size={16} />
          </div>
        </TableHead>
      );
    },
    cell: ({ row }) => (
      <TableCell className="w-fit">
        <div className="lowercase">{row.getValue('id')}</div>
      </TableCell>
    ),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <TableHead className="w-full">
          <div className="inline-flex items-center gap-x-1 cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            <span>Nombre</span>
            <ArrowUpDownIcon size={16} />
          </div>
        </TableHead>
      );
    },
    cell: ({ row }) => (
      <TableCell className="w-full">
        <div className="lowercase">{row.getValue('name')}</div>
      </TableCell>
    ),
  },
  {
    id: 'action',
    header: () => {
      return <TableHead />;
    },
    cell: ({ row }) => (
      <TableCell className="w-fit">
        <div className="flex gap-2 justify-end">
          <UpdateButtonDesktop item={row.original} />
          <RemoveButton id={row.getValue('id')} />
        </div>
      </TableCell>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
