
'use client';
import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Wand2, CheckCircle, Lightbulb, AlertTriangle } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types';
import { summarizeWebsite, WebsiteAnalysisInput, AISummary } from '@/ai/flows/summarize-flow';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { useIsMobile } from '@/hooks/use-mobile';


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

interface SummaryCardProps {
    data: Partial<AnalysisResult>;
    summary?: AISummary | null;
    isLoading?: boolean;
}

export function SummaryCard({ data, summary: initialSummary, isLoading: initialIsLoading }: SummaryCardProps) {
    const [summary, setSummary] = useState<AISummary | null | undefined>(initialSummary);
    const [isLoading, setIsLoading] = useState(initialIsLoading);
    const [error, setError] = useState(false);
    const isMobile = useIsMobile();

    const generateSummary = useCallback(async () => {
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
    }, [data]);

    useEffect(() => {
        setSummary(initialSummary);
    }, [initialSummary]);

    useEffect(() => {
        setIsLoading(initialIsLoading);
    }, [initialIsLoading]);


    return (
        <Card className="glass-card h-full">
             <Accordion type="single" collapsible defaultValue={isMobile ? undefined : "item-1"}>
                <AccordionItem value="item-1" className='border-none'>
                    <AccordionTrigger className='p-6 hover:no-underline'>
                         <div className='flex flex-col space-y-1.5 text-left'>
                            <CardTitle className="flex items-center gap-2">
                                <Wand2 className="h-5 w-5 text-primary" />
                                AI-Powered Summary
                            </CardTitle>
                            <CardDescription>A quick analysis and recommendations from our AI expert.</CardDescription>
                         </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <CardContent>
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
                        </CardContent>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </Card>
    )
}

    