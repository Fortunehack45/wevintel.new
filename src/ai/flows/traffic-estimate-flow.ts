
'use server';
/**
 * @fileOverview A flow to estimate website traffic.
 *
 * - estimateTraffic - A function that takes a URL and returns an AI-generated traffic estimate.
 * - TrafficEstimateInput - The input type for the estimateTraffic function.
 * - TrafficEstimateOutput - The return type for the estimateTraffic function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TrafficEstimateInputSchema = z.object({
  url: z.string().describe('The URL of the website to estimate traffic for.'),
  description: z.string().optional().describe('A brief description of the website.'),
});

export type TrafficEstimateInput = z.infer<typeof TrafficEstimateInputSchema>;

const TrafficEstimateOutputSchema = z.object({
  estimatedMonthlyVisits: z.number().describe('A numerical estimation of the monthly visits to the website. Should be a round number.'),
  estimationConfidence: z.enum(['low', 'medium', 'high']).describe('The confidence level of the estimation.'),
  trafficSources: z.object({
    direct: z.number().describe('Estimated percentage of traffic from direct visits. Range 0-100.'),
    search: z.number().describe('Estimated percentage of traffic from organic search. Range 0-100.'),
    social: z.number().describe('Estimated percentage of traffic from social media. Range 0-100.'),
    referral: z.number().describe('Estimated percentage of traffic from referral links. Range 0-100.'),
  }).describe('Estimated breakdown of traffic sources. The sum of percentages should be 100.'),
  topCountries: z.array(z.object({
    country: z.string().describe('The two-letter country code (e.g., US, DE).'),
    percentage: z.number().describe('The estimated percentage of traffic from this country. Range 0-100.'),
  })).length(3).describe('A list of the top 3 countries contributing to the website traffic. The sum of percentages should not exceed 100.'),
  engagement: z.object({
    avgSessionDuration: z.string().describe('The estimated average session duration in a human-readable format (e.g., "2m 15s").'),
    bounceRate: z.number().describe('The estimated bounce rate as a percentage. Range 0-100.'),
  }).describe('Key user engagement metrics.'),
});

export type TrafficEstimateOutput = z.infer<typeof TrafficEstimateOutputSchema>;

export async function estimateTraffic(input: TrafficEstimateInput): Promise<TrafficEstimateOutput | null> {
    try {
        return await estimateTrafficFlow(input);
    } catch (e: any) {
        console.error("Traffic estimation flow failed:", e);
        return null; // Return null on any error
    }
}

const prompt = ai.definePrompt({
  name: 'estimateTrafficPrompt',
  input: { schema: TrafficEstimateInputSchema },
  output: { schema: TrafficEstimateOutputSchema },
  prompt: `You are a world-class web analytics expert with access to vast amounts of internet traffic data. Your task is to provide a detailed and realistic estimation of the monthly traffic and user profile for a given website based on its URL and description.
Consider factors like the domain name, the likely niche or industry from the description, public perception, brand recognition, and typical user behavior in that category.

Analyze the following website data:
- URL: {{{url}}}
- Description: {{{description}}}

Based on this, provide a comprehensive traffic analysis. Ensure your estimations for traffic sources and top countries are logical. For example, a well-known brand will have high direct traffic. A blog will have high search traffic. A news site will have a lower session duration than a video streaming site.

Return only the JSON object with your detailed analysis.
`,
});

const estimateTrafficFlow = ai.defineFlow(
  {
    name: 'estimateTrafficFlow',
    inputSchema: TrafficEstimateInputSchema,
    outputSchema: z.nullable(TrafficEstimateOutputSchema),
  },
  async (input) => {
    try {
        const { output } = await prompt(input);
        return output!;
    } catch (e) {
        console.error("Traffic estimation flow failed:", e);
        return null;
    }
  }
);
