
'use client';

import { Suspense, useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type AnalysisResult, type TechStackData } from '@/lib/types';
import { getPerformanceAnalysis } from '@/app/actions/analyze';
import { useRouter } from 'next/navigation';
import { ComparisonDashboard } from './comparison-dashboard';
import { ComparisonInput, ComparisonOutput, compareWebsites } from '@/ai/flows/compare-websites-flow';
import { DashboardSkeleton } from '../analysis/dashboard-skeleton';

type Urls = { url1: string; url2: string };
type InitialData = { data1: Partial<AnalysisResult>; data2: Partial<AnalysisResult> };

export function ComparisonPageContent({ urls, initialData }: { urls: Urls, initialData: InitialData }) {
    const router = useRouter();
    const isFetching = useRef(false);

    const [fullData, setFullData] = useState<InitialData | null>(null);
    const [comparisonSummary, setComparisonSummary] = useState<ComparisonOutput | { error: string } | null>(null);

    useEffect(() => {
        const fetchRemainingAnalyses = async () => {
             if (isFetching.current) return;
            
             isFetching.current = true;
            
            const [perf1, perf2] = await Promise.allSettled([
                getPerformanceAnalysis(urls.url1),
                getPerformanceAnalysis(urls.url2),
            ]);

            const fullData1 = { ...initialData.data1, ...(perf1.status === 'fulfilled' && perf1.value) };
            const fullData2 = { ...initialData.data2, ...(perf2.status === 'fulfilled' && perf2.value) };
            
            const getSecurityScore = (data: Partial<AnalysisResult>) => {
                let total = 0, count = 0;
                if(data.security?.isSecure) { total++; count++; }
                Object.values(data.security?.securityHeaders || {}).forEach(v => { if(v) total++; count++; });
                Object.values(data.securityAudits || {}).forEach(a => { if (a.score !== null) { total += a.score; count++; } });
                return count > 0 ? Math.round((total / count) * 100) : 0;
            }

            fullData1.security!.securityScore = getSecurityScore(fullData1);
            fullData2.security!.securityScore = getSecurityScore(fullData2);

            setFullData({ data1: fullData1, data2: fullData2 });
            
            // Now, get the AI comparison
            try {
                const aiInput: ComparisonInput = {
                    site1: {
                        url: fullData1.overview!.url,
                        performanceScore: fullData1.performance?.mobile.performanceScore,
                        securityScore: fullData1.security!.securityScore,
                        techStack: fullData1.techStack?.map(t => t.name),
                        hostingCountry: fullData1.hosting?.country,
                    },
                    site2: {
                        url: fullData2.overview!.url,
                        performanceScore: fullData2.performance?.mobile.performanceScore,
                        securityScore: fullData2.security!.securityScore,
                        techStack: fullData2.techStack?.map(t => t.name),
                        hostingCountry: fullData2.hosting?.country,
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
        if (!fullData) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DashboardSkeleton initialData={initialData.data1} />
                    <DashboardSkeleton initialData={initialData.data2} />
                </div>
            );
        }
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
                        <a href={urls.url1} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">{urls.url1}</a>
                        <span>vs</span>
                        <a href={urls.url2} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">{urls.url2}</a>
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
