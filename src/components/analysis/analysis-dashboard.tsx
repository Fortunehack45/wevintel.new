'use client';
import type { AnalysisResult } from '@/lib/types';
import { OverviewCard } from './overview-card';
import { PerformanceCard } from './performance-card';
import { SecurityCard } from './security-card';
import { HostingCard } from './hosting-card';
import { MetadataCard } from './metadata-card';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useEffect } from 'react';

export function AnalysisDashboard({ data }: { data: AnalysisResult }) {
  const [history, setHistory] = useLocalStorage<AnalysisResult[]>('analysis-history', []);

  useEffect(() => {
    if (data && data.id) {
      // Avoid adding duplicates
      if (!history.find(item => item.id === data.id)) {
        const newHistory = [data, ...history].slice(0, 20); // Keep last 20
        setHistory(newHistory);
      }
    }
  }, [data, history, setHistory]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div className="xl:col-span-4">
        <OverviewCard data={data.overview} />
      </div>
      <div className="lg:col-span-2 xl:col-span-3">
        <PerformanceCard data={data.performance} />
      </div>
      <div className="lg:col-span-1 xl:col-span-1">
        <SecurityCard data={data.security} />
      </div>
      <div className="xl:col-span-2">
        <HostingCard data={data.hosting} />
      </div>
      <div className="xl:col-span-2">
        <MetadataCard data={data.metadata} />
      </div>
    </div>
  );
}
