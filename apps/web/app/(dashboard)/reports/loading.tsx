import { Skeleton } from '@/components/ui/skeleton';

export default function ReportsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
