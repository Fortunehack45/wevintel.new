

'use server';

import { getFastAnalysis } from '@/app/actions/analyze';
import { ComparisonPageContent } from '@/components/compare/comparison-page-content';
import { NotFoundCard } from '@/components/analysis/not-found-card';
import type { Metadata as NextMetadata } from 'next';

type Props = {
  params: { url1: string, url2: string }
}

export async function generateMetadata({ params }: Props): Promise<NextMetadata> {
  let decodedUrl1 = 'Site 1';
  let decodedUrl2 = 'Site 2';
  let domain1 = 'site1.com';
  let domain2 = 'site2.com';
  try {
    decodedUrl1 = decodeURIComponent(params.url1);
    decodedUrl2 = decodeURIComponent(params.url2);
    domain1 = new URL(decodedUrl1).hostname;
    domain2 = new URL(decodedUrl2).hostname;
  } catch (e) { /* Do nothing */ }

  const title = `Comparison: ${domain1} vs ${domain2}`;
  const description = `Side-by-side performance, security, and tech stack comparison.`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://webintel.app/compare/${params.url1}/${params.url2}`,
      siteName: 'WebIntel',
      locale: 'en_GB',
      type: 'website',
    },
  }
}

export default async function CompareResultPage({ params }: { params: { url1: string, url2: string } }) {
    let decodedUrl1 = '', decodedUrl2 = '';
    
    try {
        decodedUrl1 = decodeURIComponent(params.url1);
        decodedUrl2 = decodeURIComponent(params.url2);
        new URL(decodedUrl1);
        new URL(decodedUrl2);
    } catch(e) {
        return <NotFoundCard url={decodedUrl1 || decodedUrl2} message="One or both of the provided URLs are not valid. Please go back and try again." />;
    }
    
    // Server-side fast analysis
    const [fastRes1, fastRes2] = await Promise.all([
        getFastAnalysis(decodedUrl1),
        getFastAnalysis(decodedUrl2)
    ]);
    
    // We will now pass the initial data to the client and let it fetch the full report.
    // This makes the initial page load much faster.

    return (
        <div>
            <ComparisonPageContent
                urls={{ url1: decodedUrl1, url2: decodedUrl2 }}
                initialData1={!('error' in fastRes1) ? fastRes1 : { error: fastRes1.error, overview: {url: decodedUrl1, domain: new URL(decodedUrl1).hostname}}}
                initialData2={!('error' in fastRes2) ? fastRes2 : { error: fastRes2.error, overview: {url: decodedUrl2, domain: new URL(decodedUrl2).hostname}}}
            />
        </div>
    )
}
