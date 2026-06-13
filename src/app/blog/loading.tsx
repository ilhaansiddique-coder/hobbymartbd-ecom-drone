import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 text-center">
          <Skeleton className="mx-auto h-12 w-96" />
          <Skeleton className="mx-auto mt-4 h-6 w-128" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pt-12 lg:px-8">
        <div className="mb-16">
          <div className="grid md:grid-cols-2 overflow-hidden rounded-2xl border bg-white">
            <Skeleton className="aspect-video md:aspect-auto" />
            <div className="p-8 md:p-12 space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border bg-white">
              <Skeleton className="aspect-video w-full" />
              <div className="p-6 space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
