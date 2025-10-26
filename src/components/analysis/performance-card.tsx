'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { PerformanceData } from '@/lib/types';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 text-sm bg-background/80 backdrop-blur-sm rounded-md border border-border">
        <p className="label font-bold">{`${label}`}</p>
        <p style={{ color: payload[0].fill }}>{`Score : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const getScoreColor = (score: number) => {
    if (score >= 90) return 'hsl(var(--chart-1))'; // Greenish/Blue
    if (score >= 50) return 'hsl(var(--chart-4))'; // Orange
    return 'hsl(var(--destructive))'; // Red
}

export function PerformanceCard({ data }: { data: PerformanceData }) {
  const chartData = [
    { name: 'Performance', score: data.performanceScore },
    { name: 'Accessibility', score: data.accessibilityScore },
    { name: 'SEO', score: data.seoScore },
    { name: 'Best Practices', score: data.bestPracticesScore },
  ].filter(d => typeof d.score === 'number');

  return (
    <Card className="bg-card/50 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Core Web Vitals
        </CardTitle>
        <CardDescription>Lighthouse scores via Google PageSpeed Insights.</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent) / 0.1)' }}/>
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getScoreColor(entry.score ?? 0)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-muted-foreground">Performance data not available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
