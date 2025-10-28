
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

const fetchAnalysisForUrl = async (url: string): Promise<AnalysisResult | null> => {
    try {
        const fastResult = await getFastAnalysis(url);
        if ('error' in fastResult) {
            console.error(`Fast analysis failed for ${url}: ${fastResult.error}`);
            // Return a partial error result to show on the UI
            try {
                return {
                    id: crypto.randomUUID(),
                    overview: { url, domain: new URL(url).hostname, favicon: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`},
                    error: fastResult.error,
                    createdAt: new Date().toISOString(),
                    partial: true
                };
            } catch {
                return {
                    id: crypto.randomUUID(),
                    overview: { url, domain: 'Invalid URL', favicon: '' },
                    error: 'The provided URL was invalid.',
                    createdAt: new Date().toISOString(),
                    partial: true
                };
            }
        }

        const aiSummaryInput: WebsiteAnalysisInput = {
            overview: fastResult.overview!,
            security: fastResult.security!,
            hosting: fastResult.hosting!,
            headers: fastResult.headers,
        };

        const [perfResult, summaryResult, trafficResult, techStackResult, additionalResult] = await Promise.allSettled([
            getPerformanceAnalysis(url),
            summarizeWebsite(aiSummaryInput),
            estimateTraffic({ url, description: fastResult.overview?.description || '' }),
            detectTechStack({ url, htmlContent: fastResult.overview?.htmlContent || '', headers: fastResult.headers || {} }),
            getAdditionalAnalysis(url),
        ]);

        const fullPerfData = perfResult.status === 'fulfilled' ? perfResult.value : {};
        
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
            aiSummary: summaryResult.status === 'fulfilled' ? summaryResult.value : { error: summaryResult.reason?.message || 'Failed to generate summary.'},
            traffic: trafficResult.status === 'fulfilled' ? trafficResult.value : undefined,
            techStack: techStackResult.status === 'fulfilled' ? techStackResult.value : undefined,
            status: additionalResult.status === 'fulfilled' ? additionalResult.value.status : undefined,
        };
        return finalResult;
    } catch (e: any) {
        console.error(`Failed to analyze ${url}:`, e);
        try {
            return {
                id: crypto.randomUUID(),
                overview: { url, domain: new URL(url).hostname, favicon: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`},
                error: e.message || 'An unknown error occurred during analysis.',
                createdAt: new Date().toISOString(),
                partial: true
            };
        } catch {
             return {
                id: crypto.randomUUID(),
                overview: { url, domain: 'Invalid URL', favicon: ''},
                error: 'The provided URL was invalid.',
                createdAt: new Date().toISOString(),
                partial: true
            };
        }
    }
};


export default async function CompareResultPage({ params }: Props) {
    let decodedUrl1 = '', decodedUrl2 = '';

    try {
        decodedUrl1 = decodeURIComponent(params.url1);
        decodedUrl2 = decodeURIComponent(params.url2);
        const urlObject1 = new URL(decodedUrl1);
        const urlObject2 = new URL(decodedUrl2);
        if ((urlObject1.protocol !== 'http:' && urlObject1.protocol !== 'https:') || (urlObject2.protocol !== 'http:' && urlObject2.protocol !== 'https:')) {
            throw new Error('Invalid protocol');
        }
    } catch(e) {
        return <ErrorAlert title="Invalid URL" description="One or both of the provided URLs are not valid. Please go back and try again." />;
    }
    
    const [res1, res2] = await Promise.all([
        fetchAnalysisForUrl(decodedUrl1),
        fetchAnalysisForUrl(decodedUrl2)
    ]);
    
    let summary: ComparisonOutput | { error: string } | null = null;
    if (res1 && res2 && !res1.error && !res2.error) {
        try {
            const aiInput: ComparisonInput = {
                site1: {
                    url: res1.overview.url,
                    performanceScore: res1.performance?.mobile.performanceScore,
                    securityScore: res1.security?.securityScore,
                    techStack: res1.techStack?.map(t => t.name),
                    hostingCountry: res1.hosting?.country,
                },
                site2: {
                    url: res2.overview.url,
                    performanceScore: res2.performance?.mobile.performanceScore,
                    securityScore: res2.security?.securityScore,
                    techStack: res2.techStack?.map(t => t.name),
                    hostingCountry: res2.hosting?.country,
                }
            };
            summary = await compareWebsites(aiInput);
        } catch (e: any) {
            summary = { error: e.message || "Failed to generate AI comparison." };
        }
    } else if (res1?.error || res2?.error) {
        summary = { error: "AI comparison could not be generated because one or both sites failed to analyze." };
    }

    return (
        <ComparisonPageContent
            urls={{ url1: decodedUrl1, url2: decodedUrl2 }}
            data1={res1}
            data2={res2}
            summary={summary}
        />
    )
}
