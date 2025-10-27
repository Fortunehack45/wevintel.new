

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
import { TrafficCard } from './traffic-card';


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

export function AnalysisDashboard({ initialData }: { initialData: AnalysisResult }) {
  const [, setHistory] = useLocalStorage<AnalysisResult[]>('webintel_history', []);
  
  useEffect(() => {
    // Only save to history if we have the full performance data
    if (initialData.performance) {
      setHistory(prevHistory => {
        const newHistory = [...prevHistory];
        const existingIndex = newHistory.findIndex(item => item.overview.url === initialData.overview?.url);
        
        if (existingIndex > -1) {
            // Update the existing record with the latest full data
            newHistory[existingIndex] = initialData;
        } else {
            // Add new record
            newHistory.unshift(initialData);
        }

        return newHistory.slice(0, 20);
      });
    }
  }, [initialData, setHistory]);


  const totalAuditScore = useMemo(() => {
    if (!initialData.performance) return null; // Don't calculate score for partial data
    
    const allAudits: (AuditInfo | undefined)[] = [initialData.performanceAudits, initialData.securityAudits, initialData.diagnosticsAudits];
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
  }, [initialData]);

  const { overview, security, hosting, metadata, headers, performance, performanceAudits, securityAudits, diagnosticsAudits, traffic, aiSummary } = initialData;

  const isLoadingFullReport = !performance;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {overview && 
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={0} className="lg:col-span-4">
          <OverviewCard 
            data={overview}
            isLoading={isLoadingFullReport}
          />
        </motion.div>
      }
      
      <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1} className="lg:col-span-2">
        <SummaryCard 
          data={initialData}
          summary={aiSummary}
          isLoading={!aiSummary}
        />
      </motion.div>


      {isLoadingFullReport || !traffic ? (
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2} className="lg:col-span-2">
           <DashboardSkeleton.TrafficPlaceholder />
        </motion.div>
      ) : (
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2} className="lg:col-span-2">
          <TrafficCard data={traffic} />
        </motion.div>
      )}

      {isLoadingFullReport ? (
         <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={3} className="lg:col-span-4">
          <DashboardSkeleton.PerformancePlaceholder />
        </motion.div>
      ) : (
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={3} className="lg:col-span-4">
          <PerformanceCard data={performance} />
        </motion.div>
      )}

      {security && 
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={4} className="lg:col-span-1">
          <SecurityCard data={security} audits={securityAudits} />
        </motion.div>
      }
      
      {hosting && 
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={5} className="lg:col-span-1">
          <HostingCard data={hosting} />
        </motion.div>
      }
      
      {isLoadingFullReport ? (
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={5} className="lg:col-span-1">
           <DashboardSkeleton.ScorePlaceholder />
        </motion.div>
      ) : (
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={5} className="lg:col-span-1">
          <OverallScoreCard score={totalAuditScore} />
        </motion.div>
      )}

      {metadata &&
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={4} className="lg:col-span-1">
          <MetadataCard data={metadata} />
        </motion.div>
      }

      {isLoadingFullReport ? (
        <>
            <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={6} className="lg:col-span-2">
                <DashboardSkeleton.AuditPlaceholder />
            </motion.div>
            <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={7} className="lg:col-span-2">
                <DashboardSkeleton.AuditPlaceholder />
            </motion.div>
        </>
      ) : (
        <>
            {performanceAudits && 
                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={6} className="lg:col-span-2">
                <AuditsCard data={performanceAudits} />
                </motion.div>
            }
            
            {diagnosticsAudits &&
                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={7} className="lg:col-span-2">
                <DiagnosticsCard data={diagnosticsAudits} />
                </motion.div>
            }
        </>
      )}


      {headers && 
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={8} className="lg:col-span-4">
          <HeadersCard data={headers} />
        </motion.div>
      }
    </div>
  );
}
