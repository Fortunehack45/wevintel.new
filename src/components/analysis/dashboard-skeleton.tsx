
'use client';
import { Skeleton } from "@/components/ui/skeleton";
import type { AnalysisResult } from "@/lib/types";
import { OverviewCard } from "./overview-card";

export function DashboardSkeleton({ initialData }: { initialData?: Partial<AnalysisResult> }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {initialData?.overview ? (
        <div className="lg:col-span-4">
            <OverviewCard data={initialData.overview} />
        </div>
      ) : (
        <Skeleton className="h-40 rounded-xl lg:col-span-4" />
      )}
      <Skeleton className="h-80 rounded-xl lg:col-span-4" />
      <Skeleton className="h-48 rounded-xl lg:col-span-2" />
      <Skeleton className="h-48 rounded-xl lg:col-span-1" />
      <Skeleton className="h-48 rounded-xl lg:col-span-1" />
      <Skeleton className="h-96 rounded-xl lg:col-span-2" />
      <Skeleton className="h-96 rounded-xl lg:col-span-2" />
      <Skeleton className="h-64 rounded-xl lg:col-span-2" />
      <Skeleton className="h-64 rounded-xl lg:col-span-2" />
    </div>
  );
}
