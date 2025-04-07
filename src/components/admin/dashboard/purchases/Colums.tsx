import { createColumnHelper } from '@tanstack/react-table';
import { ArrowUpDownIcon } from 'lucide-react';
import { Purchase } from '@/schemas/purchases';
import { Checkbox } from '@/components/ui/checkbox';
import RemoveButton from '@/components/admin/dashboard/purchases/RemoveButton';
import UpdateButton from '@/components/admin/dashboard/purchases/UpdateButton';
import { formatCurrency, formatDate } from '@/lib/utils';

const columnHelper = createColumnHelper<Purchase>();

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

  columnHelper.accessor('voucher.documentType', {
    header: ({ column }) => (
      <div className="flex items-center gap-1 cursor-pointer w-fit" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        <span>Tipo de Comprobante</span>
        <ArrowUpDownIcon className="size-4" />
      </div>
    ),
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor('voucher.serie', {
    header: ({ column }) => (
      <div className="flex items-center gap-1 cursor-pointer w-fit" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        <span>Serie</span>
        <ArrowUpDownIcon className="size-4" />
      </div>
    ),
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor('voucher.number', {
    header: ({ column }) => (
      <div className="flex items-center gap-1 cursor-pointer w-fit" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        <span>Número</span>
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

  columnHelper.accessor('supplier.name', {
    header: ({ column }) => (
      <div className="flex items-center gap-1 cursor-pointer w-fit" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        <span>Proveedor</span>
        <ArrowUpDownIcon className="size-4" />
      </div>
    ),
    cell: (info) => <div className="whitespace-normal">{info.getValue()}</div>,
  }),

  columnHelper.accessor('voucher.total', {
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
