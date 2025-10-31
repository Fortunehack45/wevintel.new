
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

export default function DashboardPage() {
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

      <div className="w-full max-w-5xl mt-24">
        <h2 className="text-3xl font-bold mb-6 text-left">Recent Analyses</h2>
        <HistoryClient limit={6} />
      </div>
    </div>
  );
}
