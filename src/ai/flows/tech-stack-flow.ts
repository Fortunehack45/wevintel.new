
'use server';
/**
 * @fileOverview This flow is deprecated and has been replaced by get-website-intelligence-flow.ts
 */
import { z } from 'genkit';

// This file is now deprecated. The logic has been moved to get-website-intelligence-flow.ts
// to consolidate multiple AI calls into one.

const TechStackOutputSchema = z.array(z.object({
  name: z.string(),
  category: z.string(),
  confidence: z.number().min(0).max(100),
  description: z.string().optional(),
}));

export type TechStackOutput = z.infer<typeof TechStackOutputSchema>;


export async function detectTechStack(): Promise<null> {
    console.warn("detectTechStack is deprecated.");
    return null;
}
