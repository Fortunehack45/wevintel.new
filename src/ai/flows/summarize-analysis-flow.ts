
'use server';
/**
 * @fileOverview Summarizes a website analysis report using an LLM.
 *
 * - summarizeAnalysis - A function that takes analysis data and returns an AI-generated summary.
 * - SummarizeAnalysisInput - The input type for the summarizeAnalysis function.
 * - SummarizeAnalysisOutput - The return type for the summarizeAnalysis function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SummarizeAnalysisInputSchema = z.object({
  overview: z.object({
    url: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
  }),
  performance: z.object({
    mobile: z.object({
      performanceScore: z.number().optional(),
      accessibilityScore: z.number().optional(),
      seoScore: z.number().optional(),
    }),
    desktop: z.object({
      performanceScore: z.number().optional(),
      accessibilityScore: z.number().optional(),
      seoScore: z.number().optional(),
    }),
  }),
  security: z.object({
    isSecure: z.boolean(),
  }),
  audits: z.any().describe("An object containing various Lighthouse audit results. We will focus on opportunities."),
});

export type SummarizeAnalysisInput = z.infer<typeof SummarizeAnalysisInputSchema>;

const SummarizeAnalysisOutputSchema = z.object({
  summary: z.string().describe("A concise, one-paragraph summary of the website's overall health, combining performance, security, and SEO."),
  recommendations: z.array(z.string()).describe("A list of the top 3-5 most impactful, actionable recommendations for improving the site."),
});
export type SummarizeAnalysisOutput = z.infer<typeof SummarizeAnalysisOutputSchema>;


export async function summarizeAnalysis(input: SummarizeAnalysisInput): Promise<SummarizeAnalysisOutput> {
  return summarizeAnalysisFlow(input);
}


const prompt = ai.definePrompt({
  name: 'summarizeAnalysisPrompt',
  input: { schema: SummarizeAnalysisInputSchema },
  output: { schema: SummarizeAnalysisOutputSchema },
  prompt: `You are a world-class website analyst. Your task is to provide a concise, expert summary of a website's performance and security based on the provided Lighthouse and analysis data.

Focus on the most important metrics. Be insightful but brief.

**Analysis Data:**
- URL: {{{overview.url}}}
- Title: {{{overview.title}}}
- Mobile Performance Score: {{{performance.mobile.performanceScore}}}
- Desktop Performance Score: {{{performance.desktop.performanceScore}}}
- Mobile SEO Score: {{{performance.mobile.seoScore}}}
- Security: {{{security.isSecure}}}
- Key Audit Opportunities:
{{#each audits}}
  {{#if (lt score 0.9)}}
- {{title}}: {{displayValue}}
  {{/if}}
{{/each}}

Based on this data, provide:
1.  A short, insightful summary of the site's overall condition.
2.  A list of the top 3-5 most critical and actionable recommendations for improvement. Frame them as positive, clear actions to take.
`,
});

const summarizeAnalysisFlow = ai.defineFlow(
  {
    name: 'summarizeAnalysisFlow',
    inputSchema: SummarizeAnalysisInputSchema,
    outputSchema: SummarizeAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
