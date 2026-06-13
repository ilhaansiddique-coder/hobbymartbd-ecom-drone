import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div>
      <Skeleton className="h-[500px] w-full rounded-none" />
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <Skeleton className="mx-auto mb-8 h-8 w-64" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
        <Skeleton className="mb-8 h-8 w-48" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border p-4">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <Skeleton className="mt-4 h-4 w-3/4" />
              <Skeleton className="mt-2 h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
