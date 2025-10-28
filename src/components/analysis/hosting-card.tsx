
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { HostingInfo } from '@/lib/types';
import { Server } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

export function HostingCard({ data }: { data?: HostingInfo }) {
  if (!data) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent className="grid gap-4 text-sm pt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Server className="h-5 w-5 text-primary" />
          Hosting
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm pt-2">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs">IP Address</span>
          <span className="font-semibold font-mono">{data.ip || 'N/A'}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs">ISP</span>
          <span className="font-semibold">{data.isp || 'N/A'}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs">Country</span>
          <span className="font-semibold">{data.country || 'N/A'}</span>
        </div>
      </CardContent>
    </Card>
  );
}
