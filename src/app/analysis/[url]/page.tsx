import { AnalysisDashboard } from '@/components/analysis/analysis-dashboard';
import { analyzeUrl } from '@/app/actions/analyze';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AnalysisPage({ params }: { params: { url: string } }) {
  let decodedUrl = '';
  try {
    decodedUrl = decodeURIComponent(params.url);
    // Further validation to ensure it's a http/https URL
    const urlObject = new URL(decodedUrl);
    if (urlObject.protocol !== 'http:' && urlObject.protocol !== 'https:') {
        throw new Error('Invalid protocol');
    }
  } catch (e) {
    return (
        <ErrorAlert title="Invalid URL" description="The provided URL is not valid. Please go back and try again with a valid URL (e.g., https://example.com)." />
    )
  }

  return (
    <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Analysis Report</h1>
          <p className="text-muted-foreground">
            Results for: <a href={decodedUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{decodedUrl}</a>
          </p>
        </div>
        <Suspense fallback={<DashboardSkeleton />}>
          <AnalysisData url={decodedUrl} />
        </Suspense>
    </div>
  );
}

async function AnalysisData({ url }: { url: string }) {
  const analysisResult = await analyzeUrl(url);
  if (analysisResult.error) {
    return <ErrorAlert title="Analysis Failed" description={analysisResult.error} />;
  }
  return <AnalysisDashboard data={analysisResult} />;
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Skeleton className="h-56 rounded-lg lg:col-span-3" />
      <Skeleton className="h-80 rounded-lg lg:col-span-2" />
      <Skeleton className="h-80 rounded-lg" />
      <Skeleton className="h-64 rounded-lg" />
      <Skeleton className="h-64 rounded-lg" />
      <Skeleton className="h-64 rounded-lg lg:col-span-1" />
    </div>
  );
}

function ErrorAlert({title, description}: {title: string, description: string}) {
    return (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
        </Alert>
    );
}
