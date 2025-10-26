
'use client';

import { Suspense, useEffect, useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { type AnalysisResult } from '@/lib/types';
import { getFastAnalysis, getPerformanceAnalysis } from '@/app/actions/analyze';
import { AnalysisDashboard } from '@/components/analysis/analysis-dashboard';


function ErrorAlert({title, description}: {title: string, description: string}) {
    return (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
        </Alert>
    );
}

export function AnalysisPageContent({ decodedUrl }: { decodedUrl: string }) {
    const [key, setKey] = useState(Date.now());
    
    return (
        <div className="flex-1">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Analysis Report</h1>
                    <p className="text-muted-foreground">
                        Results for: <a href={decodedUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{decodedUrl}</a>
                    </p>
                </div>
                <Button variant="outline" onClick={() => setKey(Date.now())}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Re-analyze
                </Button>
            </div>
            <AnalysisData url={decodedUrl} cacheKey={key} />
        </div>
    );
}

type PerformancePromise = ReturnType<typeof getPerformanceAnalysis>;

function AnalysisData({ url, cacheKey }: { url: string; cacheKey: number }) {
  const [analysisResult, setAnalysisResult] = useState<Partial<AnalysisResult> | null>(null);
  const [performancePromise, setPerformancePromise] = useState<PerformancePromise | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        setPerformancePromise(null);
        try {
            const data = await getFastAnalysis(url);
            if ('error' in data) {
                setError(data.error);
            } else {
                setAnalysisResult(data);
                // Set the performance promise *after* the fast analysis is complete
                setPerformancePromise(getPerformanceAnalysis(url));
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();
  }, [url, cacheKey]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <ErrorAlert title="Analysis Failed" description={error} />;
  }
  
  if (analysisResult && performancePromise) {
    return (
      <AnalysisDashboard 
        initialData={analysisResult} 
        performancePromise={performancePromise}
      />
    );
  }

  return null;
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Skeleton className="h-56 rounded-2xl lg:col-span-3" />
      <Skeleton className="h-80 rounded-2xl lg:col-span-2" />
      <Skeleton className="h-80 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl lg:col-span-1" />
    </div>
  );
}

