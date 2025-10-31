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
<<<<<<< HEAD
>>>>>>> 8e6b5af (Users that are not logged in should not have access at all to the home p)
=======
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Scale, Trophy } from 'lucide-react';
import Link from 'next/link';
>>>>>>> 1ee8e8e (Make the dashboard page more detailed and informative and fully sophisti)
=======
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Scale, Trophy, Star, Building, Sparkles, Heart } from 'lucide-react';
import Link from 'next/link';
import { DashboardSkeleton } from '@/components/analysis/dashboard-skeleton';
import { AIRedesignCard } from '@/components/analysis/ai-redesign-card';

const sponsors = [
    { name: 'Vercel', logo: '/sponsors/vercel.svg' },
    { name: 'Firebase', logo: '/sponsors/firebase.svg' },
    { name: 'Google', logo: '/sponsors/google.svg' },
    { name: 'Next.js', logo: '/sponsors/nextjs.svg' },
    { name: 'ShadCN', logo: '/sponsors/shadcn.svg' },
];

const reviews = [
    {
        quote: "WebIntel is an absolute game-changer. The depth of analysis and the AI-powered insights have revolutionized my workflow.",
        name: "Sarah L.",
        role: "Lead Developer, TechCorp",
        rating: 5,
    },
    {
        quote: "The side-by-side comparison feature is invaluable for competitive analysis. I've uncovered so many opportunities.",
        name: "Michael B.",
        role: "Digital Strategist",
        rating: 5,
    },
    {
        quote: "As a security consultant, WebIntel is my first step in any website audit. It's fast, comprehensive, and incredibly accurate.",
        name: "Dr. Evelyn Reed",
        role: "Cybersecurity Expert",
        rating: 5,
    },
     {
        quote: "The AI redesign feature gave me a fresh perspective on my portfolio. It's like having a world-class designer on call.",
        name: "Alex Johnson",
        role: "Freelance Designer",
        rating: 5,
    },
];

>>>>>>> c3587a0 (Remove "warming up engine" loading animation from the dashboard, sing up)

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
             className="lg:col-span-1"
        >
             <Card className="glass-card h-full hover:border-primary/50 transition-all group">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Sparkles className="h-6 w-6 text-primary"/>
                       AI Redesign
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription>
                        Use AI to generate a fresh, modern redesign concept for any website homepage.
                    </CardDescription>
                     <p className="text-sm font-semibold text-primary mt-4 flex items-center gap-2">
                        Available on Analysis Page <ArrowRight className="h-4 w-4" />
                    </p>
                </CardContent>
            </Card>
        </motion.div>
      </div>

<<<<<<< HEAD
<<<<<<< HEAD
      <div className="w-full max-w-5xl mt-24">
        <h2 className="text-3xl font-bold mb-6 text-left">Recent Analyses</h2>
        <HistoryClient limit={6} />
      </div>
>>>>>>> 376e771 (No... The welcome page is the page before the home page)
=======
=======
       <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-6 text-left flex items-center gap-3"><Heart className="text-primary"/> From Our Users</h2>
         <div className="w-full overflow-hidden tech-stack-scroller" data-animated="true">
            <div className="tech-stack-scroller-inner flex gap-6">
                {[...reviews, ...reviews].map((review, index) => (
                    <Card key={index} className="glass-card w-80 flex-shrink-0">
                        <CardContent className="p-6">
                            <div className="flex mb-2">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>
                            <p className="text-muted-foreground italic">"{review.quote}"</p>
                            <div className="mt-4 text-right">
                                <p className="font-bold text-sm">{review.name}</p>
                                <p className="text-xs text-muted-foreground">{review.role}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </motion.div>


>>>>>>> 33068c5 (Add more sections to the dashboard page like sponsores, users reviews et)
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-6 text-left flex items-center gap-3"><Building className="text-primary"/> Sponsored By</h2>
        <Card className="glass-card">
            <CardContent className="p-6">
                <div className="flex flex-wrap items-center justify-center gap-8">
                    {sponsors.map(sponsor => (
                         <div key={sponsor.name} className="flex items-center gap-3 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all">
                             <p className="font-bold text-lg">{sponsor.name}</p>
                         </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-left">Your History</h2>
        <HistoryClient />
      </motion.div>
>>>>>>> 1ee8e8e (Make the dashboard page more detailed and informative and fully sophisti)
    </div>
  );
}
