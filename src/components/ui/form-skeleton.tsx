import { Skeleton } from '@/components/ui/skeleton';

export default function FormSkeleton({ fields }: { fields: number }) {
  const nFields = Array.from({ length: fields }, (_, index) => index + 1);

  return (
    <div className="p-2">
      <div className="grid gap-6">
        {nFields.map((field) => (
          <div key={field} className="grid gap-2">
            <Skeleton className="w-1/2 h-4" />
            <div>
              <Skeleton className="w-full h-9" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row-reverse gap-2 mt-2 sm:mt-4">
        <Skeleton className="w-full h-9" />
        <Skeleton className="w-full h-9" />
      </div>
    </div>
  );
}
