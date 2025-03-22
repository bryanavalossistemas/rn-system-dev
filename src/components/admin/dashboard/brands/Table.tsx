import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { findAll } from '@/api/brands';
import { Checkbox } from '@/components/ui/checkbox';
import TableSkeleton from '@/components/ui/table-skeleton';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import UpdateButton from '@/components/admin/dashboard/brands/UpdateButton';
import RemoveButton from '@/components/admin/dashboard/brands/RemoveButton';
import { columns } from '@/components/admin/dashboard/brands/Colums';
import { getDateRange } from '@/lib/utils';
import { PAGE_INDEX, PAGE_SIZE } from '@/components/admin/dashboard/brands/constants';
import TableHeading from '@/components/admin/dashboard/brands/TableHeading';
import TableBody from '@/components/admin/dashboard/brands/TableBody';
import TablePagination from '@/components/admin/dashboard/brands/TablePagination';
import { useSearchParams } from 'react-router';
import useStore from '@/store';

export function Table() {
  const [searchParams] = useSearchParams();

  const { dateOptionBrands: dateOption, setDateOptionBrands: setDateOption } = useStore();

  useEffect(() => {
    const dateOptionParam = searchParams.get('date-option');
    if (dateOptionParam) {
      setDateOption(dateOptionParam);
    } else {
      setDateOption('always');
    }
  }, [searchParams, setDateOption]);

  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['brands', dateOption],
    queryFn: () => findAll(getDateRange({ dateOption })),
    meta: {
      persist: true,
    },
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: PAGE_INDEX,
    pageSize: localStorage.getItem('pageSize') ? +localStorage.getItem('pageSize')! : PAGE_SIZE,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  if (isLoading) {
    return <TableSkeleton columns={2} rows={8} cards={3} />;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="mt-2">
      {/* Table Heading */}
      <TableHeading table={table} data={data} />

      {/* Table Body Movil */}
      <div className="sm:hidden grid gap-2 mt-2">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <Card key={row.original.id} className={`p-2 gap-2 ${row.getIsSelected() && 'bg-muted'}`}>
              <div className="flex flex-col gap-2">
                <Label>
                  <Checkbox
                    className="size-6"
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                  />
                  <span className="font-medium">{row.original.name}</span>
                </Label>
                <div>
                  <div className="text-sm text-gray-600">ID: {row.original.id}</div>
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
