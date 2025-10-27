
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { WebsiteOverview } from '@/lib/types';
import Image from 'next/image';
import { Languages, FileText, Loader } from 'lucide-react';
import { Button } from '../ui/button';

interface OverviewCardProps {
  data: WebsiteOverview;
  isLoading: boolean;
}

export function OverviewCard({ data, isLoading }: OverviewCardProps) {
  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4 space-y-0">
        {data.favicon && (
          <Image 
            src={data.favicon} 
            alt={`${data.domain} favicon`} 
            width={64} 
            height={64} 
            className="rounded-lg border-2 bg-slate-100 dark:bg-white/10 p-1"
            crossOrigin="anonymous"
          />
        )}
        <div className='flex-1'>
          <div className="flex items-center gap-3">
             <h3 className="text-2xl font-bold tracking-tight">{data.title || data.domain}</h3>
             {isLoading && <Loader className="h-5 w-5 text-primary animate-spin" />}
          </div>
          <p className="text-muted-foreground">{data.domain}</p>
        </div>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6 pt-4">
        <div className="flex items-start gap-4">
          <FileText className="h-5 w-5 mt-1 text-primary shrink-0" />
          <div>
            <p className="font-semibold">Description</p>
            <p className="text-muted-foreground text-sm">{data.description || 'No description found.'}</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Languages className="h-5 w-5 mt-1 text-primary shrink-0" />
          <div>
            <p className="font-semibold">Language</p>
            <p className="text-muted-foreground text-sm">{data.language?.toUpperCase() || 'N/A'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
