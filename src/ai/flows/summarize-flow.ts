
'use server';
/**
 * @fileOverview A flow to summarize website analysis data.
 *
 * - summarizeWebsite - A function that takes website analysis data and returns an AI-generated summary.
 * - WebsiteAnalysisInput - The input type for the summarizeWebsite function.
 * - AISummary - The return type for the summarizeWebsite function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { AnalysisResult, WebsiteOverview, SecurityData, HostingInfo, HeaderInfo } from '@/lib/types';

// We only need a subset of the full analysis for the summary
const WebsiteAnalysisInputSchema = z.object({
  overview: z.object({
    url: z.string(),
    domain: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
  }),
  security: z.object({
    isSecure: z.boolean(),
    securityHeaders: z.object({
        'content-security-policy': z.boolean().optional(),
        'strict-transport-security': z.boolean().optional(),
        'x-frame-options': z.boolean().optional(),
        'x-content-type-options': z.boolean().optional(),
    }),
  }),
  hosting: z.object({
    ip: z.string().optional(),
    isp: z.string().optional(),
    country: z.string().optional(),
  }),
  headers: z.record(z.string()).optional(),
});

export type WebsiteAnalysisInput = z.infer<typeof WebsiteAnalysisInputSchema>;

const AISummarySchema = z.object({
  summary: z.string().describe('A concise, one-paragraph summary of the website\'s technical and security profile based on the provided data. Written in a helpful and professional tone.'),
  recommendations: z.array(z.string()).describe('A list of 2-3 actionable recommendations for the website owner to improve their site based on the data. Focus on the most impactful changes.'),
});
export type AISummary = z.infer<typeof AISummarySchema>;

export async function summarizeWebsite(input: WebsiteAnalysisInput): Promise<AISummary | null> {
  return summarizeWebsiteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeWebsitePrompt',
  input: { schema: WebsiteAnalysisInputSchema },
  output: { schema: AISummarySchema },
  prompt: `You are a helpful website analysis expert. Your task is to provide a summary and recommendations based on the JSON data provided.
The user has just scanned a website and you are providing the first set of insights.

Analyze the following website data:
- URL: {{{overview.url}}}
- Title: {{{overview.title}}}
- Description: {{{overview.description}}}
- Secure Connection (HTTPS): {{{security.isSecure}}}
- Hosting IP: {{{hosting.ip}}}
- Hosting ISP: {{{hosting.isp}}}
- Security Headers:
  - CSP: {{{security.securityHeaders.content-security-policy}}}
  - HSTS: {{{security.securityHeaders.strict-transport-security}}}
  - X-Frame-Options: {{{security.securityHeaders.x-frame-options}}}
  - X-Content-Type-Options: {{{security.securityHeaders.x-content-type-options}}}

Based on this data, provide a concise summary of the site's initial technical profile.
Then, provide 2-3 actionable recommendations for the website owner. If the site is already in good shape, the recommendations can be about ongoing best practices.
Keep the language clear, professional, and easy to understand for a non-technical audience.
`,
});

const summarizeWebsiteFlow = ai.defineFlow(
  {
    name: 'summarizeWebsiteFlow',
    inputSchema: WebsiteAnalysisInputSchema,
    outputSchema: z.nullable(AISummarySchema),
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      return output;
    } catch (e) {
      console.error("AI summary flow failed:", e);
      return null;
    }
  }
);
