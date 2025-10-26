
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { PerformanceData } from '@/lib/types';
import { TrendingUp, Gauge, Timer, Milestone, PencilRuler, Smartphone, Monitor } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '../ui/skeleton';
import { motion } from 'framer-motion';


const getScoreColor = (score: number) => {
    if (score >= 90) return 'hsl(var(--chart-1))'; // Green
    if (score >= 50) return 'hsl(var(--chart-4))'; // Yellow
    return 'hsl(var(--destructive))'; // Red
};

const getScoreTextColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
};

const ScoreCircle = ({ label, score }: { label: string, score: number }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const offset = score ? circumference - (score / 100) * circumference : circumference;
  
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative h-20 w-20">
          <svg className="h-full w-full" viewBox="0 0 80 80">
            <circle
              className="stroke-current text-muted/50"
              cx="40"
              cy="40"
              r={radius}
              fill="transparent"
              strokeWidth="8"
            />
            <motion.circle
              cx="40"
              cy="40"
              r={radius}
              fill="transparent"
              strokeWidth="8"
              stroke={getScoreColor(score)}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 40 40)"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xl font-bold ${getScoreTextColor(score)}`}>{score}</span>
          </div>
        </div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      </div>
    );
};


const MetricItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string }) => (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">{label}</span>
      </div>
      <span className="font-semibold text-foreground">{value || 'N/A'}</span>
    </div>
);

const PerformanceReport = ({ data }: { data?: PerformanceData }) => {
  if (!data) {
      return (
          <div className="space-y-4 py-4">
              <Skeleton className="h-[180px] w-full" />
              <Separator />
              <div className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
              </div>
          </div>
      )
  }
    
  const chartData = [
    { label: 'Performance', score: data.performanceScore },
    { label: 'Accessibility', score: data.accessibilityScore },
    { label: 'Best Practices', score: data.bestPracticesScore },
    { label: 'SEO', score: data.seoScore },
  ].filter(d => typeof d.score === 'number') as { label: string, score: number }[];

  const detailedMetrics = [
      { icon: Gauge, label: 'Speed Index', value: data.speedIndex },
      { icon: Milestone, label: 'Largest Contentful Paint', value: data.largestContentfulPaint },
      { icon: PencilRuler, label: 'Cumulative Layout Shift', value: data.cumulativeLayoutShift },
      { icon: Timer, label: 'Total Blocking Time', value: data.totalBlockingTime },
      { icon: Milestone, label: 'First Contentful Paint', value: data.firstContentfulPaint },
  ];

  return (
      <>
        {chartData.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 place-items-center">
                {chartData.map((item) => <ScoreCircle key={item.label} {...item} />)}
            </div>
            <Separator className="my-4" />
            <div className="grid gap-3">
                {detailedMetrics.map(metric => (
                    <MetricItem key={metric.label} {...metric} />
                ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-muted-foreground">Performance data not available for this device type.</p>
          </div>
        )}
    </>
  )
}


export function PerformanceCard({ data }: { data?: { mobile: PerformanceData, desktop: PerformanceData }}) {
  return (
    <Card className="h-full glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Core Web Vitals
        </CardTitle>
        <CardDescription>Lighthouse scores via Google PageSpeed Insights.</CardDescription>
      </CardHeader>
      <CardContent>
          <Tabs defaultValue="mobile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mobile"><Smartphone className="mr-2 h-4 w-4"/>Mobile</TabsTrigger>
              <TabsTrigger value="desktop"><Monitor className="mr-2 h-4 w-4"/>Desktop</TabsTrigger>
            </TabsList>
            <TabsContent value="mobile">
              <PerformanceReport data={data?.mobile} />
            </TabsContent>
            <TabsContent value="desktop">
              <PerformanceReport data={data?.desktop} />
            </TabsContent>
          </Tabs>
      </CardContent>
    </Card>
  );
}
