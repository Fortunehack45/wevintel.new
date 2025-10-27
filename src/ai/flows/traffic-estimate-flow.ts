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
  estimatedMonthlyVisits: z.number().describe('A numerical estimation of the monthly visits to the website.'),
  estimationConfidence: z.enum(['low', 'medium', 'high']).describe('The confidence level of the estimation.'),
});

export type TrafficEstimateOutput = z.infer<typeof TrafficEstimateOutputSchema>;

export async function estimateTraffic(input: TrafficEstimateInput): Promise<TrafficEstimateOutput> {
  return estimateTrafficFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateTrafficPrompt',
  input: { schema: TrafficEstimateInputSchema },
  output: { schema: TrafficEstimateOutputSchema },
  prompt: `You are a web analytics expert. Your task is to estimate the monthly traffic of a website based on its URL and description.
Consider factors like the domain name, the likely niche or industry from the description, and general public knowledge about the website or company.

Analyze the following website data:
- URL: {{{url}}}
- Description: {{{description}}}

Based on this, provide an estimated number of monthly visits.
Also, provide a confidence level for your estimation (low, medium, high). A niche personal blog might have low confidence, while a well-known site like google.com would have high confidence.
Return only the JSON object with the estimated visits and your confidence.
`,
});

const estimateTrafficFlow = ai.defineFlow(
  {
    name: 'estimateTrafficFlow',
    inputSchema: TrafficEstimateInputSchema,
    outputSchema: TrafficEstimateOutputSchema,
  },
  async (input) => {
    try {
        const { output } = await prompt(input);
        return output!;
    } catch (e) {
        console.error("Traffic estimation flow failed:", e);
        // Return a default/error state
        return {
            estimatedMonthlyVisits: 0,
            estimationConfidence: 'low',
        };
    }
  }
);
