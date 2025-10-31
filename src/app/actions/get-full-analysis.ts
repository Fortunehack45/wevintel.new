
'use server';

import { getFastAnalysis, getPerformanceAnalysis } from '@/app/actions/analyze';
import { getAdditionalAnalysis } from '@/app/actions/get-additional-analysis';
import { AnalysisResult } from '@/lib/types';
import { getWebsiteIntelligence, WebsiteIntelligenceInput } from '@/ai/flows/get-website-intelligence-flow';

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

    const aiInput: WebsiteIntelligenceInput = {
        url: fastResult.overview!.url,
        htmlContent: fastResult.overview?.htmlContent || '',
        description: fastResult.overview?.description || '',
        headers: fastResult.headers,
    };

    const [perfResult, additionalResult, aiResult] = await Promise.allSettled([
        getPerformanceAnalysis(url),
        getAdditionalAnalysis(url),
        getWebsiteIntelligence(aiInput),
    ]);

    const fullPerfData = perfResult.status === 'fulfilled' ? perfResult.value : {};
    const additionalValue = additionalResult.status === 'fulfilled' ? additionalResult.value : { status: undefined };
    const aiValue = aiResult.status === 'fulfilled' ? aiResult.value : { error: aiResult.reason?.message || 'Failed to generate AI analysis.' };
    
    let summaryPart, trafficPart, techStackPart;
    
    if (aiValue && 'error' in aiValue) {
        summaryPart = { error: aiValue.error };
        trafficPart = null;
        techStackPart = null;
    } else if (aiValue) {
        summaryPart = aiValue.summary ? { summary: aiValue.summary } : { error: 'AI did not return a summary.'};
        trafficPart = aiValue.traffic;
        techStackPart = aiValue.techStack;
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
        aiSummary: summaryPart,
        traffic: trafficPart,
        techStack: techStackPart,
        status: additionalValue.status,
    };
    return finalResult;
};

