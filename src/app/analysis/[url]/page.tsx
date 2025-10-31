
import { Suspense } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AnalysisPageContent } from '@/components/analysis/analysis-page-content';
import { type Metadata } from 'next';
import { getFastAnalysis } from '@/app/actions/analyze';
import { DashboardSkeleton } from '@/components/analysis/dashboard-skeleton';
import { NotFoundCard } from '@/components/analysis/not-found-card';
import { clearCacheForUrl } from '@/lib/cache';


function ErrorAlert({title, description}: {title: string, description: string}) {
    return (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
        </Alert>
    );
}

type Props = {
  params: { url: string },
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let decodedUrl = '';
  let domain = 'Invalid URL';
  try {
    decodedUrl = decodeURIComponent(params.url);
    const urlObject = new URL(decodedUrl);
    domain = urlObject.hostname;
  } catch (e) {
    //
  }

  const title = `WebIntel Analysis for ${domain}`;
  const description = `In-depth performance, security, and SEO analysis for ${domain}. Uncover insights with WebIntel.`;
  const openGraphImage = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;


  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `https://webintel.app/analysis/${params.url}`,
      siteName: 'WebIntel',
      images: [
        {
          url: openGraphImage,
          width: 128,
          height: 128,
          alt: `Favicon for ${domain}`
        }
      ],
      locale: 'en_GB',
      type: 'website',
    },
  }
}


export default async function AnalysisPage({ params, searchParams }: Props) {
  let decodedUrl = '';
  try {
    decodedUrl = decodeURIComponent(params.url);
    const urlObject = new URL(decodedUrl);
    if (urlObject.protocol !== 'http:' && urlObject.protocol !== 'https:') {
        throw new Error('Invalid protocol');
    }
  } catch (e) {
    return (
      <div className="px-4 py-8 pb-24 md:pb-8">
        <NotFoundCard url={decodedUrl} message="The provided URL is not valid. Please go back and try again with a valid URL (e.g., https://example.com)." />
      </div>
    )
  }

  const forceRefresh = searchParams.refresh === 'true';
  if (forceRefresh) {
    await clearCacheForUrl(decodedUrl);
  }

  // Perform the initial, fast analysis on the server.
  const fastResult = await getFastAnalysis(decodedUrl);

  if ('error' in fastResult) {
      if (fastResult.error === 'Domain not found. The website is not reachable.' || fastResult.error === 'Could not fetch the main page of the website. It might be down or blocking requests.') {
          return (
            <div className="px-4 py-8 pb-24 md:pb-8">
                <NotFoundCard url={decodedUrl} message={fastResult.error} />
            </div>
          );
      }
      return (
        <div className="px-4 py-8 pb-24 md:pb-8">
            <ErrorAlert title="Analysis Failed" description={fastResult.error} />
        </div>
      );
  }

  // Pass the initial data to the client component to handle the rest.
  return (
    <div className="px-4 py-8 pb-24 md:pb-16">
        <AnalysisPageContent decodedUrl={decodedUrl} initialData={fastResult} />
    </div>
  );
}
