'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Wand2, RefreshCw, CheckCircle, Lightbulb } from 'lucide-react';
import type { AnalysisResult, AISummary } from '@/lib/types';
import { summarizeWebsite, WebsiteAnalysisInput } from '@/ai/flows/summarize-flow';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertTriangle } from 'lucide-react';


const SummarySkeleton = () => (
    <div>
        <Skeleton className="h-4 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-1/2 mb-6" />
        <Skeleton className="h-4 w-1/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
    </div>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
    <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>AI Summary Failed</AlertTitle>
        <AlertDescription>
            There was an issue generating the AI summary. 
            <Button variant="link" onClick={onRetry} className="p-0 h-auto ml-1 text-destructive-foreground">Click here to try again.</Button>
        </AlertDescription>
    </Alert>
);

export function SummaryCard({ data, onRunPerformance, isLoading: isPerfLoading }: { data: Partial<AnalysisResult>, onRunPerformance: () => void, isLoading: boolean }) {
    const [summary, setSummary] = useState<AISummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const generateSummary = async () => {
        if (!data.overview || !data.security || !data.hosting) return;

        setIsLoading(true);
        setError(false);
        setSummary(null);

        try {
            const input: WebsiteAnalysisInput = {
                overview: {
                    url: data.overview.url,
                    domain: data.overview.domain,
                    title: data.overview.title,
                    description: data.overview.description,
                },
                security: {
                    isSecure: data.security.isSecure,
                    securityHeaders: data.security.securityHeaders,
                },
                hosting: {
                    ip: data.hosting.ip,
                    isp: data.hosting.isp,
                    country: data.hosting.country,
                },
                headers: data.headers,
            }
            const result = await summarizeWebsite(input);
            setSummary(result);
        } catch (e) {
            console.error("AI summary failed:", e);
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        generateSummary();
    }, [data.id]);


    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-primary" />
                    AI-Powered Summary
                </CardTitle>
                <CardDescription>A quick analysis and recommendations from our AI expert.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        {isLoading && <SummarySkeleton />}
                        {error && <ErrorState onRetry={generateSummary} />}
                        {summary && (
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2"><Lightbulb className="text-yellow-400"/> Quick Summary</h4>
                                    <p className="text-sm text-muted-foreground">{summary.summary}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2"><CheckCircle className="text-green-500" /> Recommendations</h4>
                                    <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                                        {summary.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="bg-muted/50 p-6 rounded-lg flex flex-col items-center justify-center text-center">
                        <h4 className="font-semibold mb-2">Ready for a Deep Dive?</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                            Run a full performance analysis with Google PageSpeed to get detailed scores and audits.
                        </p>
                        <Button onClick={onRunPerformance} disabled={isPerfLoading}>
                            {isPerfLoading ? (
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Wand2 className="mr-2 h-4 w-4" />
                            )}
                            {isPerfLoading ? 'Scanning...' : 'Run Full Performance Scan'}
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">(This may take up to 30 seconds)</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
