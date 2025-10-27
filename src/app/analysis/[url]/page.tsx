
import { Suspense } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AnalysisPageContent } from '@/components/analysis/analysis-page-content';
import { type Metadata } from 'next';
import { getFastAnalysis, getPerformanceAnalysis } from '@/app/actions/analyze';
import { Skeleton } from '@/components/ui/skeleton';


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
  params: { url: string }
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


// This is the main page component, now a pure SERVER component.
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

    