// This is a Client Component that receives a simple string prop.
// All state, effects, and user interactions happen here.
'use client';

import { AnalysisDashboard } from '@/components/analysis/analysis-dashboard';
import { Suspense, useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { type AnalysisResult } from '@/lib/types';
import { analyzeUrl } from '@/app/actions/analyze';

function AnalysisPageContent({ decodedUrl }: { decodedUrl: string }) {
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
            <Suspense fallback={<DashboardSkeleton />}>
                <AnalysisData url={decodedUrl} cacheKey={key} />
            </Suspense>
        </div>
    );
}


function AnalysisData({ url, cacheKey }: { url: string; cacheKey: number }) {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | { error: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        setIsLoading(true);
        try {
            const data = await analyzeUrl(url);
            setAnalysisResult(data);
        } catch (error: any) {
            setAnalysisResult({ error: error.message });
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();
  }, [url, cacheKey]);


  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (analysisResult && 'error' in analysisResult) {
    return <ErrorAlert title="Analysis Failed" description={analysisResult.error} />;
  }
  
  if (analysisResult) {
    return <AnalysisDashboard data={analysisResult} />;
  }

  return null;
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Skeleton className="h-56 rounded-2xl lg:col-span-3 glass-card" />
      <Skeleton className="h-80 rounded-2xl lg:col-span-2 glass-card" />
      <Skeleton className="h-80 rounded-2xl glass-card" />
      <Skeleton className="h-64 rounded-2xl glass-card" />
      <Skeleton className="h-64 rounded-2xl glass-card" />
      <Skeleton className="h-64 rounded-2xl lg:col-span-1 glass-card" />
    </div>
  );
}

function ErrorAlert({title, description}: {title: string, description: string}) {
    return (
        <Alert variant="destructive" className="glass-card">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>

            <AlertDescription>{description}</AlertDescription>
        </Alert>
    );
}

// This is the main page component, now a SERVER component.
// It is async and handles the params object from the URL.
export default function AnalysisPage({ params }: { params: { url: string } }) {
  let decodedUrl = '';
  try {
    // The params object is handled here, in a Server Component.
    decodedUrl = decodeURIComponent(params.url);
    const urlObject = new URL(decodedUrl);
    if (urlObject.protocol !== 'http:' && urlObject.protocol !== 'https:') {
        throw new Error('Invalid protocol');
    }
  } catch (e) {
    return (
        <ErrorAlert title="Invalid URL" description="The provided URL is not valid. Please go back and try again with a valid URL (e.g., https://example.com)." />
    )
  }

  // We pass the clean, validated string as a prop to the client component.
  return <AnalysisPageContent decodedUrl={decodedUrl} />;
}
