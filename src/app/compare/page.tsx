
'use client';
import { CompareForm } from '@/components/compare/compare-form';
import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';
import { ComparisonHistoryList } from '@/components/compare/comparison-history-list';
import { useAuth, useAuthContext } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { Skeleton } from '@/components/ui/skeleton';


const ComparePageSkeleton = () => (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center pb-24 md:pb-8">
        <div className="max-w-3xl w-full">
            <div className="mb-12 space-y-4">
                <Skeleton className="h-16 w-3/4 mx-auto" />
                <Skeleton className="h-6 w-1/2 mx-auto" />
            </div>
            <div className="space-y-4 max-w-xl mx-auto">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-4 w-8 mx-auto" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
        <div className="w-full max-w-5xl mt-24">
            <Skeleton className="h-8 w-64 mb-6" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        </div>
    </div>
);


export default function ComparePage() {
  const auth = useAuthContext();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (auth) {
      const unsubscribe = useAuth((user) => {
        if (user) {
          setUser(user);
          setIsLoading(false);
        } else {
          router.push('/login');
        }
      });
      return () => unsubscribe();
    } else {
        const timer = setTimeout(() => {
            if (!auth) {
                router.push('/login');
            }
        }, 500);
        return () => clearTimeout(timer);
    }
  }, [auth, router]);

  if (isLoading || !user) {
    return <ComparePageSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center pb-24 md:pb-8">
      <div className="max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground flex items-center justify-center gap-4">
            <Scale className="h-12 w-12 text-primary" /> Website Comparison
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Analyze two websites side-by-side to compare their performance, technology, and security.
          </p>
        </motion.div>
        <CompareForm />
        <p className="mt-4 text-sm text-muted-foreground">
          Enter two URLs to see who comes out on top.
        </p>
      </div>
      
       <div className="w-full max-w-5xl mt-24">
        <h2 className="text-3xl font-bold mb-6 text-left">Recent Comparisons</h2>
        <ComparisonHistoryList limit={6} />
      </div>
    </div>
  );
}
