
'use server';
/**
 * @fileOverview A flow to compare two websites based on their analysis data.
 *
 * - compareWebsites - A function that takes two sets of website analysis data and returns a comparative summary.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { ComparisonInput, ComparisonInputSchema, ComparisonOutput, ComparisonOutputSchema } from '@/lib/types';
import { getCache, setCache } from '@/lib/cache';

export async function compareWebsites(input: ComparisonInput): Promise<ComparisonOutput | { error: string }> {
  const cacheKey = `comparison:${input.site1.url}:${input.site2.url}`;
  const cached = await getCache<ComparisonOutput>(cacheKey);
  if (cached) return cached;
  
  try {
    const result = await compareWebsitesFlow(input);
    if (!('error' in result)) {
        await setCache(cacheKey, result);
    }
    return result;
  } catch (e: any) {
    return { error: e.message || "An unexpected error occurred in the comparison flow." };
  }
}

const prompt = ai.definePrompt({
  name: 'compareWebsitesPrompt',
  input: { schema: ComparisonInputSchema },
  output: { schema: ComparisonOutputSchema },
  prompt: `You are a web technology expert, providing a side-by-side analysis of two websites.

Analyze the following JSON data for two websites and provide a comparative summary.

Site 1 Data:
- URL: {{{site1.url}}}
- Performance Score: {{{site1.performanceScore}}}
- Security Score: {{{site1.securityScore}}}
- Tech Stack: {{{json site1.techStack}}}
- Hosted In: {{{site1.hostingCountry}}}

Site 2 Data:
- URL: {{{site2.url}}}
- Performance Score: {{{site2.performanceScore}}}
- Security Score: {{{site2.securityScore}}}
- Tech Stack: {{{json site2.techStack}}}
- Hosted In: {{{site2.hostingCountry}}}

Based on this data, your task is to:
1. Create a compelling title for the comparison.
2. Write a two-paragraph summary. First, compare performance and security scores directly. Second, compare their technology stacks and note any interesting differences in their hosting locations.
3. Declare a "winner" based on a combined view of performance and security scores. If they are very close (within 5 points), declare a "Tie".
`,
});

const compareWebsitesFlow = ai.defineFlow(
  {
    name: 'compareWebsitesFlow',
    inputSchema: ComparisonInputSchema,
    outputSchema: z.union([ComparisonOutputSchema, z.object({error: z.string()})]),
  },
  async (input) => {
    try {
        const { output } = await prompt(input);
        if (!output) {
            return { error: "The AI model did not return a comparison." };
        }
        return output;
    } catch(e: any) {
        console.error("Error in compareWebsitesFlow:", e);
        return { error: e.message || "Failed to generate AI comparison." };
    }
  }
);
