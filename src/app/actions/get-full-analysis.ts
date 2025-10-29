
'use server';

import { getFastAnalysis, getPerformanceAnalysis } from '@/app/actions/analyze';
import { getAdditionalAnalysis } from '@/app/actions/get-additional-analysis';
import { summarizeWebsite, WebsiteAnalysisInput } from '@/ai/flows/summarize-flow';
import { estimateTraffic } from '@/ai/flows/traffic-estimate-flow';
import { detectTechStack } from '@/ai/flows/tech-stack-flow';
import { AnalysisResult } from '@/lib/types';

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

export const getFullAnalysis = async (url: string): Promise<AnalysisResult | { error: string, overview: Partial<AnalysisResult['overview']> }> => {
    let fastResult;
    try {
        fastResult = await getFastAnalysis(url);
        if ('error' in fastResult) {
            return { error: fastResult.error, overview: { url, domain: new URL(url).hostname }};
        }
    } catch (e: any) {
        return { error: e.message || "Failed to fetch initial data", overview: { url }};
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
