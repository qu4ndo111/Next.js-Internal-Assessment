import { Skeleton } from "@/src/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <Skeleton className="h-10 w-[120px]" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    </div>
  )
}
