

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
import { getPerformanceAnalysis } from '@/app/actions/analyze';
import { SummaryCard } from './summary-card';

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

export function AnalysisDashboard({ initialData, onDataLoaded }: { initialData: Partial<AnalysisResult>, onDataLoaded: (data: AnalysisResult) => void }) {
  const [, setHistory] = useLocalStorage<AnalysisResult[]>('webintel_history', []);
  const [fullData, setFullData] = useState<AnalysisResult | null>(null);
  const [isPerfLoading, setIsPerfLoading] = useState(false);

  useEffect(() => {
    // When initial data is loaded, set it as the full data (but partial)
    // This allows the UI to render immediately with the fast analysis results.
    setFullData(initialData as AnalysisResult);
    onDataLoaded(initialData as AnalysisResult);
  }, [initialData, onDataLoaded]);
  
  useEffect(() => {
    // This effect runs when the full data (including performance) is available.
    // It updates the history.
    if (fullData && fullData.performance) {
      setHistory(prevHistory => {
        const newHistory = [...prevHistory];
        const existingIndex = newHistory.findIndex(item => item.overview.url === fullData.overview?.url);
        
        if (existingIndex > -1) {
            newHistory[existingIndex] = fullData as AnalysisResult;
        } else {
            newHistory.unshift(fullData as AnalysisResult);
        }

        return newHistory.slice(0, 20);
      });
    }
  }, [fullData, setHistory]);

  const handleRunPerformance = async () => {
    if (!fullData?.overview.url) return;
    setIsPerfLoading(true);

    const performanceResult = await getPerformanceAnalysis(fullData.overview.url);
    
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

    const updatedData = {
      ...initialData,
      ...performanceResult,
      overview: {
        ...initialData.overview,
        ...performanceResult.overview,
        title: performanceResult.overview?.title || initialData.overview?.title,
        description: performanceResult.overview?.description || initialData.overview?.description,
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

    setFullData(updatedData);
    onDataLoaded(updatedData);
    setIsPerfLoading(false);
  }

  const totalAuditScore = useMemo(() => {
    if (!fullData?.performance) return null; // Only calculate if performance data is available
    const allAudits: (AuditInfo | undefined)[] = [fullData.performanceAudits, fullData.securityAudits, fullData.diagnosticsAudits];
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
  }, [fullData]);


  if (!fullData) {
    return <DashboardSkeleton />;
  }

  const { overview, security, hosting, metadata, headers, performance, performanceAudits, securityAudits, diagnosticsAudits } = fullData;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {overview && 
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={0} className="lg:col-span-4">
          <OverviewCard 
            data={overview}
            hasPerformanceRun={!!performance}
            isLoading={isPerfLoading}
            onRunPerformance={handleRunPerformance}
          />
        </motion.div>
      }

      <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1} className="lg:col-span-2">
        <SummaryCard data={initialData} />
      </motion.div>

      {performance ? (
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1} className="lg:col-span-2">
          <PerformanceCard data={performance} />
        </motion.div>
      ) : (
         <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1} className="lg:col-span-2">
          <DashboardSkeleton.PerformancePlaceholder />
        </motion.div>
      )}

      {security && 
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2} className="lg:col-span-2">
          <SecurityCard data={security} audits={securityAudits} />
        </motion.div>
      }
      {hosting && 
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={3} className="lg:col-span-1">
          <HostingCard data={hosting} />
        </motion.div>
      }
      
      {performance ? (
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={3} className="lg:col-span-1">
          <OverallScoreCard score={totalAuditScore} />
        </motion.div>
      ) : (
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={3} className="lg:col-span-1">
           <DashboardSkeleton.ScorePlaceholder />
        </motion.div>
      )}

      {performanceAudits && 
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={4} className="lg:col-span-2">
          <AuditsCard data={performanceAudits} />
        </motion.div>
      }
      
      {diagnosticsAudits &&
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={5} className="lg:col-span-2">
          <DiagnosticsCard data={diagnosticsAudits} />
        </motion.div>
      }

      {metadata &&
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={6} className="lg:col-span-2">
          <MetadataCard data={metadata} />
        </motion.div>
      }
      {headers && 
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={7} className="lg:col-span-2">
          <HeadersCard data={headers} />
        </motion.div>
      }
    </div>
  );
}
