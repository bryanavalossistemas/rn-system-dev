import { createColumnHelper } from '@tanstack/react-table';
import { ArrowUpDownIcon } from 'lucide-react';
import { Category } from '@/schemas/categories';
import { Checkbox } from '@/components/ui/checkbox';
import RemoveButton from '@/components/admin/dashboard/categories/RemoveButton';
import UpdateButton from '@/components/admin/dashboard/categories/UpdateButton';

const columnHelper = createColumnHelper<Category>();

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

  columnHelper.accessor('image', {
    header: () => (
      <div className="flex items-center gap-1 justify-center">
        <span>Imagen</span>
        <ArrowUpDownIcon className="size-4" />
      </div>
    ),
    cell: (info) => {
      const image = info.getValue();
      if (image) {
        return (
          <div className="flex justify-center">
            <div className="w-20 h-20">
              <img
                className="w-full h-full object-cover rounded-sm"
                src={`${import.meta.env.VITE_API_URL}/${image}`}
                onError={(e) => {
                  const img = e.target;
                  if (img instanceof HTMLImageElement) {
                    img.onerror = null;
                    img.src = image;
                  }
                }}
              />
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
    cell: (info) => info.getValue(),
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
