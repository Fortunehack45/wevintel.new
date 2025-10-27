
'use client';

import { useLocalStorage } from '@/hooks/use-local-storage';
import { type AnalysisResult, type DomainHistoryItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { Globe, ShieldCheck, Trash2, Smartphone, X, FileSearch } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


function WebsiteHistoryList({ limit }: { limit?: number }) {
  const [history, setHistory] = useLocalStorage<AnalysisResult[]>('webintel_history', []);
  const itemsToDisplay = limit ? history.slice(0, limit) : history;

  const deleteItem = (id: string) => {
    setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
  };
  
  const getScoreBadgeVariant = (score: number | null | undefined): "destructive" | "secondary" | "default" => {
    if (score === null || score === undefined) return "secondary";
    if (score < 50) return "destructive";
    if (score < 90) return "secondary";
    return "default";
  }

  if (itemsToDisplay.length === 0) {
    return (
      <div className="text-center p-8 border-2 border-dashed rounded-2xl glass-card">
          <h3 className="text-xl font-semibold">No sites analysed yet.</h3>
          <p className="text-muted-foreground mt-2">Start exploring to see your history here!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {itemsToDisplay.map((item, index) => {
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
                            <Image src={`https://www.google.com/s2/favicons?domain=${item.overview.domain}&sz=32`} alt="favicon" width={32} height={32} className="rounded-md bg-slate-100 dark:bg-white/10 p-0.5" crossOrigin="anonymous" />
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
  )
}

function DomainHistoryList({ limit }: { limit?: number }) {
  const [history, setHistory] = useLocalStorage<DomainHistoryItem[]>('webintel_domain_history', []);
  const itemsToDisplay = limit ? history.slice(0, limit) : history;

  const deleteItem = (id: string) => {
    setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
  };
  
  if (itemsToDisplay.length === 0) {
    return (
      <div className="text-center p-8 border-2 border-dashed rounded-2xl glass-card">
          <h3 className="text-xl font-semibold">No domains looked up yet.</h3>
          <p className="text-muted-foreground mt-2">Use the Domain Checker to see your history here!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {itemsToDisplay.map((item, index) => {
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
                            Are you sure you want to delete the lookup for <span className="font-semibold text-foreground">{item.domain}</span>? This action cannot be undone.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteItem(item.id)} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <Link href={`/domain-checker/${encodeURIComponent(item.domain)}`} className="block h-full">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <FileSearch className="h-8 w-8 text-primary" />
                            <div className="flex-1 overflow-hidden">
                                <CardTitle className="truncate">{item.domain}</CardTitle>
                                <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardFooter>
                       <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">View domain details &rarr;</p>
                    </CardFooter>
                </Link>
            </Card>
            </motion.div>
        )
    })}
    </div>
  )
}

export function HistoryClient({ limit }: { limit?: number }) {
  const [analysisHistory, setAnalysisHistory] = useLocalStorage<AnalysisResult[]>('webintel_history', []);
  const [domainHistory, setDomainHistory] = useLocalStorage<DomainHistoryItem[]>('webintel_domain_history', []);

  const clearAllHistory = () => {
    setAnalysisHistory([]);
    setDomainHistory([]);
  };

  const hasHistory = analysisHistory.length > 0 || domainHistory.length > 0;

  if (limit) { // On the homepage, just show website analyses
    return <WebsiteHistoryList limit={limit} />;
  }

  return (
    <div>
        {hasHistory && (
            <div className="flex justify-end mb-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                        size="sm" 
                        className="group transition-colors duration-200 ease-in-out bg-primary hover:bg-destructive text-primary-foreground"
                    >
                        <Trash2 className="mr-2 h-4 w-4 transition-transform duration-200 ease-in-out group-hover:scale-110" />
                        Clear All History
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        entire analysis and domain lookup history from this device.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={clearAllHistory} className={buttonVariants({ variant: "destructive" })}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </div>
        )}
        
        <Tabs defaultValue="websites" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="websites">Website Analyses ({analysisHistory.length})</TabsTrigger>
            <TabsTrigger value="domains">Domain Lookups ({domainHistory.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="websites">
            <WebsiteHistoryList />
          </TabsContent>
          <TabsContent value="domains">
            <DomainHistoryList />
          </TabsContent>
        </Tabs>
    </div>
  );
}
