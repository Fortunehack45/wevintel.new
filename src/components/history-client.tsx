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

export function HistoryClient() {
  const [history, setHistory] = useLocalStorage<AnalysisResult[]>('webintel_history', []);

  const clearHistory = () => {
    setHistory([]);
  };

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
            <Button variant="destructive" size="sm" onClick={clearHistory}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear History
            </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {history.map((item, index) => {
            const mobilePerformance = item.performance?.mobile?.performanceScore;
            const isSecure = item.security?.isSecure;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/analysis/${encodeURIComponent(item.overview.url)}`} className="block h-full">
                    <Card className="h-full hover:border-primary/50 transition-colors group glass-card hover:shadow-primary/20 hover:shadow-lg">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Image src={item.overview.favicon || '/fallback-favicon.svg'} alt="favicon" width={32} height={32} className="rounded-md" unoptimized />
                                <div className="flex-1 overflow-hidden">
                                    <CardTitle className="truncate text-lg">{item.overview.domain}</CardTitle>
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
                                <Badge variant={isSecure ? "secondary" : "destructive"}>
                                    {item.security?.sslGrade || (isSecure ? 'Secure' : 'Insecure')}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 col-span-2">
                                 <Globe className="h-4 w-4 text-muted-foreground"/>
                                <span className="font-semibold">{item.hosting?.country || 'N/A'}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                           <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors">View full report &rarr;</p>
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
