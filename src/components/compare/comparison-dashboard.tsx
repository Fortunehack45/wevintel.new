
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

export function ComparisonDashboard({ data1, data2, summary }: ComparisonDashboardProps) {

  const isLoading1 = !data1.performance;
  const isLoading2 = !data2.performance;

  return (
    <div className='space-y-8'>
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={0}>
            <ComparisonSummaryCard summary={summary} data1={data1} data2={data2} />
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1} className="space-y-6">
                <OverviewCard data={data1.overview} isLoading={isLoading1} />
                {isLoading1 ? <DashboardSkeleton.PerformancePlaceholder /> : <PerformanceCard data={data1.performance} />}
                <SecurityCard data={data1.security} audits={data1.securityAudits} />
                {isLoading1 ? <DashboardSkeleton.TechStackPlaceholder /> : <TechStackCarousel data={data1.techStack} />}
            </motion.div>
            
            <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2} className="space-y-6">
                <OverviewCard data={data2.overview} isLoading={isLoading2} />
                {isLoading2 ? <DashboardSkeleton.PerformancePlaceholder /> : <PerformanceCard data={data2.performance} />}
                <SecurityCard data={data2.security} audits={data2.securityAudits} />
                {isLoading2 ? <DashboardSkeleton.TechStackPlaceholder /> : <TechStackCarousel data={data2.techStack} />}
            </motion.div>
        </div>
    </div>
  );
}
