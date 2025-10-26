
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { HostingInfo } from '@/lib/types';
import { Server } from 'lucide-react';

export function HostingCard({ data }: { data: HostingInfo }) {
  return (
    <Card className="h-full">
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
