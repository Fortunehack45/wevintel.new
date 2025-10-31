<<<<<<< HEAD
=======

>>>>>>> 376e771 (No... The welcome page is the page before the home page)
'use client';

import { UrlForm } from '@/components/url-form';
import { HistoryClient } from '@/components/history-client';
import { motion } from 'framer-motion';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 8e6b5af (Users that are not logged in should not have access at all to the home p)
import { useAuth, useAuthContext } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
<<<<<<< HEAD
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Scale, Trophy } from 'lucide-react';
import Link from 'next/link';
import { DashboardSkeleton } from '@/components/analysis/dashboard-skeleton';

export default function DashboardPage() {
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
    return <DashboardSkeleton />;
  }
  
  const welcomeName = user.displayName || user.email;

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mb-12 space-y-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Welcome back, {welcomeName}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Ready to uncover some website intelligence? Let's get started.
          </p>
        </div>
        <UrlForm />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card className="glass-card h-full hover:border-primary/50 transition-all group">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Scale className="h-6 w-6 text-primary"/>
                        Compare Websites
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription>
                        Analyze two websites side-by-side to benchmark performance, security, and technology stacks.
                    </CardDescription>
                     <Link href="/compare" className="text-sm font-semibold text-primary mt-4 flex items-center gap-2">
                        Start Comparing <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </CardContent>
            </Card>
        </motion.div>
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
             <Card className="glass-card h-full hover:border-primary/50 transition-all group">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Trophy className="h-6 w-6 text-primary"/>
                        Leaderboard
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription>
                        Explore a curated list of top websites to see how they perform and what technologies they use.
                    </CardDescription>
                     <Link href="/leaderboard" className="text-sm font-semibold text-primary mt-4 flex items-center gap-2">
                        View Leaderboard <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </CardContent>
            </Card>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-left">Recent History</h2>
        <HistoryClient limit={6} />
      </motion.div>
=======
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Search, Sparkles, Scale, Trophy, ArrowRight, Activity, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

const featureCards = [
    {
        icon: Activity,
        title: "Comprehensive Analysis",
        description: "Get detailed reports on Core Web Vitals, security headers, SEO health, and more."
    },
    {
        icon: Sparkles,
        title: "AI-Powered Insights",
        description: "Receive AI-generated summaries, actionable recommendations, and traffic estimations."
    },
    {
        icon: Scale,
        title: "Side-by-Side Comparison",
        description: "Analyze two websites simultaneously to benchmark performance and technology stacks."
    }
];
=======
>>>>>>> 05fe2ff (For the welcome page on the desktop view it should only one page Dashboa)
=======
import { LoadingOverlay } from '@/components/loading-overlay';
>>>>>>> 8e6b5af (Users that are not logged in should not have access at all to the home p)

export default function DashboardPage() {
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
        // If auth isn't ready, maybe it's still loading, but if it's null, we should redirect.
        // A brief delay to see if auth context loads.
        const timer = setTimeout(() => {
            if (!auth) {
                router.push('/login');
            }
        }, 500);
        return () => clearTimeout(timer);
    }
  }, [auth, router]);

  if (isLoading || !user) {
    return <LoadingOverlay isVisible={true} />;
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
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground">
            WebIntel
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Know everything about any website. Instantly uncover the secrets of any URL.
          </p>
        </motion.div>
        <UrlForm />
        <p className="mt-4 text-sm text-muted-foreground">
          Get insights on performance, security, SEO, and more.
        </p>
      </div>

      <div className="w-full max-w-5xl mt-24">
        <h2 className="text-3xl font-bold mb-6 text-left">Recent Analyses</h2>
        <HistoryClient limit={6} />
      </div>
>>>>>>> 376e771 (No... The welcome page is the page before the home page)
    </div>
  );
}
