
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { DomainData } from '@/lib/types';
import { Globe2, Calendar, Server, ShieldCheck, Clock, User, Building, Landmark, Hash } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import { format, parseISO, differenceInDays, formatDistanceToNowStrict } from 'date-fns';
import { Progress } from '../ui/progress';
import { useEffect, useState } from 'react';

const DetailRow = ({ icon: Icon, label, value, className }: { icon: React.ElementType, label: string; value?: string | string[] | null, className?: string }) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  
  const displayValue = Array.isArray(value) ? (
    <div className='flex flex-wrap gap-2'>
        {value.map((v, i) => <Badge key={i} variant="secondary">{v}</Badge>)}
    </div>
    ) : value;

  return (
    <div className={`flex items-start gap-4 py-3 border-t first:pt-0 last:pb-0 ${className}`}>
      <Icon className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
      <div className="flex flex-col gap-1 w-full overflow-hidden">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          <span className="font-semibold text-foreground break-words text-sm">{displayValue}</span>
      </div>
    </div>
  );
};

const DateDetailRow = ({ icon: Icon, label, date, className }: { icon: React.ElementType, label: string, date?: string, className?: string }) => {
    const [relativeDate, setRelativeDate] = useState<string>('');
    
    let formattedDate: string;
    try {
        const parsedDate = parseISO(date || '');
        formattedDate = format(parsedDate, 'PPP'); // Format without time to avoid timezone issues
    } catch(e) {
        formattedDate = date || 'Invalid Date';
    }
    
    useEffect(() => {
        // Defer relative time calculation to client-side only
        if (date) {
            try {
                const parsedDate = parseISO(date);
                setRelativeDate(formatDistanceToNowStrict(parsedDate, { addSuffix: true }));
            } catch (e) {
                setRelativeDate('Invalid date');
            }
        }
    }, [date]);

    if (!date) return null;

    return (
        <div className={`flex items-start gap-4 py-3 border-t first:pt-0 last:pb-0 ${className}`}>
            <Icon className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
            <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-muted-foreground">{label}</span>
                <span className="font-semibold text-foreground text-sm">
                    {formattedDate} 
                    {relativeDate && <span className="text-muted-foreground text-xs ml-1">({relativeDate})</span>}
                </span>
            </div>
        </div>
    )
}

const RegistrationTimeline = ({ creationDate, expirationDate }: { creationDate?: string, expirationDate?: string }) => {
    if (!creationDate || !expirationDate) return null;

    try {
        const start = parseISO(creationDate);
        const end = parseISO(expirationDate);
        const now = new Date();
        
        const totalDuration = differenceInDays(end, start);
        const elapsedDuration = differenceInDays(now, start);
        
        const progress = Math.max(0, Math.min(100, (elapsedDuration / totalDuration) * 100));

        return (
            <div className="space-y-3 pt-4">
                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Registration Timeline
                </h4>
                <Progress value={progress} />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Registered: {format(start, 'MMM yyyy')}</span>
                    <span>Expires: {format(end, 'MMM yyyy')}</span>
                </div>
            </div>
        )

    } catch (e) {
        return null;
    }
}


export function DomainCard({ data }: { data?: DomainData }) {
  if (!data) {
      return (
          <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
          </div>
      )
  }

  const statusColors: {[key: string]: string} = {
    'ok': 'bg-green-100 text-green-800 border-green-200',
    'active': 'bg-green-100 text-green-800 border-green-200',
    'clienttransferprohibited': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'servertransferprohibited': 'bg-red-100 text-red-800 border-red-200',
    'addperiod': 'bg-blue-100 text-blue-800 border-blue-200',
  }

  const getStatusVariant = (status: string): string => {
    const lowerStatus = status.toLowerCase().replace(/ /g, '');
    return statusColors[lowerStatus] || 'bg-secondary text-secondary-foreground border-border';
  }


  return (
    <div className='grid md:grid-cols-3 gap-6'>
        <div className="md:col-span-2 space-y-6">
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Globe2 className="h-6 w-6 text-primary" />
                        Registration Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <DetailRow icon={Landmark} label="Registrar" value={data.registrar} />
                    <DateDetailRow icon={Calendar} label="Creation Date" date={data.creationDate} />
                    <DateDetailRow icon={Calendar} label="Expiration Date" date={data.expirationDate} />
                    <DateDetailRow icon={Calendar} label="Last Updated Date" date={data.updatedDate} />
                     <RegistrationTimeline creationDate={data.creationDate} expirationDate={data.expirationDate} />
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
             <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        Domain Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {data.status && data.status.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {data.status.map(s => (
                                <Badge key={s} className={getStatusVariant(s)}>{s}</Badge>
                            ))}
                        </div>
                    ) : (
                        <p className='text-sm text-muted-foreground'>No status information available.</p>
                    )}
                </CardContent>
            </Card>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Server className="h-5 w-5 text-primary" />
                        Nameservers
                    </CardTitle>
                </CardHeader>
                <CardContent>
                     {data.nameservers && data.nameservers.length > 0 ? (
                        <div className="space-y-2">
                            {data.nameservers.map((ns, i) => (
                                <p key={i} className="text-sm font-mono bg-muted/50 rounded px-2 py-1">{ns}</p>
                            ))}
                        </div>
                    ) : (
                        <p className='text-sm text-muted-foreground'>No nameservers found.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
