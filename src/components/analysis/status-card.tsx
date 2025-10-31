
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { StatusData } from '@/lib/types';
import { Server, CheckCircle2, XCircle, Timer, Forward } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';

const StatusInfo = ({ icon: Icon, label, value, unit }: { icon: React.ElementType, label: string, value: string | number, unit?: string }) => (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">{label}</span>
      </div>
      <span className="font-semibold font-mono">{value}{unit && <span className="text-xs text-muted-foreground ml-1">{unit}</span>}</span>
    </div>
);


export function StatusCard({ data }: { data?: StatusData }) {
  if (!data) {
    return (
      <Card className="h-full glass-card">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent className="grid gap-3 text-sm pt-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Server className="h-5 w-5 text-primary" />
          Live Status
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm pt-2">
        <div className="flex justify-between items-center">
            <span className="text-muted-foreground flex items-center gap-2 text-sm"><Server className="h-4 w-4" /> Server Status</span>
            {data.isOnline ? (
                <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5"/> Online
                </Badge>
            ) : (
                <Badge variant="destructive">
                    <XCircle className="mr-1.5 h-3.5 w-3.5" /> Offline
                </Badge>
            )}
        </div>
        
        {data.httpStatus && <StatusInfo icon={CheckCircle2} label="HTTP Status" value={data.httpStatus} />}
        {data.responseTime && <StatusInfo icon={Timer} label="Response Time" value={data.responseTime} unit="ms" />}
        
        {data.finalUrl && new URL(data.finalUrl).hostname !== new URL(data.finalUrl).hostname && (
            <StatusInfo icon={Forward} label="Redirects to" value={new URL(data.finalUrl).hostname} />
        )}
      </CardContent>
    </Card>
  );
}
