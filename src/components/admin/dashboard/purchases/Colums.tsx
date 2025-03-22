import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDownIcon } from 'lucide-react';
import { TableCell, TableHead } from '@/components/ui/table';
import { Purchase } from '@/schemas/purchases';
import { Checkbox } from '@/components/ui/checkbox';
import RemoveButton from '@/components/admin/dashboard/purchases/RemoveButton';
import UpdateButton from './UpdateButton';
import { formatCurrency, formatDate } from '@/lib/utils';

export const columns: ColumnDef<Purchase>[] = [
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
    accessorKey: 'document.documentNumber',
    header: ({ column }) => {
      return (
        <TableHead>
          <div className="inline-flex items-center gap-x-1 cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            <span>N° Documento</span>
            <ArrowUpDownIcon size={16} />
          </div>
        </TableHead>
      );
    },
    cell: ({ row }) => (
      <TableCell className="whitespace-normal">
        {row.original.document?.documentSerie} - {row.original.document?.documentNumber}
      </TableCell>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <TableHead className='text-left'>
          <div className="inline-flex items-center gap-x-1 cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            <span>Fecha</span>
            <ArrowUpDownIcon size={16} />
          </div>
        </TableHead>
      );
    },
    cell: ({ row }) => <TableCell className="whitespace-normal text-left">{formatDate({ date: new Date(row.original.createdAt ?? Date.now()) })}</TableCell>,
  },
  {
    accessorKey: 'supplierName',
    header: ({ column }) => {
      return (
        <TableHead>
          <div className="inline-flex items-center gap-x-1 cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            <span>Proveedor</span>
            <ArrowUpDownIcon size={16} />
          </div>
        </TableHead>
      );
    },
    cell: ({ row }) => <TableCell className="whitespace-normal">{row.original.supplierName}</TableCell>,
  },
  {
    accessorKey: 'supplierDocument',
    header: ({ column }) => {
      return (
        <TableHead className="text-left">
          <div className="inline-flex items-center gap-x-1 cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            <span>RUC / DNI</span>
            <ArrowUpDownIcon size={16} />
          </div>
        </TableHead>
      );
    },
    cell: ({ row }) => <TableCell className="whitespace-normal text-left">{row.original.supplierDocument}</TableCell>,
  },
  {
    accessorKey: 'document.total',
    header: ({ column }) => {
      return (
        <TableHead className="text-left">
          <div className="inline-flex items-center gap-x-1 cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            <span>Total</span>
            <ArrowUpDownIcon size={16} />
          </div>
        </TableHead>
      );
    },
    cell: ({ row }) => <TableCell className="whitespace-normal text-left">{formatCurrency(row.original.document?.total ?? 0)}</TableCell>,
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
