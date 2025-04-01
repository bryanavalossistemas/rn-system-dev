import { createColumnHelper } from '@tanstack/react-table';
import { ArrowUpDownIcon } from 'lucide-react';
import { Sale } from '@/schemas/sales';
import { Checkbox } from '@/components/ui/checkbox';
import RemoveButton from '@/components/admin/dashboard/sales/RemoveButton';
import UpdateButton from '@/components/admin/dashboard/sales/UpdateButton';
import { formatCurrency, formatDate } from '@/lib/utils';

const columnHelper = createColumnHelper<Sale>();

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

  columnHelper.accessor('documentNumber', {
    header: ({ column }) => (
      <div className="flex items-center gap-1 cursor-pointer w-fit" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        <span>N° Documento</span>
        <ArrowUpDownIcon className="size-4" />
      </div>
    ),
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor('createdAt', {
    header: ({ column }) => (
      <div className="flex items-center gap-1 cursor-pointer w-fit" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        <span>Fecha</span>
        <ArrowUpDownIcon className="size-4" />
      </div>
    ),
    cell: (info) => formatDate(new Date(info.getValue())),
  }),

  columnHelper.accessor('customerName', {
    header: ({ column }) => (
      <div className="flex items-center gap-1 cursor-pointer w-fit" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        <span>Proveedor</span>
        <ArrowUpDownIcon className="size-4" />
      </div>
    ),
    cell: (info) => <div className="whitespace-normal">{info.getValue()}</div>,
  }),

  columnHelper.accessor('total', {
    header: ({ column }) => (
      <div className="flex justify-end">
        <div className="flex items-center gap-1 cursor-pointer w-fit" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Total</span>
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
