
'use server';
/**
 * @fileOverview A flow to compare two websites based on their analysis data.
 *
 * - compareWebsites - A function that takes two sets of website analysis data and returns a comparative summary.
 * - ComparisonInputSchema - The input type for the compareWebsites function.
 * - ComparisonOutputSchema - The return type for the compareWebsites function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const WebsiteDataSchema = z.object({
  url: z.string(),
  performanceScore: z.number().optional(),
  securityScore: z.number().optional(),
  techStack: z.array(z.string()).optional(),
  hostingCountry: z.string().optional(),
});

export const ComparisonInputSchema = z.object({
  site1: WebsiteDataSchema,
  site2: WebsiteDataSchema,
});
export type ComparisonInput = z.infer<typeof ComparisonInputSchema>;

export const ComparisonOutputSchema = z.object({
  title: z.string().describe("A compelling, short title for the comparison, like 'Performance Showdown: Site A vs. Site B'."),
  summary: z.string().describe("A two-paragraph comparative summary. The first paragraph compares the key metrics (performance, security). The second paragraph discusses the technology stack differences and hosting location implications. Maintain a neutral, expert tone."),
  winner: z.string().describe("The domain name of the winning website based on a holistic view of performance and security scores. If it's a tie or scores are very close, return 'Tie'."),
});
export type ComparisonOutput = z.infer<typeof ComparisonOutputSchema>;

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
