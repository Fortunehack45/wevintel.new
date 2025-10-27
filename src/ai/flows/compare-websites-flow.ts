
'use server';
/**
 * @fileOverview A flow to compare two websites based on their analysis data.
 *
 * - compareWebsites - A function that takes two sets of website analysis data and returns a comparative summary.
 */

import { ai } from '@/ai/genkit';
import { ComparisonInput, ComparisonInputSchema, ComparisonOutput, ComparisonOutputSchema } from '@/lib/types';


export async function compareWebsites(input: ComparisonInput): Promise<ComparisonOutput> {
  return compareWebsitesFlow(input);
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
    outputSchema: ComparisonOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
