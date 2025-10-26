'use server';

/**
 * @fileOverview Determines whether a website visitor event is worth tracking.
 *
 * - shouldTrackEvent - A function that uses an LLM to decide if an event should be recorded.
 * - VisitorEventInput - The input type for the shouldTrackEvent function.
 * - VisitorEventOutput - The return type for the shouldTrackEvent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const VisitorEventInputSchema = z.object({
  ip: z.string().optional().describe('The visitor\'s IP address.'),
  country: z.string().optional().describe('The country the visitor is from.'),
  city: z.string().optional().describe('The city the visitor is from.'),
  region: z.string().optional().describe('The region/state the visitor is from.'),
  timestamp: z.string().describe('The ISO 8601 timestamp of the event.'),
  referrer: z.string().optional().describe('The referring URL.'),
  pathname: z.string().optional().describe('The path of the page being viewed.'),
});
export type VisitorEventInput = z.infer<typeof VisitorEventInputSchema>;

export const VisitorEventOutputSchema = z.object({
  shouldTrack: z.boolean().describe('Whether or not this event should be tracked.'),
  reason: z.string().describe('A brief explanation for the decision.'),
});
export type VisitorEventOutput = z.infer<typeof VisitorEventOutputSchema>;

export async function shouldTrackEvent(input: VisitorEventInput): Promise<VisitorEventOutput> {
  return shouldTrackEventFlow(input);
}

const prompt = ai.definePrompt({
  name: 'shouldTrackEventPrompt',
  input: {schema: VisitorEventInputSchema},
  output: {schema: VisitorEventOutputSchema},
  prompt: `You are an intelligent filter for a web analytics service. Your job is to decide if a visitor event is worth recording in a database.

You should decide NOT to track events that are likely bots, local development, or otherwise uninteresting traffic. Be biased towards NOT tracking unless the event looks like a real, unique user.

Consider the following factors:
- IP Address: Is it a common cloud provider, a local IP (127.0.0.1, 192.168.x.x, 10.x.x.x), or something that looks like a real user?
- Referrer: Is it coming from a known search engine, a social media site, or is it 'direct'? Direct traffic is good. Empty or unusual referrers might be bots.
- Pathname: Is it a common path like '/' or something more specific?
- Location: Is the location reasonable for a user?

Here is the event data:
- IP: {{{ip}}}
- Country: {{{country}}}
- City: {{{city}}}
- State/Region: {{{region}}}
- Timestamp: {{{timestamp}}}
- Referrer: {{{referrer}}}
- Pathname: {{{pathname}}}

Based on this information, decide if this event is worth tracking. Provide a brief reason for your decision.`,
});

const shouldTrackEventFlow = ai.defineFlow(
  {
    name: 'shouldTrackEventFlow',
    inputSchema: VisitorEventInputSchema,
    outputSchema: VisitorEventOutputSchema,
  },
  async (input) => {
    // Basic pre-filtering to save LLM calls
    if (input.ip && (input.ip.startsWith('192.168.') || input.ip.startsWith('10.') || input.ip === '127.0.0.1')) {
      return { shouldTrack: false, reason: 'Event from a local IP address.' };
    }
    if (input.ip && (input.ip.startsWith('::1') || input.ip === 'localhost')) {
       return { shouldTrack: false, reason: 'Event from a local IP address.' };
    }
    if (input.referrer && input.referrer.includes('vercel-monitoring')) {
      return { shouldTrack: false, reason: 'Vercel monitoring bot.' };
    }

    const {output} = await prompt(input);
    return output!;
  }
);
