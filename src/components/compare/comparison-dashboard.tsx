
'use client';
import type { AnalysisResult } from '@/lib/types';
import { OverviewCard } from '../analysis/overview-card';
import { PerformanceCard } from '../analysis/performance-card';
import { SecurityCard } from '../analysis/security-card';
import { TechStackCarousel } from '../analysis/tech-stack-carousel';
import { ComparisonSummaryCard } from './comparison-summary-card';
import type { ComparisonOutput } from '@/ai/flows/compare-websites-flow';
import { motion } from 'framer-motion';

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

  return (
    <div className='space-y-8'>
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={0}>
            <ComparisonSummaryCard summary={summary} data1={data1} data2={data2} />
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1} className="space-y-6">
                <OverviewCard data={data1.overview} isLoading={false} />
                {data1.performance && <PerformanceCard data={data1.performance} />}
                {data1.security && <SecurityCard data={data1.security} audits={data1.securityAudits} />}
                {data1.techStack && <TechStackCarousel data={data1.techStack} />}
            </motion.div>
            
            <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2} className="space-y-6">
                <OverviewCard data={data2.overview} isLoading={false} />
                {data2.performance && <PerformanceCard data={data2.performance} />}
                {data2.security && <SecurityCard data={data2.security} audits={data2.securityAudits} />}
                {data2.techStack && <TechStackCarousel data={data2.techStack} />}
            </motion.div>
        </div>
    </div>
  );
}
