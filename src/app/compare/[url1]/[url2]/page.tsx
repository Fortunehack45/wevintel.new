
'use server';

import { getFastAnalysis, getPerformanceAnalysis } from '@/app/actions/analyze';
import { getAdditionalAnalysis } from '@/app/actions/get-additional-analysis';
import { summarizeWebsite, WebsiteAnalysisInput } from '@/ai/flows/summarize-flow';
import { estimateTraffic } from '@/ai/flows/traffic-estimate-flow';
import { detectTechStack } from '@/ai/flows/tech-stack-flow';
import { compareWebsites } from '@/ai/flows/compare-websites-flow';
import { ComparisonPageContent } from '@/components/compare/comparison-page-content';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AnalysisResult, ComparisonInput, ComparisonOutput, Metadata, SecurityData } from '@/lib/types';
import { AlertTriangle } from 'lucide-react';
import type { Metadata as NextMetadata } from 'next';
import { NotFoundCard } from '@/components/analysis/not-found-card';

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

const getFullAnalysis = async (url: string): Promise<AnalysisResult> => {
    const fastResult = await getFastAnalysis(url);
    if ('error' in fastResult) {
        throw new Error(fastResult.error);
    }

    const aiSummaryInput: WebsiteAnalysisInput = {
        overview: fastResult.overview!,
        security: fastResult.security!,
        hosting: fastResult.hosting!,
        headers: fastResult.headers,
    };

    const [perfResult, additionalResult, summaryResult, trafficResult, techStackResult] = await Promise.allSettled([
        getPerformanceAnalysis(url),
        getAdditionalAnalysis(url),
        summarizeWebsite(aiSummaryInput),
        estimateTraffic({ url, description: fastResult.overview?.description || '' }),
        detectTechStack({ url, htmlContent: fastResult.overview?.htmlContent || '', headers: fastResult.headers || {} }),
    ]);

    const fullPerfData = perfResult.status === 'fulfilled' ? perfResult.value : {};
    const additionalValue = additionalResult.status === 'fulfilled' ? additionalResult.value : { status: undefined };
    const summaryValue = summaryResult.status === 'fulfilled' ? summaryResult.value : { error: summaryResult.reason?.message || 'Failed to generate summary.' };
    const trafficValue = trafficResult.status === 'fulfilled' ? trafficResult.value : undefined;
    const techStackValue = techStackResult.status === 'fulfilled' ? techStackResult.value : undefined;

    const getSecurityScore = (data: Partial<AnalysisResult>) => {
        if (!data.security) return 0;
        let total = 0, count = 0;
        if(data.security.isSecure) { total++; count++; }
        Object.values(data.security.securityHeaders || {}).forEach(v => { if(v) total++; count++; });
        if(data.securityAudits) {
            Object.values(data.securityAudits).forEach(a => { if (a.score !== null) { total += a.score; count++; } });
        }
        return count > 0 ? Math.round((total / count) * 100) : 0;
    }
    
    const finalResult: AnalysisResult = {
        ...(fastResult as AnalysisResult),
        ...fullPerfData,
        overview: {
            ...fastResult.overview!,
            ...('overview' in fullPerfData ? fullPerfData.overview : {}),
            title: ('overview' in fullPerfData && fullPerfData.overview?.title) || fastResult.overview?.title,
            description: ('overview' in fullPerfData && fullPerfData.overview?.description) || fastResult.overview?.description,
        },
        metadata: {
            ...fastResult.metadata!,
            hasRobotsTxt: 'metadata' in fullPerfData && fullPerfData.metadata ? fullPerfData.metadata.hasRobotsTxt : false,
            hasSitemapXml: 'metadata' in fullPerfData && fullPerfData.metadata ? fullPerfData.metadata.hasSitemapXml : false,
        },
        security: {
            ...fastResult.security!,
            securityScore: getSecurityScore({ ...fastResult, ...fullPerfData }),
        },
        aiSummary: summaryValue,
        traffic: trafficValue,
        techStack: techStackValue,
        status: additionalValue.status,
    };
    return finalResult;
};


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
        <ComparisonPageContent
            urls={{ url1: decodedUrl1, url2: decodedUrl2 }}
            initialData1={!('error' in fastRes1) ? fastRes1 : { error: fastRes1.error, overview: {url: decodedUrl1, domain: new URL(decodedUrl1).hostname}}}
            initialData2={!('error' in fastRes2) ? fastRes2 : { error: fastRes2.error, overview: {url: decodedUrl2, domain: new URL(decodedUrl2).hostname}}}
            getFullAnalysis={getFullAnalysis}
        />
    )
}
