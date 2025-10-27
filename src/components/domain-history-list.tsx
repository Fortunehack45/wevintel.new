
'use client';

import { useLocalStorage } from '@/hooks/use-local-storage';
import { type DomainHistoryItem } from '@/lib/types';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { formatDistanceToNow } from 'date-fns';
import { X, FileSearch } from 'lucide-react';
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

export function DomainHistoryList({ limit }: { limit?: number }) {
  const [history, setHistory] = useLocalStorage<DomainHistoryItem[]>('webintel_domain_history', []);
  const itemsToDisplay = limit ? history.slice(0, limit) : history;

  const deleteItem = (id: string) => {
    setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
  };
  
  if (itemsToDisplay.length === 0) {
    return (
      <div className="text-center p-8 border-2 border-dashed rounded-2xl glass-card">
          <FileSearch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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
            <Card className="h-full flex flex-col glass-card glow-border">
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
                <CardContent className="flex-1" />
                <CardFooter>
                   <Button asChild className="w-full">
                       <Link href={`/domain-checker/${encodeURIComponent(item.domain)}`}>View domain details &rarr;</Link>
                    </Button>
                </CardFooter>
            </Card>
            </motion.div>
        )
    })}
    </div>
  )
}
