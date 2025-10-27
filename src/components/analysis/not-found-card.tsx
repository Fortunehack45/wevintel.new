
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Lottie from 'lottie-react';
import searchingAnimation from '@/lib/searching-animation.json';

export function NotFoundCard({ url }: { url: string }) {
  return (
    <Card className="glass-card text-center w-full max-w-2xl mx-auto mt-10">
        <CardHeader>
            <CardTitle className="text-3xl font-bold">No Site Found on this Domain</CardTitle>
            <CardDescription className="text-lg">
                We couldn&apos;t reach <span className="font-semibold text-primary">{new URL(url).hostname}</span>.
            </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
            <div className="w-64 h-64">
                <Lottie animationData={searchingAnimation} loop={true} />
            </div>
            <p className="mt-4 text-muted-foreground">
                This could be because the domain is incorrect, the site is temporarily down, or it doesn&apos;t exist. Please check the URL and try again.
            </p>
        </CardContent>
    </Card>
  );
}
