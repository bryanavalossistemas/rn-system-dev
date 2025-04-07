import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import TableSkeleton from '@/components/ui/table-skeleton';
import { Card } from '@/components/ui/card';
import UpdateButton from '@/components/admin/dashboard/purchases/UpdateButton';
import RemoveButton from '@/components/admin/dashboard/purchases/RemoveButton';
import { columns } from '@/components/admin/dashboard/purchases/Colums';
import TableHeading from '@/components/admin/dashboard/purchases/TableHeading';
import TableBody from '@/components/admin/dashboard/purchases/TableBody';
import TablePagination from '@/components/admin/dashboard/purchases/TablePagination';
import { pageSize } from '@/components/admin/dashboard/purchases/constants';
import { usePurchases } from '@/hooks/usePurchases';

export function Table() {
  const { data = [], isLoading } = usePurchases();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination: pagination,
    },
    onPaginationChange: setPagination,
  });

  if (isLoading) {
    return <TableSkeleton columns={2} rows={8} cards={3} />;
  }

  return (
    <div className="mt-2">
      {/* Table Heading */}
      <TableHeading table={table} data={data} />

      {/* Table Body Movil */}
      <div className="sm:hidden grid gap-2 mt-2">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <Card key={row.original.id} className={`text-sm p-2 gap-2 ${row.getIsSelected() && 'bg-muted'}`}>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <Checkbox
                    className="size-6"
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                  />
                  <span className="font-medium">{row.original.supplier.name}</span>
                </div>
                <div className="text-gray-600 flex flex-col gap-0.5">
                  <div>Proveedor: {row.original.supplier.name}</div>
                  <div>N° Documento: {row.original.voucher.number}</div>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <UpdateButton item={row.original} />
                <RemoveButton id={row.original.id} />
              </div>
            </Card>
          ))
        ) : (
          <h1 className="text-center text-xl">Sin resultados</h1>
        )}
      </div>

      {/* Table Body Desktop */}
      <TableBody table={table} />

      {/* Table Pagination */}
      <TablePagination table={table} />
    </div>
  );
}
