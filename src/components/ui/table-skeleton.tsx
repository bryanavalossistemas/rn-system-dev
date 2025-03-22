import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function TableSkeleton({ columns, rows, cards }: { columns: number; rows: number; cards: number }) {
  const nColumnas = Array.from({ length: columns }, (_, index) => index + 1);
  const nFilas = Array.from({ length: rows }, (_, index) => index + 1);
  const nCards = Array.from({ length: cards }, (_, index) => index + 1);

  return (
    <>
      {/* MOVIL */}
      <div className="sm:hidden mt-2">
        <div className="grid gap-2">
          <Skeleton className="w-full h-9" />
          <Skeleton className="w-full h-9" />
        </div>
        <div className="grid gap-2 mt-2">
          {nCards.map((card) => (
            <Card key={card} className="grid p-2 gap-2">
              <Skeleton className="h-16" />
              <div className="flex gap-2 justify-end">
                <Skeleton className="w-8 h-8" />
                <Skeleton className="w-8 h-8" />
              </div>
            </Card>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2">
          <Skeleton className="w-20 h-8" />
          <Skeleton className="w-20 h-8" />
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden sm:block mt-2">
        <div className="sm:flex sm:gap-2">
          <div className="flex-1">
            <Skeleton className="w-full h-9" />
          </div>
          <Skeleton className="w-28 h-9" />
        </div>
        <div className="rounded-md border mt-2">
          <Table>
            <TableHeader>
              <TableRow>
                {nColumnas.map((key) => (
                  <TableHead key={key}>
                    <Skeleton className="w-full h-6" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {nFilas.map((key) => (
                <TableRow key={key}>
                  {nColumnas.map((key) => (
                    <TableCell key={key}>
                      <Skeleton className="w-full h-9" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end gap-2 mt-2">
          <div className="flex-1 text-sm text-muted-foreground">
            <Skeleton className="hidden sm:block w-60 h-8" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="w-24 h-8" />
            <Skeleton className="w-24 h-8" />
          </div>
        </div>
      </div>
    </>
  );
}
