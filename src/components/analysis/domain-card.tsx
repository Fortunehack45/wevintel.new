
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { DomainData } from '@/lib/types';
import { Globe2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { format, parseISO } from 'date-fns';

const DetailRow = ({ label, value }: { label: string; value?: string | string[] }) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  
  const displayValue = Array.isArray(value) ? value.join(', ') : value;
  
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'PPP p');
    } catch (e) {
      return dateString;
    }
  }
  
  const isDate = ['Creation Date', 'Expiration Date', 'Updated Date'].includes(label);

  return (
    <div className="flex flex-col gap-1 py-3 border-b last:border-b-0">
      <span className="text-muted-foreground text-xs font-medium">{label}</span>
      <span className="font-semibold text-sm break-words">{isDate ? formatDate(displayValue) : displayValue}</span>
    </div>
  );
};


export function DomainCard({ data }: { data?: DomainData }) {
  const cardContent = (
    !data ? (
        <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
        </div>
    ) : (
       <>
            <DetailRow label="Registrar" value={data.registrar} />
            <DetailRow label="Creation Date" value={data.creationDate} />
            <DetailRow label="Expiration Date" value={data.expirationDate} />
            <DetailRow label="Last Updated Date" value={data.updatedDate} />
            <DetailRow label="Domain Status" value={data.status} />
            <DetailRow label="Nameservers" value={data.nameservers} />
       </>
    )
  )

  return (
    <Card className="h-full glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe2 className="h-5 w-5 text-primary" />
          WHOIS Information
        </CardTitle>
        <CardDescription>Public domain registration details.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-1 text-sm">
        {cardContent}
      </CardContent>
    </Card>
  );
}
