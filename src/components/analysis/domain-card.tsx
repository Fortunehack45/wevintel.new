
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { DomainData } from '@/lib/types';
import { Globe2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { format, parseISO } from 'date-fns';

const DetailRow = ({ label, value }: { label: string; value?: string | string[] }) => {
  if (!value) return null;
  const displayValue = Array.isArray(value) ? value.join(', ') : value;
  
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'PPP');
    } catch (e) {
      return dateString;
    }
  }
  
  const isDate = ['Creation Date', 'Expiration Date', 'Updated Date'].includes(label);

  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="font-semibold text-sm">{isDate ? formatDate(displayValue) : displayValue}</span>
    </div>
  );
};


export function DomainCard({ data }: { data?: DomainData }) {
  if (!data) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe2 className="h-5 w-5 text-primary" />
          Domain Info
        </CardTitle>
        <CardDescription>Public registration details (Whois).</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm">
        <DetailRow label="Registrar" value={data.registrar} />
        <DetailRow label="Creation Date" value={data.creationDate} />
        <DetailRow label="Expiration Date" value={data.expirationDate} />
        <DetailRow label="Nameservers" value={data.nameservers} />
      </CardContent>
    </Card>
  );
}
