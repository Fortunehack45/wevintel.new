'use client';
import type { AnalysisResult } from '@/lib/types';
import { OverviewCard } from './overview-card';
import { PerformanceCard } from './performance-card';
import { SecurityCard } from './security-card';
import { HostingCard } from './hosting-card';
import { MetadataCard } from './metadata-card';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useEffect } from 'react';
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

export function AnalysisDashboard({ data }: { data: AnalysisResult }) {
  const [history, setHistory] = useLocalStorage<AnalysisResult[]>('webintel_history', []);

  useEffect(() => {
    if (data && data.id) {
      setHistory(prevHistory => {
        // Avoid adding duplicates based on URL and recent timestamp
        const existingIndex = prevHistory.findIndex(item => item.overview.url === data.overview.url);
        const newHistory = [...prevHistory];
        
        if (existingIndex > -1) {
            // If it exists, replace it to update data
            newHistory[existingIndex] = data;
        } else {
            // If not, add it
            newHistory.unshift(data);
        }

        // Keep only the last 20 entries
        return newHistory.slice(0, 20);
      });
    }
  }, [data, setHistory]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={0} className="xl:col-span-4">
        <OverviewCard data={data.overview} />
      </motion.div>
      <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1} className="lg:col-span-2 xl:col-span-3">
        <PerformanceCard data={data.performance} />
      </motion.div>
      <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2} className="lg:col-span-1 xl:col-span-1">
        <SecurityCard data={data.security} />
      </motion.div>
      <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={3} className="xl:col-span-2">
        <HostingCard data={data.hosting} />
      </motion.div>
      <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={4} className="xl:col-span-2">
        <MetadataCard data={data.metadata} />
      </motion.div>
    </div>
  );
}
