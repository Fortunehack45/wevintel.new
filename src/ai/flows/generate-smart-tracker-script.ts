'use server';

/**
 * @fileOverview Generates a smart tracking script that uses an LLM to filter visitor events.
 *
 * - generateSmartTrackerScript - A function that generates the smart tracking script.
 * - GenerateSmartTrackerScriptInput - The input type for the generateSmartTrackerScript function.
 * - GenerateSmartTrackerScriptOutput - The return type for the generateSmartTrackerScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSmartTrackerScriptInputSchema = z.object({
  websiteUrl: z.string().describe('The URL of the website where the tracking script will be installed.'),
});
export type GenerateSmartTrackerScriptInput = z.infer<typeof GenerateSmartTrackerScriptInputSchema>;

const GenerateSmartTrackerScriptOutputSchema = z.object({
  trackingScript: z.string().describe('The generated JavaScript tracking script.'),
});
export type GenerateSmartTrackerScriptOutput = z.infer<typeof GenerateSmartTrackerScriptOutputSchema>;

export async function generateSmartTrackerScript(input: GenerateSmartTrackerScriptInput): Promise<GenerateSmartTrackerScriptOutput> {
  return generateSmartTrackerScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSmartTrackerScriptPrompt',
  input: {schema: GenerateSmartTrackerScriptInputSchema},
  output: {schema: GenerateSmartTrackerScriptOutputSchema},
  prompt: `You are an expert JavaScript developer specializing in creating tracking scripts.

You will generate a JavaScript tracking script that, when installed on a website, sends visitor events (IP address, country, timestamp, referrer) to a specified endpoint for analytics.

However, to avoid overwhelming the database, the script should use an LLM to determine whether each visitor event is worth recording.  The LLM should consider the IP address, country, timestamp, and referrer to determine if the event seems like it would represent meaningful user behavior on the site.

Here is the URL of the website where the script will be installed: {{{websiteUrl}}}.

Only record the event if the LLM determines that it is likely to be a valuable data point.

Return only the JavaScript code, do not include any explanations or comments outside the script tags.

Here is the tracking script:

<script>
  (function() {
    const websiteUrl = "{{{websiteUrl}}}";
    const endpoint = '/api/track'; // Replace with your actual endpoint

    async function getVisitorInfo() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            if (!response.ok) throw new Error('Failed to fetch IP info');
            const data = await response.json();
            return {
                ip: data.ip,
                country: data.country_name,
                timestamp: new Date().toISOString(),
                referrer: document.referrer || 'direct',
            };
        } catch (error) {
            console.error('Error fetching visitor info:', error);
            return null;
        }
    }

    async function shouldRecordEvent(visitorInfo) {
        // In a real application, you would make a call to your backend,
        // which then calls the Genkit flow to get a "smart" decision.
        // For demonstration, we'll use a simple heuristic.
        
        // Example: Don't track localhost or private IPs
        if (visitorInfo.ip.startsWith('192.168.') || visitorInfo.ip.startsWith('10.') || visitorInfo.ip === '127.0.0.1') {
            return false;
        }

        // In a real scenario, this would be a fetch to an API route:
        /*
        const response = await fetch('/api/should-track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(visitorInfo),
        });
        const result = await response.json();
        return result.shouldRecord;
        */
        
        // For this demo, we will record most events.
        console.log('AI would decide if this event is worth tracking:', visitorInfo);
        return true;
    }

    async function trackEvent() {
        const visitorInfo = await getVisitorInfo();
        if (!visitorInfo) return;

        const shouldRecord = await shouldRecordEvent(visitorInfo);

        if (shouldRecord) {
            try {
                await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...visitorInfo, website: websiteUrl }),
                    keepalive: true, // Ensures request is sent even if page is unloading
                });
            } catch (error) {
                console.error('Tracking API error:', error);
            }
        }
    }

    // Wait for the page to be fully loaded to avoid impacting performance
    window.addEventListener('load', trackEvent);
  })();
</script>
`,
});

const generateSmartTrackerScriptFlow = ai.defineFlow(
  {
    name: 'generateSmartTrackerScriptFlow',
    inputSchema: GenerateSmartTrackerScriptInputSchema,
    outputSchema: GenerateSmartTrackerScriptOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
