
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
    isLoading: boolean;
}

const SiteColumn = ({ data, isLoading, customDelay }: { data?: AnalysisResult | null, isLoading: boolean, customDelay: number }) => {
    if (isLoading || !data) {
        return (
            <div className="space-y-6">
                 <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={customDelay + 0.1}>
                    <DashboardSkeleton.SummaryPlaceholder />
                 </motion.div>
                 <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={customDelay + 0.2}>
                    <DashboardSkeleton.PerformancePlaceholder />
                 </motion.div>
                 <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={customDelay + 0.3}>
                    <DashboardSkeleton.AuditPlaceholder />
                 </motion.div>
                 <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={customDelay + 0.4}>
                    <DashboardSkeleton.TechStackPlaceholder />
                 </motion.div>
            </div>
        )
    }
    
    return (
        <div className="flex flex-col space-y-6">
             <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={customDelay + 0.1} className="h-full">
                 <OverviewCard data={data.overview} isLoading={isLoading} />
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

export function ComparisonDashboard({ data1, data2, summary, isLoading }: ComparisonDashboardProps) {

  return (
    <div className='space-y-8'>
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={0}>
            <ComparisonSummaryCard summary={summary} data1={data1} data2={data2} />
        </motion.div>
        
        <div className="grid grid-cols-2 gap-4 items-start">
            <SiteColumn data={data1} isLoading={isLoading || !data1} customDelay={0} />
            <SiteColumn data={data2} isLoading={isLoading || !data2} customDelay={0.1} />
        </div>
    </div>
  );
}
