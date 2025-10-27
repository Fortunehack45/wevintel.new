
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type AnalysisResult, type ComparisonInput, type ComparisonOutput, type ComparisonHistoryItem } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { ComparisonDashboard } from './comparison-dashboard';
import { compareWebsites } from '@/ai/flows/compare-websites-flow';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useAnalysisData } from '@/hooks/use-analysis-data';

type Urls = { url1: string; url2: string };
type InitialData = { data1: Partial<AnalysisResult>; data2: Partial<AnalysisResult> };

export function ComparisonPageContent({ urls, initialData }: { urls: Urls, initialData: InitialData }) {
    const router = useRouter();

    const { result: data1, loading: loading1, error: error1 } = useAnalysisData(urls.url1, initialData.data1);
    const { result: data2, loading: loading2, error: error2 } = useAnalysisData(urls.url2, initialData.data2);

    const [comparisonSummary, setComparisonSummary] = useState<ComparisonOutput | { error: string } | null>(null);
    const [history, setHistory] = useLocalStorage<ComparisonHistoryItem[]>('webintel_comparison_history', []);
    
    const getAIComparison = useCallback(async (site1: AnalysisResult, site2: AnalysisResult) => {
        try {
            const aiInput: ComparisonInput = {
                site1: {
                    url: site1.overview.url,
                    performanceScore: site1.performance?.mobile.performanceScore,
                    securityScore: site1.security?.securityScore,
                    techStack: site1.techStack?.map(t => t.name),
                    hostingCountry: site1.hosting?.country,
                },
                site2: {
                    url: site2.overview.url,
                    performanceScore: site2.performance?.mobile.performanceScore,
                    securityScore: site2.security?.securityScore,
                    techStack: site2.techStack?.map(t => t.name),
                    hostingCountry: site2.hosting?.country,
                }
            };
            const summary = await compareWebsites(aiInput);
            setComparisonSummary(summary);

        } catch (e: any) {
            setComparisonSummary({ error: e.message || "Failed to generate AI comparison." });
        }
    }, []);

    useEffect(() => {
        if (data1 && data2 && !loading1 && !loading2) {
            getAIComparison(data1, data2);

            setHistory(prev => {
                const newEntry: ComparisonHistoryItem = {
                    id: crypto.randomUUID(),
                    url1: urls.url1,
                    url2: urls.url2,
                    domain1: new URL(urls.url1).hostname,
                    domain2: new URL(urls.url2).hostname,
                    createdAt: new Date().toISOString(),
                }
                const newHistory = [newEntry, ...prev.filter(item => !(item.url1 === newEntry.url1 && item.url2 === newEntry.url2))];
                return newHistory.slice(0, 50);
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data1, data2, loading1, loading2]);
    
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
            
            <ComparisonDashboard 
                data1={data1 as AnalysisResult}
                data2={data2 as AnalysisResult}
                summary={comparisonSummary}
                isLoading1={loading1}
                isLoading2={loading2}
            />
        </div>
    );
}
