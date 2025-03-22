import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function CardSkeleton({ cards }: { cards: number }) {
  const nCards = Array.from({ length: cards }, (_, index) => index + 1);

  return (
    <>
      <div className="mt-2">
        <div className="grid gap-2">
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
    </>
  );
}
