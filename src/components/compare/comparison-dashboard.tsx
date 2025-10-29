
'use client';
import type { AnalysisResult } from '@/lib/types';
import { OverviewCard } from '../analysis/overview-card';
import { PerformanceCard } from '../analysis/performance-card';
import { SecurityCard } from '../analysis/security-card';
import { TechStackCarousel } from '../analysis/tech-stack-carousel';
import { ComparisonSummaryCard } from './comparison-summary-card';
import type { ComparisonOutput } from '@/lib/types';
import { motion } from 'framer-motion';
import { DashboardSkeleton } from '../analysis/dashboard-skeleton';
import { HostingCard } from '../analysis/hosting-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { AlertTriangle, Server, Layers, TrendingUp, ShieldCheck } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut'
    }
  })
};

interface ComparisonDashboardProps {
    initialData1: Partial<AnalysisResult> | { error: string; overview: { url: string; domain: string; }};
    initialData2: Partial<AnalysisResult> | { error: string; overview: { url: string; domain: string; }};
    data1: AnalysisResult | { error: string } | null;
    data2: AnalysisResult | { error: string } | null;
    summary: ComparisonOutput | { error: string } | null;
    isLoading: boolean;
}

const AnalysisFailedCard = ({ error, domain }: { error: string, domain: string }) => {
    return (
        <Card className="h-full border-destructive">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle />
                    Analysis Failed
                </CardTitle>
                <CardDescription>{domain}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-destructive-foreground bg-destructive/80 p-3 rounded-md">{error}</p>
            </CardContent>
        </Card>
    )
}

const LoadingColumn = ({ initialData, customDelay }: { initialData: Partial<AnalysisResult> | { error: string; overview: { url: string; domain: string; }}, customDelay: number }) => (
    <div className="flex flex-col space-y-6">
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={customDelay + 0.1}>
            <OverviewCard data={initialData.overview!} isLoading={true} />
        </motion.div>
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={customDelay + 0.2}>
            <DashboardSkeleton.PerformancePlaceholder />
        </motion.div>
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={customDelay + 0.3}>
            <Card><CardHeader><ShieldCheck/></CardHeader><CardContent><Skeleton className="h-32 w-full"/></CardContent></Card>
        </motion.div>
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={customDelay + 0.4}>
            <Card><CardHeader><Server/></CardHeader><CardContent><Skeleton className="h-24 w-full"/></CardContent></Card>
        </motion.div>
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={customDelay + 0.5}>
            <DashboardSkeleton.TechStackPlaceholder />
        </motion.div>
    </div>
);


const SiteColumn = ({ data, customDelay }: { data: AnalysisResult | { error: string }, customDelay: number }) => {
    if ('error' in data) {
        // @ts-ignore
        const domain = data.overview?.domain || 'Unknown';
        return (
            <div className="space-y-6">
                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={customDelay + 0.1}>
                   <AnalysisFailedCard error={data.error!} domain={domain} />
                </motion.div>
            </div>
        )
    }
    
    return (
        <div className="flex flex-col space-y-6">
             <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={customDelay + 0.1} className="h-full">
                 <OverviewCard data={data.overview} isLoading={false} />
             </motion.div>
             <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={customDelay + 0.2} className="h-full">
                <PerformanceCard data={data.performance} />
             </motion.div>
             <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={customDelay + 0.3} className="h-full">
                 <SecurityCard data={data.security} audits={data.securityAudits} />
             </motion.div>
              <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={customDelay + 0.4} className="h-full">
                 <HostingCard data={data.hosting} />
             </motion.div>
             <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={customDelay + 0.5} className="h-full">
                <TechStackCarousel data={data.techStack} />
            </motion.div>
        </div>
    )
}


export function ComparisonDashboard({ initialData1, initialData2, data1, data2, summary, isLoading }: ComparisonDashboardProps) {

  return (
    <div className='space-y-8'>
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={0}>
            <ComparisonSummaryCard summary={summary} data1={data1} data2={data2} />
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {isLoading ? <LoadingColumn initialData={initialData1} customDelay={0} /> : <SiteColumn data={data1!} customDelay={0} />}
            {isLoading ? <LoadingColumn initialData={initialData2} customDelay={0.1} /> : <SiteColumn data={data2!} customDelay={0.1} />}
        </div>
    </div>
  );
}
