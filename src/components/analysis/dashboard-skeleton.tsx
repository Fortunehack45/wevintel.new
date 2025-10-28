
'use client';
import { Skeleton } from "@/components/ui/skeleton";
import type { AnalysisResult } from "@/lib/types";
import { Card, CardContent, CardHeader } from "../ui/card";
import { OverviewCard } from "./overview-card";
import { SummaryCard } from "./summary-card";

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

function TrafficPlaceholder() {
    return (
        <Card className="glass-card h-full min-h-[300px]">
            <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4 py-4">
                    <Skeleton className="h-10 w-1/2 mx-auto" />
                    <Skeleton className="h-4 w-1/3 mx-auto" />
                    <div className="pt-4">
                        <Skeleton className="h-8 w-full mt-4" />
                        <Skeleton className="h-8 w-full mt-4" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function AuditPlaceholder() {
    return (
      <Card className="h-full glass-card min-h-[420px]">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4 py-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-[300px] w-full mt-4" />
          </div>
        </CardContent>
      </Card>
    )
  }

function SummaryPlaceholder() {
    return (
        <Card className="glass-card h-full min-h-[300px]">
            <CardHeader>
                <Skeleton className="h-6 w-44 mb-2" />
                <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4 py-4">
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-6" />
                    <Skeleton className="h-4 w-1/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                </div>
            </CardContent>
        </Card>
    )
}

function TechStackPlaceholder() {
    return (
        <Card className="glass-card h-full min-h-[220px]">
            <CardHeader>
                <Skeleton className="h-6 w-44 mb-2" />
                <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 py-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            </CardContent>
        </Card>
    )
}


function DashboardSkeleton({ initialData }: { initialData?: Partial<AnalysisResult> }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {initialData?.overview ? (
        <div className="col-span-2 lg:col-span-4">
            <OverviewCard 
                data={initialData.overview} 
                isLoading={true} 
            />
        </div>
      ) : (
        <Skeleton className="h-40 rounded-xl col-span-2 lg:col-span-4" />
      )}
      <div className="col-span-2"><SummaryPlaceholder /></div>
      <div className="col-span-2"><TrafficPlaceholder/></div>
      <div className="col-span-2 lg:col-span-4"><PerformancePlaceholder /></div>
      <div className="col-span-2 lg:col-span-4"><TechStackPlaceholder /></div>
      <Skeleton className="h-48 rounded-xl col-span-1" />
      <Skeleton className="h-48 rounded-xl col-span-1" />
      <Skeleton className="h-48 rounded-xl col-span-1" />
      <Skeleton className="h-48 rounded-xl col-span-1" />
      <div className="col-span-2 lg:col-span-4"><Skeleton className="h-48 rounded-xl" /></div>
      <div className="col-span-2"><AuditPlaceholder /></div>
      <div className="col-span-2"><AuditPlaceholder /></div>
      <Skeleton className="h-64 rounded-xl col-span-2 lg:col-span-4" />
    </div>
  );
}

DashboardSkeleton.PerformancePlaceholder = PerformancePlaceholder;
DashboardSkeleton.ScorePlaceholder = ScorePlaceholder;
DashboardSkeleton.TrafficPlaceholder = TrafficPlaceholder;
DashboardSkeleton.AuditPlaceholder = AuditPlaceholder;
DashboardSkeleton.SummaryPlaceholder = SummaryPlaceholder;
DashboardSkeleton.TechStackPlaceholder = TechStackPlaceholder;

export { DashboardSkeleton };
