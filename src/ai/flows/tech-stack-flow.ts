
'use server';
/**
 * @fileOverview A flow to detect the technology stack of a website.
 *
 * - detectTechStack - A function that takes website data and returns a list of technologies.
 * - TechStackInput - The input type for the detectTechStack function.
 * - TechStackOutput - The return type for the detectTechStack function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { TechStackData } from '@/lib/types';

const TechStackInputSchema = z.object({
  url: z.string().describe('The URL of the website.'),
  htmlContent: z.string().describe('The first 5000 characters of the website\'s HTML content.'),
  headers: z.record(z.string()).optional().describe('A subset of the HTTP response headers.'),
});

export type TechStackInput = z.infer<typeof TechStackInputSchema>;

const TechStackOutputSchema = z.array(z.object({
  name: z.string().describe('The name of the technology detected (e.g., "React", "Shopify").'),
  category: z.string().describe('The category of the technology (e.g., "JavaScript Framework", "CMS", "Web Server").'),
  confidence: z.number().min(0).max(100).describe('The confidence level of the detection (0-100).'),
  description: z.string().optional().describe('A brief, one-sentence description of the technology.'),
})).describe('A list of technologies detected on the website.');

export type TechStackOutput = z.infer<typeof TechStackOutputSchema>;

export async function detectTechStack(input: TechStackInput): Promise<TechStackOutput> {
  // Truncate HTML content to avoid exceeding token limits
  if (input.htmlContent) {
    input.htmlContent = input.htmlContent.substring(0, 10000);
  }
  return detectTechStackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectTechStackPrompt',
  input: { schema: TechStackInputSchema },
  output: { schema: TechStackOutputSchema },
  prompt: `You are an expert web developer specializing in identifying the technology stack of websites.
Analyze the provided HTML content, URL, and HTTP headers to identify the key technologies used.

Look for clues in:
- HTML meta tags (e.g., "generator" tags for WordPress, Wix)
- Specific script tags or global JavaScript variables (e.g., "React", "Vue", "jQuery")
- Unique HTML structures or class names (e.g., those used by Shopify, Squarespace)
- HTTP headers (e.g., "server" for Nginx, "x-powered-by" for Next.js, Express)

Based on your analysis, provide a list of up to 12 of the most prominent technologies. For each, specify its name, category, and your confidence level in the detection.
Prioritize frameworks, platforms, and servers over small libraries.

Website URL: {{{url}}}
Response Headers: {{{json headers}}}
HTML Content:
\`\`\`html
{{{htmlContent}}}
\`\`\`
`,
});

const detectTechStackFlow = ai.defineFlow(
  {
    name: 'detectTechStackFlow',
    inputSchema: TechStackInputSchema,
    outputSchema: TechStackOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
