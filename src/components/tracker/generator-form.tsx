'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { generateSmartTrackerScript } from '@/ai/flows/generate-smart-tracker-script';
import { Wand2, Copy, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function GeneratorForm() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [script, setScript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!websiteUrl) return;
    
    setIsLoading(true);
    setError('');
    setScript('');

    try {
      const result = await generateSmartTrackerScript({ websiteUrl });
      setScript(result.trackingScript);
    } catch (err: any) {
      setError(err.message || 'Failed to generate script.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    toast({
      title: "Copied to clipboard!",
    });
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex w-full max-w-xl mx-auto items-center space-x-2">
        <Input
          type="text"
          placeholder="https://your-website.com"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          className="h-12 text-base"
          aria-label="Your Website URL"
          disabled={isLoading}
        />
        <Button type="submit" size="lg" className="h-12" disabled={isLoading || !websiteUrl}>
          <Wand2 className="h-5 w-5 mr-2" />
          Generate
        </Button>
      </form>

      {isLoading && (
          <Card>
              <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-32 w-full" />
              </CardContent>
          </Card>
      )}

      {error && (
        <Alert variant="destructive">
            <AlertTitle>Generation Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {script && (
        <Card className="text-left relative">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Your Tracking Script</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Copy and paste this script just before the closing 
              <code>&lt;/body&gt;</code> tag on your website.
            </p>
            <div className="relative">
              <Textarea
                readOnly
                value={script}
                className="font-mono text-xs h-48 bg-black/20"
                aria-label="Generated tracking script"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={handleCopy}
              >
                {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
