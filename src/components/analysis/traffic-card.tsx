

'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { TrafficData } from '@/lib/types';
import { Users, TrendingUp, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Badge } from '../ui/badge';

const formatNumber = (num: number) => {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num;
}

const getConfidenceBadgeVariant = (confidence: TrafficData['estimationConfidence']): 'default' | 'secondary' | 'destructive' => {
    switch (confidence) {
        case 'high':
            return 'default';
        case 'medium':
            return 'secondary';
        case 'low':
        default:
            return 'destructive';
    }
}

export function TrafficCard({ data }: { data: TrafficData }) {
  const hasData = typeof data.estimatedMonthlyVisits === 'number' && data.estimatedMonthlyVisits > 0;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between gap-2 text-base">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Traffic Estimate
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">This is an AI-powered estimate based on public data and may not be accurate. Real traffic data is private.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center pt-4">
        {hasData ? (
          <>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold">{formatNumber(data.estimatedMonthlyVisits!)}</p>
              <span className="text-muted-foreground">/ month</span>
            </div>
            <Badge variant={getConfidenceBadgeVariant(data.estimationConfidence)} className="mt-2 capitalize">
                {data.estimationConfidence} confidence
            </Badge>
          </>
        ) : (
          <div className="text-center py-4">
              <p className="text-muted-foreground text-sm">Could not estimate traffic.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
