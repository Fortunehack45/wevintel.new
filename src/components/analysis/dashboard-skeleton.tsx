

'use client';
import { Skeleton } from "@/components/ui/skeleton";
import type { AnalysisResult } from "@/lib/types";
import { Card, CardContent, CardHeader } from "../ui/card";
import { OverviewCard } from "./overview-card";

function PerformancePlaceholder() {
    return (
        <Card className="glass-card h-full">
            <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4 py-4">
                    <Skeleton className="h-[180px] w-full" />
                    <div className="border-t pt-4 mt-4 space-y-3">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function ScorePlaceholder() {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
            <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-24" />
        </CardContent>
      </Card>
    )
}


function DashboardSkeleton({ initialData }: { initialData?: Partial<AnalysisResult> }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {initialData?.overview ? (
        <div className="lg:col-span-4">
            <OverviewCard 
                data={initialData.overview} 
                hasPerformanceRun={false} 
                isLoading={true} 
                onRunPerformance={()=>{}} 
            />
        </div>
      ) : (
        <Skeleton className="h-40 rounded-xl lg:col-span-4" />
      )}
      <Skeleton className="h-80 rounded-xl lg:col-span-2" />
      <PerformancePlaceholder />
      <Skeleton className="h-48 rounded-xl lg:col-span-2" />
      <Skeleton className="h-48 rounded-xl lg:col-span-1" />
      <ScorePlaceholder />
      <Skeleton className="h-96 rounded-xl lg:col-span-2" />
      <Skeleton className="h-96 rounded-xl lg-col-span-2" />
      <Skeleton className="h-64 rounded-xl lg:col-span-2" />
      <Skeleton className="h-64 rounded-xl lg:col-span-2" />
    </div>
  );
}

DashboardSkeleton.PerformancePlaceholder = PerformancePlaceholder;
DashboardSkeleton.ScorePlaceholder = ScorePlaceholder;

export { DashboardSkeleton };
