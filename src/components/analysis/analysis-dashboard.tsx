

'use client';
import type { AnalysisResult, AuditInfo } from '@/lib/types';
import { OverviewCard } from './overview-card';
import { PerformanceCard } from './performance-card';
import { SecurityCard } from './security-card';
import { HostingCard } from './hosting-card';
import { MetadataCard } from './metadata-card';
import { HeadersCard } from './headers-card';
import { AuditsCard } from './audits-card';
import { DiagnosticsCard } from './diagnostics-card';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { OverallScoreCard } from './overall-score-card';
import { DashboardSkeleton } from './dashboard-skeleton';

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

type PerformancePromise = Promise<Pick<AnalysisResult, 'performance' | 'performanceAudits' | 'securityAudits' | 'diagnosticsAudits' | 'overview' | 'metadata'>>;

export function AnalysisDashboard({ initialData, performancePromise, onDataLoaded }: { initialData: Partial<AnalysisResult>, performancePromise: PerformancePromise, onDataLoaded: (data: AnalysisResult) => void }) {
  const [, setHistory] = useLocalStorage<AnalysisResult[]>('webintel_history', []);
  const [data, setData] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    let isMounted = true;
    performancePromise.then(performanceResult => {
      if(isMounted) {
        
        const securityAudits = performanceResult.securityAudits || {};
        let securityScoreTotal = 0;
        let securityItemsScored = 0;
        
        if (initialData.security?.isSecure) {
            securityScoreTotal += 1;
        }
        securityItemsScored++;

        Object.values(initialData.security?.securityHeaders || {}).forEach(present => {
            if (present) securityScoreTotal++;
            securityItemsScored++;
        });

        Object.values(securityAudits).forEach(audit => {
            if (audit.score !== null) {
                securityScoreTotal += audit.score;
                securityItemsScored++;
            }
        });

        const calculatedSecurityScore = securityItemsScored > 0 ? Math.round((securityScoreTotal / securityItemsScored) * 100) : 0;

        const fullData = {
          ...initialData,
          ...performanceResult,
          overview: {
            // Prioritize performance result's overview, but fallback to initialData's
            ...initialData.overview,
            ...performanceResult.overview,
            // Explicitly keep the better title if the perf one is bad
            title: performanceResult.overview?.title?.startsWith('http') ? initialData.overview?.title : performanceResult.overview?.title,
          },
          metadata: {
            ...initialData.metadata,
            hasRobotsTxt: performanceResult.metadata.hasRobotsTxt,
          },
          security: {
            ...initialData.security,
            securityScore: calculatedSecurityScore,
          }
        } as AnalysisResult;

        setData(fullData);
        onDataLoaded(fullData);
      }
    });

    return () => {
      isMounted = false;
    }

  }, [performancePromise, initialData, onDataLoaded]);
  
  useEffect(() => {
    if (data && data.performance) {
      setHistory(prevHistory => {
        const newHistory = [...prevHistory];
        const existingIndex = newHistory.findIndex(item => item.overview.url === data.overview?.url);
        
        if (existingIndex > -1) {
            newHistory[existingIndex] = data as AnalysisResult;
        } else {
            newHistory.unshift(data as AnalysisResult);
        }

        return newHistory.slice(0, 20);
      });
    }
  }, [data, setHistory]);

  const totalAuditScore = useMemo(() => {
    if (!data) return null;
    const allAudits: (AuditInfo | undefined)[] = [data.performanceAudits, data.securityAudits, data.diagnosticsAudits];
    let totalScore = 0;
    let scoreCount = 0;

    allAudits.forEach(auditInfo => {
      if (auditInfo) {
        Object.values(auditInfo).forEach(audit => {
          if (audit.score !== null) {
            totalScore += audit.score;
            scoreCount++;
          }
        });
      }
    });

    if (scoreCount === 0) return null;
    return Math.round((totalScore / scoreCount) * 100);
  }, [data]);


  if (!data) {
    return <DashboardSkeleton initialData={initialData} />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {data.overview && 
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={0} className="lg:col-span-4">
          <OverviewCard data={data.overview} />
        </motion.div>
      }
      <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1} className="lg:col-span-4">
        <PerformanceCard data={data.performance} />
      </motion.div>
      {data.security && 
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2} className="lg:col-span-2">
          <SecurityCard data={data.security} audits={data.securityAudits} />
        </motion.div>
      }
      {data.hosting && 
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={3} className="lg:col-span-1">
          <HostingCard data={data.hosting} />
        </motion.div>
      }
      <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={3} className="lg:col-span-1">
        <OverallScoreCard score={totalAuditScore} />
      </motion.div>
      <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={4} className="lg:col-span-2">
        <AuditsCard data={data.performanceAudits} />
      </motion.div>
      <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={5} className="lg:col-span-2">
        <DiagnosticsCard data={data.diagnosticsAudits} />
      </motion.div>
      {data.metadata &&
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={6} className="lg:col-span-2">
          <MetadataCard data={data.metadata} />
        </motion.div>
      }
      {data.headers && 
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={7} className="lg:col-span-2">
          <HeadersCard data={data.headers} />
        </motion.div>
      }
    </div>
  );
}
