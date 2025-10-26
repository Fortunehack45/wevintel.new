import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { HostingInfo } from '@/lib/types';
import { Server } from 'lucide-react';

export function HostingCard({ data }: { data: HostingInfo }) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5 text-primary" />
          Hosting
        </CardTitle>
        <CardDescription>IP address and provider information.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">IP Address</span>
          <span className="font-semibold font-mono text-base">{data.ip || 'N/A'}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">ISP</span>
          <span className="font-semibold text-base">{data.isp || 'N/A'}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">Country</span>
          <span className="font-semibold text-base">{data.country || 'N/A'}</span>
        </div>
      </CardContent>
    </Card>
  );
}
