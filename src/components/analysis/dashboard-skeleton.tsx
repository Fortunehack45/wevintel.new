
'use client';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "../ui/card";

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


export function DashboardSkeleton({initialData}: {initialData?: any}) {
    if (initialData) {
        return (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="col-span-1 md:col-span-2 lg:col-span-4">
                    <Card className="glass-card h-full">
                        <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4 space-y-0">
                            <Skeleton className="h-16 w-16 rounded-lg" />
                            <div className='flex-1 min-w-0 space-y-2'>
                                <Skeleton className="h-8 w-3/4" />
                                <Skeleton className="h-5 w-1/2" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-4">
                           <div className="space-y-3">
                               <Skeleton className="h-5 w-full" />
                               <Skeleton className="h-5 w-1/2" />
                           </div>
                           <div className="space-y-3">
                               <Skeleton className="h-5 w-1/4" />
                               <Skeleton className="h-5 w-1/3" />
                           </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-1 md:col-span-2"><SummaryPlaceholder /></div>
                <div className="col-span-1 md:col-span-2"><TrafficPlaceholder /></div>
                <div className="col-span-1 md:col-span-2 lg:col-span-4"><PerformancePlaceholder /></div>
                <div className="col-span-1 md:col-span-2 lg:col-span-4"><TechStackPlaceholder /></div>
                <div className="col-span-1"><Card className="h-full"><CardContent className="pt-6"><Skeleton className="h-32 w-full"/></CardContent></Card></div>
                <div className="col-span-1"><Card className="h-full"><CardContent className="pt-6"><Skeleton className="h-32 w-full"/></CardContent></Card></div>
                <div className="col-span-1"><Card className="h-full"><CardContent className="pt-6"><Skeleton className="h-32 w-full"/></CardContent></Card></div>
                <div className="col-span-1"><ScorePlaceholder /></div>
                <div className="col-span-1 md:col-span-2"><Card className="h-full"><CardContent className="pt-6"><Skeleton className="h-48 w-full"/></CardContent></Card></div>
                <div className="col-span-1 md:col-span-2"><AuditPlaceholder /></div>
                <div className="col-span-1 md:col-span-2 lg:col-span-4"><Card className="h-full"><CardContent className="pt-6"><Skeleton className="h-64 w-full"/></CardContent></Card></div>
            </div>
        )
    }

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
         <div className="mb-12 space-y-4">
            <div>
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-6 w-3/4 mt-2" />
            </div>
            <Skeleton className="h-16 w-full max-w-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
        </div>
         <div>
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    </div>
  );
}

DashboardSkeleton.PerformancePlaceholder = PerformancePlaceholder;
DashboardSkeleton.ScorePlaceholder = ScorePlaceholder;
DashboardSkeleton.TrafficPlaceholder = TrafficPlaceholder;
DashboardSkeleton.AuditPlaceholder = AuditPlaceholder;
DashboardSkeleton.SummaryPlaceholder = SummaryPlaceholder;
DashboardSkeleton.TechStackPlaceholder = TechStackPlaceholder;

    
