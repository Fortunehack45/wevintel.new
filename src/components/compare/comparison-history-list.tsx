
'use client';

import { useLocalStorage } from '@/hooks/use-local-storage';
import { type ComparisonHistoryItem } from '@/lib/types';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { formatDistanceToNow } from 'date-fns';
import { X, Scale } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";
import { useMemo } from 'react';
import Image from 'next/image';

export function ComparisonHistoryList({ limit }: { limit?: number }) {
  const stableInitialValue = useMemo(() => [], []);
  const [history, setHistory] = useLocalStorage<ComparisonHistoryItem[]>('webintel_comparison_history', stableInitialValue);
  const itemsToDisplay = limit ? history.slice(0, limit) : history;

  const deleteItem = (id: string) => {
    setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
  };
  
  if (itemsToDisplay.length === 0) {
    return (
      <div className="text-center p-8 border-2 border-dashed rounded-2xl glass-card">
          <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold">No comparisons made yet.</h3>
          <p className="text-muted-foreground mt-2">Use the Compare feature to see your history here!</p>
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
            whileTap={{ scale: 0.98 }}
            className="relative group h-full"
          >
            <Card className="h-full flex flex-col glass-card glow-border transition-shadow duration-300 hover:shadow-primary/20">
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
                            Are you sure you want to delete the comparison for <span className="font-semibold text-foreground">{item.domain1}</span> vs <span className="font-semibold text-foreground">{item.domain2}</span>? This action cannot be undone.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteItem(item.id)} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <CardContent className="flex-1 flex flex-col justify-center items-center p-6 text-center">
                    <div className="flex flex-col items-center gap-2 overflow-hidden">
                        <Image src={`https://www.google.com/s2/favicons?domain=${item.domain1}&sz=32`} alt={`${item.domain1} favicon`} width={32} height={32} className="rounded-md flex-shrink-0 bg-slate-100 dark:bg-white/10 p-0.5" crossOrigin="anonymous"/>
                        <CardTitle className="truncate text-sm font-semibold w-full">{item.domain1}</CardTitle>
                    </div>

                    <Scale className="h-6 w-6 text-muted-foreground my-3" />

                    <div className="flex flex-col items-center gap-2 overflow-hidden">
                        <Image src={`https://www.google.com/s2/favicons?domain=${item.domain2}&sz=32`} alt={`${item.domain2} favicon`} width={32} height={32} className="rounded-md flex-shrink-0 bg-slate-100 dark:bg-white/10 p-0.5" crossOrigin="anonymous"/>
                        <CardTitle className="truncate text-sm font-semibold w-full">{item.domain2}</CardTitle>
                    </div>

                    <p className="text-xs text-muted-foreground mt-4">
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </p>
                </CardContent>

                <CardFooter>
                   <Button asChild className="w-full" variant="default">
                       <Link href={`/compare/${encodeURIComponent(item.url1)}/${encodeURIComponent(item.url2)}`}>View comparison &rarr;</Link>
                    </Button>
                </CardFooter>
            </Card>
            </motion.div>
        )
    })}
    </div>
  )
}
