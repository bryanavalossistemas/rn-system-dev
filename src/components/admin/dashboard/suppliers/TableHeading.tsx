import { ChevronDown, DownloadIcon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { exportToExcel } from '@/lib/utils';
import { columns, columnsToExport, dateOptions } from '@/components/admin/dashboard/suppliers/constants';
import { Table } from '@tanstack/react-table';
import { useSearchParams } from 'react-router';

interface TableHeadingProps<T> {
  table: Table<T>;
  data: T[];
}

export default function TableHeading<T>({ table, data }: TableHeadingProps<T>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const date = searchParams.get('date');

  const onChangeDate = (date: string | null) => {
    if (date === null) {
      searchParams.delete('date');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ date: date });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row-reverse gap-2">
      <div className="flex gap-2">
        <Button
          className="flex-1 h-9 sm:w-auto sm:h-9"
          onClick={async () => {
            const dataToExport = table.getSelectedRowModel().rows.length === 0 ? data : table.getSelectedRowModel().rows.map((row) => row.original);
            await exportToExcel({
              dataToExport,
              columns: columnsToExport,
            });
          }}
        >
          <span className="hidden sm:block">Excel</span>
          <DownloadIcon strokeWidth={2.5} />
        </Button>
        {/* DATERANGE OPTION */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <span>{dateOptions.find((p) => p.value === date)?.label}</span>
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {dateOptions.map((p) => (
              <DropdownMenuCheckboxItem key={p.id} checked={p.value === date} onCheckedChange={() => onChangeDate(p.value)}>
                {p.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* DISPLAY COLUMNS */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <span>Columnas</span>
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {columns[column.id]}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex-1 flex gap-2 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            type="search"
            placeholder="Buscar proveedor"
            value={table.getState().globalFilter ?? ''}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            className="pl-8"
          />
        </div>
        <Checkbox
          className="size-9 rounded-md sm:hidden"
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    </div>
  );
}
