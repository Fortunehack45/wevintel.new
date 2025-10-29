
'use client';
import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Wand, Sparkles, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { redesignWebsite } from '@/ai/flows/redesign-website-flow';

const RedesignSkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-10 w-32" />
    </div>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
    <div className="text-center">
        <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-4" />
        <p className="text-sm text-muted-foreground mb-4">The AI failed to generate a redesign. This can happen with complex sites.</p>
        <Button variant="outline" onClick={onRetry}>Try Again</Button>
    </div>
);

interface AIRedesignCardProps {
    url: string;
    isLoading?: boolean;
}

export function AIRedesignCard({ url, isLoading: initialIsLoading }: AIRedesignCardProps) {
    const [redesign, setRedesign] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateRedesign = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setRedesign(null);
        try {
            const result = await redesignWebsite({ url });
            if ('error' in result) {
                setError(result.error);
            } else if (result.imageUrl) {
                setRedesign(result.imageUrl);
            } else {
                setError('The model did not return an image.');
            }
        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [url]);

    if (initialIsLoading) {
        return (
             <Card className="glass-card h-full min-h-[300px]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wand className="h-5 w-5 text-primary" />
                        AI Website Redesign
                    </CardTitle>
                    <CardDescription>Get an AI-generated redesign concept for your website.</CardDescription>
                </CardHeader>
                <CardContent>
                    <RedesignSkeleton />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="glass-card h-full min-h-[300px] flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wand className="h-5 w-5 text-primary" />
                    AI Website Redesign
                </CardTitle>
                <CardDescription>Get an AI-generated redesign concept for your website.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
                {isLoading && <RedesignSkeleton />}
                {error && <ErrorState onRetry={generateRedesign} />}
                
                {!isLoading && !error && !redesign && (
                    <div className="text-center">
                         <div className="p-4 bg-primary/10 rounded-full inline-block mb-4">
                            <Sparkles className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2">Ready for a new look?</h3>
                        <p className="text-sm text-muted-foreground mb-4">Let our AI generate a fresh design concept for your homepage.</p>
                        <Button onClick={generateRedesign}>
                            <Wand className="mr-2 h-4 w-4" />
                            Generate Redesign
                        </Button>
                    </div>
                )}

                {redesign && (
                    <div className="w-full space-y-4">
                        <a href={redesign} target="_blank" rel="noopener noreferrer" title="View full image">
                            <Image
                                src={redesign}
                                alt="AI-generated website redesign"
                                width={500}
                                height={300}
                                className="rounded-lg border object-cover aspect-video w-full cursor-pointer"
                            />
                        </a>
                        <Button onClick={generateRedesign} variant="outline" size="sm" className="w-full">
                           <Sparkles className="mr-2 h-4 w-4" /> Regenerate
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
