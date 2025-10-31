
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


<<<<<<< HEAD
<<<<<<< HEAD
export function DashboardSkeleton() {
=======
function DashboardSkeleton() {
>>>>>>> 33068c5 (Add more sections to the dashboard page like sponsores, users reviews et)
=======
export function DashboardSkeleton() {
>>>>>>> 22268db (The sections you said you add is not showing at all in the dashboard pag)
  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
         <div className="mb-12 space-y-4">
            <div>
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-6 w-3/4 mt-2" />
            </div>
<<<<<<< HEAD
<<<<<<< HEAD
            <Skeleton className="h-16 w-full max-w-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <Skeleton className="h-40 w-full" />
<<<<<<< HEAD
            <Skeleton className="h-40 w-full" />
        </div>
         <div>
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
=======
            <Skeleton className="h-16 w-full max-w-xl mx-auto" />
=======
            <Skeleton className="h-16 w-full max-w-xl" />
>>>>>>> 5a305cc (Add sponsor section and user review section to the dashboard page. For t)
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
=======
>>>>>>> 64d694d (Please let the skeleton loading animation be accurate it's not that it w)
            <Skeleton className="h-40 w-full" />
        </div>
         <div>
            <Skeleton className="h-8 w-48 mb-6" />
<<<<<<< HEAD
            <Skeleton className="h-64 w-full" />
>>>>>>> 33068c5 (Add more sections to the dashboard page like sponsores, users reviews et)
=======
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
>>>>>>> 64d694d (Please let the skeleton loading animation be accurate it's not that it w)
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
<<<<<<< HEAD
<<<<<<< HEAD

    
=======
>>>>>>> 22268db (The sections you said you add is not showing at all in the dashboard pag)
=======

    
>>>>>>> 64d694d (Please let the skeleton loading animation be accurate it's not that it w)
