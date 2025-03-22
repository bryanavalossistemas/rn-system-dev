import { ChevronDown, DownloadIcon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { exportToExcel } from '@/lib/utils';
import { columnas, columnsToExport, dateRange } from '@/components/admin/dashboard/categories/constants';
import { Table } from '@tanstack/react-table';
import useStore from '@/store';
import { useSearchParams } from 'react-router';

interface TableHeadingProps<T> {
  table: Table<T>;
  data: T[];
}

export default function TableHeading<T>({ table, data }: TableHeadingProps<T>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { dateOptionCategories: dateOption } = useStore();

  const setDateOptionParam = (newDateOption: string) => {
    if (newDateOption === 'always') {
      searchParams.delete('date-option');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ 'date-option': newDateOption });
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
        <Select value={dateOption} onValueChange={setDateOptionParam}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {dateRange.map((dateOption) => (
              <SelectItem key={dateOption.id} value={dateOption.value}>
                {dateOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columnas <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {columnas[column.id]}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex-1 flex gap-2 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            id="search"
            type="search"
            placeholder="Buscar categoría"
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
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
