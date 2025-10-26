
'use client';

import { useLocalStorage } from '@/hooks/use-local-storage';
import { type AnalysisResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { Globe, BarChart, ShieldCheck, Trash2, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function HistoryClient() {
  const [history, setHistory] = useLocalStorage<AnalysisResult[]>('webintel_history', []);

  const clearHistory = () => {
    setHistory([]);
  };

  const getScoreBadgeVariant = (score: number | null | undefined): "destructive" | "secondary" | "default" => {
    if (score === null || score === undefined) return "secondary";
    if (score < 50) return "destructive";
    if (score < 90) return "secondary";
    return "default";
  }

  if (history.length === 0) {
    return (
        <div className="text-center p-8 border-2 border-dashed rounded-2xl glass-card">
            <h3 className="text-xl font-semibold">No sites analyzed yet.</h3>
            <p className="text-muted-foreground mt-2">Start exploring to see your history here!</p>
        </div>
    );
  }

  return (
    <div>
        <div className="flex justify-end mb-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear History
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    analysis history from this device.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearHistory}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {history.map((item, index) => {
            const mobilePerformance = item.performance?.mobile?.performanceScore;
            
            const securityScore = item.security?.securityScore;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/analysis/${encodeURIComponent(item.overview.url)}`} className="block h-full">
                    <Card className="h-full hover:border-primary/50 transition-all group glass-card hover:shadow-primary/20 hover:shadow-lg hover:scale-105">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Image src={item.overview.favicon || '/fallback-favicon.svg'} alt="favicon" width={32} height={32} className="rounded-md" crossOrigin="anonymous" />
                                <div className="flex-1 overflow-hidden">
                                    <CardTitle className="truncate">{item.overview.domain}</CardTitle>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Smartphone className="h-4 w-4 text-muted-foreground"/>
                                <span className="font-semibold">{mobilePerformance || 'N/A'}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                 <ShieldCheck className="h-4 w-4 text-muted-foreground"/>
                                 <Badge variant={getScoreBadgeVariant(securityScore)} className={getScoreBadgeVariant(securityScore) === 'default' ? 'bg-green-500/20 text-green-700 border-green-300' : ''}>
                                    {securityScore !== undefined ? `${securityScore}%` : 'N/A'}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 col-span-2">
                                 <Globe className="h-4 w-4 text-muted-foreground"/>
                                <span className="font-semibold">{item.hosting?.country || 'N/A'}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                           <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">View full report &rarr;</p>
                        </CardFooter>
                    </Card>
                </Link>
                </motion.div>
            )
        })}
        </div>
    </div>
  );
}
