
'use client';

import { UrlForm } from '@/components/url-form';
import { HistoryClient } from '@/components/history-client';
import { motion } from 'framer-motion';
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

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center">
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
      
       <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.7, delay: 0.3 }}
         className="w-full max-w-5xl mt-24"
      >
        <div className="grid md:grid-cols-3 gap-6">
            {featureCards.map((feature, i) => (
                <Card key={i} className="text-center glass-card">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                            <feature.icon className="h-6 w-6 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                </Card>
            ))}
        </div>
      </motion.div>
      
       <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="w-full max-w-5xl mt-24 text-left"
      >
        <Card className="glass-card overflow-hidden">
            <div className="p-6 md:flex md:items-center md:justify-between">
                <div>
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                        <Trophy className="text-primary" />
                        Featured Analyses
                    </h3>
                    <p className="text-muted-foreground mt-1">Explore our curated list of top websites and see how they perform.</p>
                </div>
                <Button asChild className="mt-4 md:mt-0">
                    <Link href="/leaderboard">
                        View Leaderboard <ArrowRight className="ml-2"/>
                    </Link>
                </Button>
            </div>
        </Card>
      </motion.div>


      <div className="w-full max-w-5xl mt-24">
        <h2 className="text-3xl font-bold mb-6 text-left">Recent Analyses</h2>
        <HistoryClient limit={6} />
      </div>
    </div>
  );
}
