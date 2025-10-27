
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type AnalysisResult, type TechStackData, type ComparisonInput, type ComparisonOutput } from '@/lib/types';
import { getPerformanceAnalysis } from '@/app/actions/analyze';
import { useRouter } from 'next/navigation';
import { ComparisonDashboard } from './comparison-dashboard';
import { compareWebsites } from '@/ai/flows/compare-websites-flow';
import { DashboardSkeleton } from '../analysis/dashboard-skeleton';
import { detectTechStack } from '@/ai/flows/tech-stack-flow';

type Urls = { url1: string; url2: string };
type InitialData = { data1: Partial<AnalysisResult>; data2: Partial<AnalysisResult> };

export function ComparisonPageContent({ urls, initialData }: { urls: Urls, initialData: InitialData }) {
    const router = useRouter();
    const isFetching = useRef(false);

    const [fullData, setFullData] = useState<InitialData>(initialData);
    const [comparisonSummary, setComparisonSummary] = useState<ComparisonOutput | { error: string } | null>(null);

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

    useEffect(() => {
        const fetchRemainingAnalyses = async () => {
             if (isFetching.current) return;
            
             isFetching.current = true;
            
            const [perf1, perf2, tech1, tech2] = await Promise.allSettled([
                getPerformanceAnalysis(urls.url1),
                getPerformanceAnalysis(urls.url2),
                detectTechStack({ url: urls.url1, htmlContent: initialData.data1.overview?.htmlContent || '', headers: initialData.data1.headers || {} }),
                detectTechStack({ url: urls.url2, htmlContent: initialData.data2.overview?.htmlContent || '', headers: initialData.data2.headers || {} }),
            ]);

            const perfData1 = perf1.status === 'fulfilled' ? perf1.value : {};
            const perfData2 = perf2.status === 'fulfilled' ? perf2.value : {};
            
            const techData1 = tech1.status === 'fulfilled' ? tech1.value : [];
            const techData2 = tech2.status === 'fulfilled' ? tech2.value : [];

            // Immediately update state with performance and tech stack data
            setFullData(currentData => {
                const updatedData1 = { ...currentData.data1, ...perfData1, techStack: techData1 };
                const updatedData2 = { ...currentData.data2, ...perfData2, techStack: techData2 };

                // Recalculate security scores with new audit data
                if (updatedData1.security) updatedData1.security.securityScore = getSecurityScore(updatedData1);
                if (updatedData2.security) updatedData2.security.securityScore = getSecurityScore(updatedData2);

                return { data1: updatedData1, data2: updatedData2 };
            });

            // Now, get the AI comparison using the newly fetched data
            try {
                const aiInput: ComparisonInput = {
                    site1: {
                        url: initialData.data1.overview!.url,
                        performanceScore: 'performance' in perfData1 ? perfData1.performance?.mobile.performanceScore : undefined,
                        securityScore: getSecurityScore({ ...initialData.data1, ...perfData1 }),
                        techStack: techData1.map(t => t.name),
                        hostingCountry: initialData.data1.hosting?.country,
                    },
                    site2: {
                        url: initialData.data2.overview!.url,
                        performanceScore: 'performance' in perfData2 ? perfData2.performance?.mobile.performanceScore : undefined,
                        securityScore: getSecurityScore({ ...initialData.data2, ...perfData2 }),
                        techStack: techData2.map(t => t.name),
                        hostingCountry: initialData.data2.hosting?.country,
                    }
                };
                const summary = await compareWebsites(aiInput);
                setComparisonSummary(summary);

            } catch (e: any) {
                setComparisonSummary({ error: e.message || "Failed to generate AI comparison." });
            }

            isFetching.current = false;
        };

        fetchRemainingAnalyses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urls.url1, urls.url2]);

    const renderContent = () => {
        return (
            <ComparisonDashboard 
                data1={fullData.data1 as AnalysisResult} 
                data2={fullData.data2 as AnalysisResult} 
                summary={comparisonSummary}
            />
        );
    }
    
    return (
        <div className="flex-1">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Comparison Report</h1>
                    <div className="text-muted-foreground flex items-center gap-2 flex-wrap">
                        <a href={urls.url1} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">{new URL(urls.url1).hostname}</a>
                        <span>vs</span>
                        <a href={urls.url2} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">{new URL(urls.url2).hostname}</a>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                     <Button variant="outline" onClick={() => router.push('/compare')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        New Comparison
                    </Button>
                    <Button variant="outline" onClick={() => router.push(`/compare/${encodeURIComponent(urls.url1)}/${encodeURIComponent(urls.url2)}?t=${Date.now()}`)}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Re-analyse
                    </Button>
                </div>
            </div>
            {renderContent()}
        </div>
    );
}
