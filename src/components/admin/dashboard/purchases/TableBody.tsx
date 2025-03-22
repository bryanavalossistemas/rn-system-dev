import { flexRender, Table } from '@tanstack/react-table';
import { Table as TableUi, TableBody as TableBodyUi, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Fragment } from 'react';
import { columns } from '@/components/admin/dashboard/suppliers/Colums';

interface TableBodyProps<T> {
  table: Table<T>;
}

export default function TableBody<T>({ table }: TableBodyProps<T>) {
  return (
    <div className="hidden sm:block rounded-md border mt-2">
      <TableUi>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Fragment key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</Fragment>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBodyUi>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <Fragment key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Fragment>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Sin resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBodyUi>
      </TableUi>
    </div>
  );
}
