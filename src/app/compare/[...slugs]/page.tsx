
import { getFastAnalysis, getPerformanceAnalysis } from '@/app/actions/analyze';
import { ComparisonPageContent } from '@/components/compare/comparison-page-content';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import type { Metadata } from 'next';

function ErrorAlert({ title, description }: { title: string, description: string }) {
    return (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
        </Alert>
    );
}

type Props = {
  params: { slugs: string[] }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let decodedUrl1 = 'Site 1';
  let decodedUrl2 = 'Site 2';
  try {
    decodedUrl1 = decodeURIComponent(params.slugs[0]);
    decodedUrl2 = decodeURIComponent(params.slugs[1]);
  } catch (e) { /* Do nothing */ }

  const title = `Comparison: ${new URL(decodedUrl1).hostname} vs ${new URL(decodedUrl2).hostname}`;
  const description = `Side-by-side performance, security, and tech stack comparison.`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://webintel.app/compare/${params.slugs.join('/')}`,
      siteName: 'WebIntel',
      locale: 'en_GB',
      type: 'website',
    },
  }
}

export default async function CompareResultPage({ params }: Props) {
    if (params.slugs.length !== 2) {
        return <ErrorAlert title="Invalid Comparison" description="Please provide exactly two URLs to compare." />;
    }

    let decodedUrl1 = '', decodedUrl2 = '';

    try {
        decodedUrl1 = decodeURIComponent(params.slugs[0]);
        decodedUrl2 = decodeURIComponent(params.slugs[1]);
        const urlObject1 = new URL(decodedUrl1);
        const urlObject2 = new URL(decodedUrl2);
        if ((urlObject1.protocol !== 'http:' && urlObject1.protocol !== 'https:') || (urlObject2.protocol !== 'http:' && urlObject2.protocol !== 'https:')) {
            throw new Error('Invalid protocol');
        }
    } catch(e) {
        return <ErrorAlert title="Invalid URL" description="One or both of the provided URLs are not valid. Please go back and try again." />;
    }
    
    // Run initial analysis for both in parallel
    const [result1, result2] = await Promise.all([
        getFastAnalysis(decodedUrl1),
        getFastAnalysis(decodedUrl2),
    ]);
    
    if ('error' in result1 || 'error' in result2) {
        const error1 = 'error' in result1 ? `Error for ${decodedUrl1}: ${result1.error}` : '';
        const error2 = 'error' in result2 ? `Error for ${decodedUrl2}: ${result2.error}` : '';
        return <ErrorAlert title="Analysis Failed" description={`${error1} ${error2}`.trim()} />;
    }

    return (
        <ComparisonPageContent
            urls={{ url1: decodedUrl1, url2: decodedUrl2 }}
            initialData={{ data1: result1, data2: result2 }}
        />
    )
}
