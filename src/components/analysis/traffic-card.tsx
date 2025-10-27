

'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { TrafficData } from '@/lib/types';
import { Users, TrendingUp, HelpCircle, Globe, MousePointer, Link, Clock, CornerRightUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

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
    return num.toString();
}

const getConfidenceBadgeVariant = (confidence?: TrafficData['estimationConfidence']): 'default' | 'secondary' | 'destructive' => {
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

const trafficSourceIcons = {
    direct: <MousePointer className="h-4 w-4 text-primary" />,
    search: <TrendingUp className="h-4 w-4 text-green-500" />,
    social: <Users className="h-4 w-4 text-blue-500" />,
    referral: <Link className="h-4 w-4 text-purple-500" />,
};

export function TrafficCard({ data }: { data: TrafficData }) {
  const hasData = typeof data.estimatedMonthlyVisits === 'number' && data.estimatedMonthlyVisits > 0;

  const trafficSources = data.trafficSources ? Object.entries(data.trafficSources) : [];
  const topCountries = data.topCountries || [];

  return (
    <Card className="h-full glass-card lg:col-span-2">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    AI Traffic Estimate
                </CardTitle>
                <CardDescription>Estimated user engagement and traffic patterns.</CardDescription>
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
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {hasData ? (
          <>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Estimated Monthly Visits</p>
              <p className="text-4xl font-bold">{formatNumber(data.estimatedMonthlyVisits!)}</p>
              <Badge variant={getConfidenceBadgeVariant(data.estimationConfidence)} className="mt-1 capitalize">
                  {data.estimationConfidence} confidence
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                    <h4 className="font-semibold mb-3">Traffic Sources</h4>
                    <div className="space-y-3">
                        {trafficSources.map(([source, percentage]) => (
                            <div key={source}>
                                <div className="flex justify-between items-center mb-1 text-xs">
                                    <div className="flex items-center gap-2 capitalize">
                                        {trafficSourceIcons[source as keyof typeof trafficSourceIcons]}
                                        <span>{source}</span>
                                    </div>
                                    <span>{percentage}%</span>
                                </div>
                                <Progress value={percentage} className="h-2" />
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold mb-3">Audience Location</h4>
                    <div className="space-y-2">
                        {topCountries.map((c, i) => (
                           <div key={i} className="flex items-center justify-between text-xs">
                               <div className="flex items-center gap-2">
                                   <Globe className="h-4 w-4 text-muted-foreground" />
                                   <span>{c.country}</span>
                               </div>
                               <span className="font-medium">{c.percentage}%</span>
                           </div>
                        ))}
                    </div>
                </div>
            </div>

            {data.engagement && (
                <div>
                    <h4 className="font-semibold mb-3">Engagement</h4>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <div className="flex items-center justify-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <p className="text-lg font-bold">{data.engagement.avgSessionDuration}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">Avg. Session</p>
                        </div>
                        <div>
                           <div className="flex items-center justify-center gap-2">
                                <CornerRightUp className="h-4 w-4 text-muted-foreground" />
                                <p className="text-lg font-bold">{data.engagement.bounceRate}%</p>
                            </div>
                            <p className="text-xs text-muted-foreground">Bounce Rate</p>
                        </div>
                    </div>
                </div>
            )}

          </>
        ) : (
          <div className="text-center py-10">
              <p className="text-muted-foreground">Could not estimate traffic for this website.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
