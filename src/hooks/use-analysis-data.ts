
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalStorage } from './use-local-storage';
import type { AnalysisResult, WebsiteAnalysisInput } from '@/lib/types';
import { getPerformanceAnalysis, getFastAnalysis } from '@/app/actions/analyze';
import { getAdditionalAnalysis } from '@/app/actions/get-additional-analysis';
import { summarizeWebsite } from '@/ai/flows/summarize-flow';
import { estimateTraffic } from '@/ai/flows/traffic-estimate-flow';
import { detectTechStack } from '@/ai/flows/tech-stack-flow';

type AnalysisCache = Record<string, { data: AnalysisResult; timestamp: string }>;

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

export function useAnalysisData(url: string, initialData: Partial<AnalysisResult>) {
    const [result, setResult] = useState<AnalysisResult | null>(initialData as AnalysisResult);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cache, setCache] = useLocalStorage<AnalysisCache>('webintel_analysis_cache', {});
    const isFetching = useRef(false);

    useEffect(() => {
        const fetchFullAnalysis = async () => {
            if (isFetching.current) return;
            isFetching.current = true;
            setLoading(true);

            // 1. Check cache first
            const cachedItem = cache[url];
            if (cachedItem) {
                const oneDay = 24 * 60 * 60 * 1000;
                if (new Date().getTime() - new Date(cachedItem.timestamp).getTime() < oneDay) {
                    setResult(cachedItem.data);
                    setLoading(false);
                    isFetching.current = false;
                    return;
                }
            }
            
            // If no valid cache, use initial data and fetch the rest
            let currentData = initialData;
            
            try {
                // In case initialData is not available (e.g. direct call from comparison)
                if (!currentData.overview) {
                    const fastResult = await getFastAnalysis(url);
                    if ('error' in fastResult) throw new Error(fastResult.error);
                    currentData = fastResult;
                    setResult(currentData as AnalysisResult);
                }

                const aiSummaryInput: WebsiteAnalysisInput = {
                    overview: currentData.overview!,
                    security: currentData.security!,
                    hosting: currentData.hosting!,
                    headers: currentData.headers,
                };
                
                const [perfResult, summaryResult, trafficResult, techStackResult, additionalResult] = await Promise.allSettled([
                    getPerformanceAnalysis(url),
                    summarizeWebsite(aiSummaryInput),
                    estimateTraffic({ url, description: currentData.overview?.description || '' }),
                    detectTechStack({ url, htmlContent: currentData.overview?.htmlContent || '', headers: currentData.headers || {} }),
                    getAdditionalAnalysis(url),
                ]);

                const fullPerfData = perfResult.status === 'fulfilled' ? perfResult.value : {};
                
                const finalResult: AnalysisResult = {
                    ...currentData,
                    ...fullPerfData,
                     overview: {
                        ...currentData.overview!,
                        ...('overview' in fullPerfData ? fullPerfData.overview : {}),
                        title: ('overview' in fullPerfData && fullPerfData.overview?.title) || currentData.overview?.title,
                        description: ('overview' in fullPerfData && fullPerfData.overview?.description) || currentData.overview?.description,
                    },
                    metadata: {
                        ...currentData.metadata!,
                        hasRobotsTxt: 'metadata' in fullPerfData && fullPerfData.metadata ? fullPerfData.metadata.hasRobotsTxt : false,
                        hasSitemapXml: 'metadata' in fullPerfData && fullPerfData.metadata ? fullPerfData.metadata.hasSitemapXml : false,
                    },
                    security: {
                        ...currentData.security!,
                        securityScore: getSecurityScore({ ...currentData, ...fullPerfData }),
                    },
                    aiSummary: summaryResult.status === 'fulfilled' ? summaryResult.value : { error: summaryResult.reason?.message || 'Failed to generate summary.'},
                    traffic: trafficResult.status === 'fulfilled' ? trafficResult.value : undefined,
                    techStack: techStackResult.status === 'fulfilled' ? techStackResult.value : undefined,
                    status: additionalResult.status === 'fulfilled' ? additionalResult.value.status : undefined,
                } as AnalysisResult;

                setResult(finalResult);
                setCache(prev => ({
                    ...prev,
                    [url]: {
                        data: finalResult,
                        timestamp: new Date().toISOString(),
                    }
                }));

            } catch (e: any) {
                console.error("Full analysis fetch failed:", e);
                setError(e.message || "An unknown error occurred.");
            } finally {
                setLoading(false);
                isFetching.current = false;
            }
        };

        fetchFullAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, initialData]); 

    return { result, loading, error };
}
