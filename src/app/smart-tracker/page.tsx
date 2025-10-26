'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateSmartTrackerScript } from '@/ai/flows/generate-smart-tracker-script';
import { Bot, Clipboard, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function SmartTrackerPage() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [trackingScript, setTrackingScript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerateScript = async () => {
    if (!websiteUrl) {
      toast({
        title: 'Website URL is required',
        description: 'Please enter a URL to generate a script.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setTrackingScript('');

    try {
      const result = await generateSmartTrackerScript({ websiteUrl });
      setTrackingScript(result.trackingScript);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Generating Script',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingScript);
    setHasCopied(true);
    toast({
        title: 'Copied to clipboard!',
        description: 'The script has been copied successfully.',
    });
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold text-foreground">Smart Tracker</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Generate an AI-powered tracking script for your website.
        </p>
      </motion.div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="text-primary" />
            Generate Your Script
          </CardTitle>
          <CardDescription>
            Enter your website's URL to generate a custom tracking script. This script uses an LLM to intelligently filter visitor events, saving you from data overload.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="website-url">Website URL</Label>
            <Input
              id="website-url"
              placeholder="https://example.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button onClick={handleGenerateScript} disabled={isLoading} className="w-full">
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Generate Script'
            )}
          </Button>
        </CardContent>
      </Card>

      {trackingScript && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Your Tracking Script</CardTitle>
              <CardDescription>Copy and paste this script into the `<head>` section of your website's HTML.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    <pre className="bg-muted/50 p-4 rounded-lg text-sm overflow-x-auto">
                        <code>{trackingScript}</code>
                    </pre>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleCopy}
                    >
                        {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                    </Button>
                </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
