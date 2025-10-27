
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
    data1: AnalysisResult;
    data2: AnalysisResult;
    summary: ComparisonOutput | { error: string } | null;
}

const SiteColumn = ({ data, isLoading, customDelay }: { data: AnalysisResult, isLoading: boolean, customDelay: number }) => {
    return (
        <div className="space-y-6">
             <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={customDelay + 0.1}>
                 <OverviewCard data={data.overview} isLoading={isLoading} />
             </motion.div>
             <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={customDelay + 0.2}>
                {isLoading ? <DashboardSkeleton.PerformancePlaceholder /> : <PerformanceCard data={data.performance} />}
             </motion.div>
             <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={customDelay + 0.3}>
                 <SecurityCard data={data.security} audits={data.securityAudits} />
             </motion.div>
              <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={customDelay + 0.4}>
                 <HostingCard data={data.hosting} />
             </motion.div>
             <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={customDelay + 0.5}>
                {isLoading ? <DashboardSkeleton.TechStackPlaceholder /> : <TechStackCarousel data={data.techStack} />}
            </motion.div>
        </div>
    )
}

export function ComparisonDashboard({ data1, data2, summary }: ComparisonDashboardProps) {

  const isLoading1 = !data1.performance;
  const isLoading2 = !data2.performance;

  return (
    <div className='space-y-8'>
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={0}>
            <ComparisonSummaryCard summary={summary} data1={data1} data2={data2} />
        </motion.div>
        
        <div className="grid grid-cols-2 gap-4 md:gap-8 items-start">
            <SiteColumn data={data1} isLoading={isLoading1} customDelay={0} />
            <SiteColumn data={data2} isLoading={isLoading2} customDelay={0.1} />
        </div>
    </div>
  );
}
