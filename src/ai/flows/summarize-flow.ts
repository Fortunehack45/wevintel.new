
'use server';
/**
 * @fileOverview This flow is deprecated and has been replaced by get-website-intelligence-flow.ts
 */

import { z } from 'zod';
// This file is now deprecated. The logic has been moved to get-website-intelligence-flow.ts
// to consolidate multiple AI calls into one.

const AISummarySchema = z.object({
  summary: z.string(),
  recommendations: z.array(z.string()),
});
export type AISummary = z.infer<typeof AISummarySchema>;

export async function summarizeWebsite(): Promise<{ error: string }> {
    return { error: "This function is deprecated." };
}
