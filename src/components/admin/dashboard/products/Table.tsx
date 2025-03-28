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
import UpdateButton from '@/components/admin/dashboard/products/UpdateButton';
import RemoveButton from '@/components/admin/dashboard/products/RemoveButton';
import { columns } from '@/components/admin/dashboard/products/Colums';
import { formatCurrency } from '@/lib/utils';
import { pageSize } from '@/components/admin/dashboard/products/constants';
import TableHeading from '@/components/admin/dashboard/products/TableHeading';
import TableBody from '@/components/admin/dashboard/products/TableBody';
import TablePagination from '@/components/admin/dashboard/products/TablePagination';
import { useProducts } from '@/hooks/useProducts';

export function Table() {
  const { data = [], isLoading } = useProducts();

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
      pagination,
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
                  <span className="font-medium">{row.original.name}</span>
                </div>
                <div className="text-gray-600 flex flex-col gap-0.5">
                  <div>Stock: {row.original.stock}</div>
                  <div>Costo: {formatCurrency(row.original.costPrice)}</div>
                  <div>Venta: {formatCurrency(row.original.salePrice)}</div>
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
