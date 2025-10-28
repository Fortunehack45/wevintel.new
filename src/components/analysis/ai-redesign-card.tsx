
'use client';

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles, Camera, Loader2, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { redesignWebsite } from '@/ai/flows/redesign-website-flow';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';

export function AIRedesignCard() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);

  const handleRedesign = async () => {
    setIsLoading(true);
    setError(null);
    setAfterImage(null);

    try {
      const dashboardElement = document.getElementById('analysis-dashboard-content');
      if (!dashboardElement) {
        throw new Error("Could not find the dashboard content to screenshot.");
      }

      // Temporarily remove border from the element to be screenshotted to avoid it appearing in the image
      const originalBorder = dashboardElement.style.border;
      dashboardElement.style.border = 'none';

      const canvas = await html2canvas(dashboardElement, {
        allowTaint: true,
        useCORS: true,
        backgroundColor: null, // Use transparent background
        scale: 1, // Use a lower scale to reduce image size and speed up processing
      });
      
      // Restore original styles
      dashboardElement.style.border = originalBorder;

      const screenshotDataUri = canvas.toDataURL('image/png');
      setBeforeImage(screenshotDataUri);

      const result = await redesignWebsite({
        screenshotDataUri,
        prompt,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.design) {
        setAfterImage(result.design.imageUrl);
      }

    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setPrompt('');
    setBeforeImage(null);
    setAfterImage(null);
    setError(null);
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            <p className="text-muted-foreground">Taking screenshot and generating AI redesign... This may take a moment.</p>
            <Skeleton className="w-full h-48" />
        </div>
      );
    }

    if (error) {
      return (
         <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Redesign Failed</AlertTitle>
            <AlertDescription>
                {error}
                <Button variant="link" onClick={handleReset} className="p-0 h-auto ml-1 text-destructive-foreground">Try again</Button>
            </AlertDescription>
        </Alert>
      )
    }

    if (beforeImage && afterImage) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-center mb-2">Before</h4>
              <Image src={beforeImage} alt="Before redesign" width={500} height={300} className="rounded-lg border" />
            </div>
            <div>
              <h4 className="font-semibold text-center mb-2">After</h4>
              <Image src={afterImage} alt="After AI redesign" width={500} height={300} className="rounded-lg border" />
            </div>
          </div>
          <Button onClick={handleReset} variant="outline" className="w-full">Start a New Redesign</Button>
        </div>
      );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <ImageIcon className="h-5 w-5 text-blue-500 mt-1" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                    This tool takes a screenshot of the dashboard above and uses AI to generate a new visual concept based on your prompt.
                </p>
            </div>
            <Textarea
                placeholder="e.g., 'Make it look more modern and professional using a dark theme with green accents.'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                disabled={isLoading}
            />
            <Button onClick={handleRedesign} disabled={isLoading || !prompt} className="w-full">
                {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                Generate Redesign
            </Button>
        </div>
    );
  }

  return (
    <Card className="glass-card w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-primary" />
          AI Visual Redesign
        </CardTitle>
        <CardDescription>Re-imagine this website's design with a simple text prompt.</CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
