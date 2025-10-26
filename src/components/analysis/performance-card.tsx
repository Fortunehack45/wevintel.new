'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { PerformanceData } from '@/lib/types';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { TrendingUp, Gauge, Timer, Milestone, Shuffle, PencilRuler } from 'lucide-react';
import { Separator } from '../ui/separator';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 text-sm bg-white/80 backdrop-blur-sm rounded-md border">
        <p className="label font-bold">{`${label}`}</p>
        <p style={{ color: payload[0].fill }}>{`Score : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const getScoreColor = (score: number) => {
    if (score >= 90) return 'hsl(var(--chart-1))';
    if (score >= 50) return 'hsl(var(--chart-4))';
    return 'hsl(var(--destructive))';
}

const MetricItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string }) => (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">{label}</span>
      </div>
      <span className="font-semibold text-foreground">{value || 'N/A'}</span>
    </div>
);

export function PerformanceCard({ data }: { data: PerformanceData }) {
  const chartData = [
    { name: 'Performance', score: data.performanceScore },
    { name: 'Accessibility', score: data.accessibilityScore },
    { name: 'SEO', score: data.seoScore },
    { name: 'Best Practices', score: data.bestPracticesScore },
  ].filter(d => typeof d.score === 'number');

  const detailedMetrics = [
      { icon: Gauge, label: 'Speed Index', value: data.speedIndex },
      { icon: Milestone, label: 'Largest Contentful Paint', value: data.largestContentfulPaint },
      { icon: PencilRuler, label: 'Cumulative Layout Shift', value: data.cumulativeLayoutShift },
      { icon: Timer, label: 'Total Blocking Time', value: data.totalBlockingTime },
      { icon: Milestone, label: 'First Contentful Paint', value: data.firstContentfulPaint },
  ];

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
        {chartData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent) / 0.5)' }}/>
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getScoreColor(entry.score ?? 0)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <Separator className="my-4" />
            <div className="grid gap-3">
                {detailedMetrics.map(metric => (
                    <MetricItem key={metric.label} {...metric} />
                ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-muted-foreground">Performance data not available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
