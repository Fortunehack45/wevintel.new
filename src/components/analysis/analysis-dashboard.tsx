
'use client';
import type { AnalysisResult } from '@/lib/types';
import { OverviewCard } from './overview-card';
import { PerformanceCard } from './performance-card';
import { SecurityCard } from './security-card';
import { HostingCard } from './hosting-card';
import { MetadataCard } from './metadata-card';
import { HeadersCard } from './headers-card';
import { AuditsCard } from './audits-card';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useEffect, useState } from 'react';
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

type PerformancePromise = Promise<Pick<AnalysisResult, 'performance' | 'audits' | 'overview' | 'metadata'>>;

export function AnalysisDashboard({ initialData, performancePromise, onDataLoaded }: { initialData: Partial<AnalysisResult>, performancePromise: PerformancePromise, onDataLoaded: (data: AnalysisResult) => void }) {
  const [, setHistory] = useLocalStorage<AnalysisResult[]>('webintel_history', []);
  const [data, setData] = useState(initialData);

  useEffect(() => {
    let isMounted = true;
    performancePromise.then(performanceResult => {
      if(isMounted) {
        const fullData = {
          ...initialData,
          ...performanceResult,
          overview: {
            ...initialData.overview,
            ...performanceResult.overview,
          },
          metadata: {
            ...initialData.metadata,
            hasRobotsTxt: performanceResult.metadata.hasRobotsTxt,
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
    // Save to history only when we have the full data
    if (data && data.performance) {
      setHistory(prevHistory => {
        const newHistory = [...prevHistory];
        const existingIndex = newHistory.findIndex(item => item.overview.url === data.overview.url);
        
        if (existingIndex > -1) {
            newHistory[existingIndex] = data as AnalysisResult;
        } else {
            newHistory.unshift(data as AnalysisResult);
        }

        return newHistory.slice(0, 20);
      });
    }
  }, [data, setHistory]);


  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 bg-background p-4 rounded-xl">
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
          <SecurityCard data={data.security} />
        </motion.div>
      }
      {data.hosting && 
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={3} className="lg:col-span-2">
          <HostingCard data={data.hosting} />
        </motion.div>
      }
      <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={4} className="lg:col-span-4">
        <AuditsCard data={data.audits} />
      </motion.div>
      {data.metadata &&
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={5} className="lg:col-span-2">
          <MetadataCard data={data.metadata} />
        </motion.div>
      }
      {data.headers && 
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={6} className="lg:col-span-2">
          <HeadersCard data={data.headers} />
        </motion.div>
      }
    </div>
  );
}
