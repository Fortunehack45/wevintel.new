
'use server';
/**
 * @fileOverview This flow is deprecated and has been replaced by get-website-intelligence-flow.ts
 */

import { z } from 'genkit';

// This file is now deprecated. The logic has been moved to get-website-intelligence-flow.ts
// to consolidate multiple AI calls into one.

const TrafficEstimateOutputSchema = z.object({
  estimatedMonthlyVisits: z.number(),
  estimationConfidence: z.enum(['low', 'medium', 'high']),
  trafficSources: z.object({
    direct: z.number(),
    search: z.number(),
    social: z.number(),
    referral: z.number(),
  }),
  topCountries: z.array(z.object({
    country: z.string(),
    percentage: z.number(),
  })).length(3),
  engagement: z.object({
    avgSessionDuration: z.string(),
    bounceRate: z.number(),
  }),
});

export type TrafficEstimateOutput = z.infer<typeof TrafficEstimateOutputSchema>;

export async function estimateTraffic(): Promise<null> {
  console.warn("estimateTraffic is deprecated.");
  return null;
}
