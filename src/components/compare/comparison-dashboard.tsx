
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
import { AlertTriangle } from 'lucide-react';

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
    data1?: AnalysisResult | null;
    data2?: AnalysisResult | null;
    summary: ComparisonOutput | { error: string } | null;
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


const SiteColumn = ({ data, customDelay }: { data?: AnalysisResult | null, customDelay: number }) => {
    if (!data || data.error) {
        return (
            <div className="space-y-6">
                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={customDelay + 0.1}>
                   {data && <AnalysisFailedCard error={data.error!} domain={data.overview.domain} />}
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

const LoadingState = () => (
    <div className='space-y-8'>
        <Card className="w-full">
            <CardContent className="p-6">
                <DashboardSkeleton.SummaryPlaceholder />
            </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
             <SiteColumn customDelay={0} />
             <SiteColumn customDelay={0.1} />
        </div>
    </div>
);


export function ComparisonDashboard({ data1, data2, summary }: ComparisonDashboardProps) {
  if (!data1 || !data2) {
    return <LoadingState />;
  }

  return (
    <div className='space-y-8'>
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={0}>
            <ComparisonSummaryCard summary={summary} data1={data1} data2={data2} />
        </motion.div>
        
        <div className="grid grid-cols-2 gap-4 items-start">
            <SiteColumn data={data1} customDelay={0} />
            <SiteColumn data={data2} customDelay={0.1} />
        </div>
    </div>
  );
}
