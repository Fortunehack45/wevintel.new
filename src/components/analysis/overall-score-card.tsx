
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { motion } from 'framer-motion';

const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
};

const getScoreRingColor = (score: number) => {
    if (score >= 90) return 'hsl(var(--chart-1))'; // Green
    if (score >= 50) return 'hsl(var(--chart-4))'; // Yellow
    return 'hsl(var(--destructive))'; // Red
}

export function OverallScoreCard({ score }: { score: number | null }) {

  if (score === null) {
      return (
          <Card className="h-full glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Target className="h-5 w-5 text-primary" />
                    Overall Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="w-full h-24" />
              </CardContent>
          </Card>
      )
  }
  
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = score ? circumference - (score / 100) * circumference : circumference;


  return (
    <Card className="h-full glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="h-5 w-5 text-primary" />
          Overall Score
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center pt-2">
        <div className="relative h-32 w-32">
            <svg className="h-full w-full" viewBox="0 0 100 100">
                <circle
                className="stroke-current text-muted/30"
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                strokeWidth="8"
                />
                <motion.circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                strokeWidth="8"
                stroke={getScoreRingColor(score)}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform="rotate(-90 50 50)"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-4xl font-bold ${getScoreColor(score)}`}>{score}</span>
            </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Based on all technical audits</p>
      </CardContent>
    </Card>
  );
}
