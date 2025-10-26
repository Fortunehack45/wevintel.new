
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Clipboard, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function SmartTrackerPage() {
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const trackingScript = `
<script>
  (function() {
    // This is where your app is hosted.
    // If you are running locally, it's likely http://localhost:9002
    const trackingHost = "https://${process.env.NEXT_PUBLIC_APP_URL}"; 
    const endpoint = trackingHost + '/api/track'; 

    async function getVisitorInfo() {
        try {
            // We use a free IP info service. Consider a more robust service for production.
            const response = await fetch('https://ipapi.co/json/');
            if (!response.ok) throw new Error('Failed to fetch IP info');
            const data = await response.json();
            return {
                ip: data.ip,
                country: data.country_name,
                city: data.city,
                region: data.region,
                timestamp: new Date().toISOString(),
                referrer: document.referrer || 'direct',
                pathname: window.location.pathname,
            };
        } catch (error) {
            console.error('WebIntel Tracker: Error fetching visitor info:', error);
            return null;
        }
    }

    async function trackEvent() {
        const visitorInfo = await getVisitorInfo();
        if (!visitorInfo) return;

        try {
            // Use navigator.sendBeacon if available for more reliable background sending
            if (navigator.sendBeacon) {
                 const blob = new Blob([JSON.stringify(visitorInfo)], { type: 'application/json' });
                 navigator.sendBeacon(endpoint, blob);
            } else {
                 await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(visitorInfo),
                    keepalive: true, // Ensures request is sent even if page is unloading
                });
            }
        } catch (error) {
            console.error('WebIntel Tracker: API error:', error);
        }
    }

    // Wait for the page to be fully loaded to avoid impacting performance
    window.addEventListener('load', trackEvent);
  })();
</script>
  `.trim();


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
          Install our AI-powered tracking script on your website.
        </p>
      </motion.div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="text-primary" />
            Your Tracking Script
          </CardTitle>
          <CardDescription>
            Copy and paste this script into the `<head>` section of your website's HTML. It uses an LLM to intelligently filter visitor events, saving you from data overload.
          </CardDescription>
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

      <Card>
        <CardHeader>
            <CardTitle>How it Works</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-2">
            <p>1. A visitor lands on your site.</p>
            <p>2. The script collects anonymous data (IP, location, referrer).</p>
            <p>3. This data is sent to your WebIntel app's `/api/track` endpoint.</p>
            <p>4. A Genkit AI flow analyzes the data to determine if the event is "interesting" (e.g., not a bot, not a local developer).</p>
            <p>5. Only "interesting" events are logged. In a real app, you would save these to a database like Firestore.</p>
        </CardContent>
      </Card>

    </div>
  );
}
