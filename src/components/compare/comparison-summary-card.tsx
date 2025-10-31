
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ComparisonOutput } from '@/lib/types';
import type { AnalysisResult } from '@/lib/types';
import { Trophy, Scale, Wand2, AlertTriangle, ShieldCheck, TrendingUp } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';

const SummarySkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
    </div>
);

const getScoreColor = (score: number | null | undefined): string => {
    if (score === null || score === undefined) return "text-muted-foreground";
    if (score >= 90) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
}

export function ComparisonSummaryCard({ summary, data1, data2 }: { summary: ComparisonOutput | { error: string } | null, data1?: AnalysisResult | null, data2?: AnalysisResult | null }) {
    
    const winnerHostname = summary && 'winner' in summary ? summary.winner : null;
    const isTie = winnerHostname === 'Tie';
    const isWinner1 = data1 && 'overview' in data1 && winnerHostname === data1.overview.domain;
    const isWinner2 = data2 && 'overview' in data2 && winnerHostname === data2.overview.domain;

    const title = summary && 'title' in summary ? summary.title : "Comparison Summary";

    return (
        <Card className="glass-card w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 truncate">
                    <Scale className="h-6 w-6 text-primary shrink-0" />
                    <span className="truncate">{summary ? title : <Skeleton className="h-6 w-56" />}</span>
                </CardTitle>
                <CardDescription>An AI-powered summary of the key differences between the two sites.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {!summary && <SummarySkeleton />}
                {summary && 'error' in summary && (
                    <div className='text-destructive-foreground bg-destructive/80 p-4 rounded-lg flex items-start gap-3'>
                        <AlertTriangle />
                        <div>
                            <h4 className='font-bold'>AI Summary Failed</h4>
                            <p className='text-sm'>{summary.error}</p>
                        </div>
                    </div>
                )}
                {summary && 'summary' in summary && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-muted/30 p-4 rounded-lg">
                            <div className={`text-center p-4 rounded-lg transition-all ${isWinner1 ? 'bg-primary/20 ring-2 ring-primary' : ''}`}>
                                <h3 className='font-bold text-lg truncate'>{data1?.overview.domain}</h3>
                                <div className='flex justify-center gap-4 mt-2'>
                                    <div className={`font-bold text-lg flex items-center gap-1.5 ${getScoreColor(data1?.performance?.mobile.performanceScore)}`}>
                                        <TrendingUp className="h-4 w-4" />
                                        {data1?.performance?.mobile.performanceScore ?? 'N/A'}
                                    </div>
                                    <div className={`font-bold text-lg flex items-center gap-1.5 ${getScoreColor(data1?.security?.securityScore)}`}>
                                        <ShieldCheck className="h-4 w-4" />
                                        {data1?.security?.securityScore ?? 'N/A'}
                                    </div>
                                </div>
                            </div>
                             <div className={`text-center p-4 rounded-lg transition-all ${isWinner2 ? 'bg-primary/20 ring-2 ring-primary' : ''}`}>
                                <h3 className='font-bold text-lg truncate'>{data2?.overview.domain}</h3>
                                <div className='flex justify-center gap-4 mt-2'>
                                    <div className={`font-bold text-lg flex items-center gap-1.5 ${getScoreColor(data2?.performance?.mobile.performanceScore)}`}>
                                        <TrendingUp className="h-4 w-4" />
                                        {data2?.performance?.mobile.performanceScore ?? 'N/A'}
                                    </div>
                                     <div className={`font-bold text-lg flex items-center gap-1.5 ${getScoreColor(data2?.security?.securityScore)}`}>
                                        <ShieldCheck className="h-4 w-4" />
                                        {data2?.security?.securityScore ?? 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 text-sm text-muted-foreground">
                            {summary.summary.split('\n\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>

                        {winnerHostname && (
                           <div className='flex items-center justify-center flex-col gap-2 pt-4 border-t'>
                                <h4 className='font-semibold flex items-center gap-2'><Trophy className="h-5 w-5 text-yellow-400"/> Overall Winner</h4>
                                {isTie ? (
                                    <Badge size="lg" variant="secondary">It's a Tie!</Badge>
                                ) : (
                                    <Badge size="lg" className="bg-primary/80">{winnerHostname}</Badge>
                                )}
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
