
'use client';

import { useLocalStorage } from '@/hooks/use-local-storage';
import { type AnalysisResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { Globe, BarChart, ShieldCheck, Trash2, Smartphone, X } from 'lucide-react';
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
  buttonVariants
} from "@/components/ui/alert-dialog"

export function HistoryClient() {
  const [history, setHistory] = useLocalStorage<AnalysisResult[]>('webintel_history', []);

  const clearHistory = () => {
    setHistory([]);
  };

  const deleteItem = (id: string) => {
    setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
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
                <Button 
                    size="sm" 
                    className="group transition-colors duration-200 ease-in-out bg-primary hover:bg-destructive text-primary-foreground"
                >
                    <Trash2 className="mr-2 h-4 w-4 transition-transform duration-200 ease-in-out group-hover:scale-110" />
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
                  <AlertDialogAction onClick={clearHistory} className={buttonVariants({ variant: "destructive" })}>Continue</AlertDialogAction>
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
                className="relative group"
              >
                    <Card className="h-full hover:border-primary/50 transition-all glass-card glow-border">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-70 hover:!opacity-100 hover:bg-destructive/20 hover:text-destructive transition-opacity z-10">
                                    <X className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Delete this item?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete the analysis for <span className="font-semibold text-foreground">{item.overview.domain}</span>? This action cannot be undone.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteItem(item.id)} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Link href={`/analysis/${encodeURIComponent(item.overview.url)}`} className="block h-full">
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
                        </Link>
                    </Card>
                </motion.div>
            )
        })}
        </div>
    </div>
  );
}
