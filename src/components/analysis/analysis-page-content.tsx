
'use client';

import { Suspense, useEffect, useState, useMemo, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, RefreshCw, Download } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { type AnalysisResult } from '@/lib/types';
import { getFastAnalysis, getPerformanceAnalysis } from '@/app/actions/analyze';
import { AnalysisDashboard } from '@/components/analysis/analysis-dashboard';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
    const reportRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadPdf = async () => {
        const element = reportRef.current;
        if (!element) return;
        
        setIsDownloading(true);

        try {
            const canvas = await html2canvas(element, {
                scale: 2, // Higher scale for better quality
                useCORS: true,
                backgroundColor: null, // Use element's background
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`webintel-report-${new URL(decodedUrl).hostname}.pdf`);
        } catch (error) {
            console.error("Failed to generate PDF", error);
        } finally {
            setIsDownloading(false);
        }
    };
    
    return (
        <div className="flex-1">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Analysis Report</h1>
                    <p className="text-muted-foreground">
                        Results for: <a href={decodedUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{decodedUrl}</a>
                    </p>
                </div>
                <div className='flex items-center gap-2'>
                    <Button variant="outline" onClick={() => setKey(Date.now())} disabled={isDownloading}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Re-analyze
                    </Button>
                    <Button onClick={handleDownloadPdf} disabled={isDownloading}>
                         {isDownloading ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                         ) : (
                            <Download className="mr-2 h-4 w-4" />
                         )}
                        Download PDF
                    </Button>
                </div>
            </div>
            <div ref={reportRef}>
                <AnalysisData url={decodedUrl} cacheKey={key} />
            </div>
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Skeleton className="h-56 rounded-2xl lg:col-span-4" />
      <Skeleton className="h-80 rounded-2xl lg:col-span-2" />
      <Skeleton className="h-80 rounded-2xl lg:col-span-2" />
      <Skeleton className="h-64 rounded-2xl lg:col-span-4" />
      <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
      <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
    </div>
  );
}


