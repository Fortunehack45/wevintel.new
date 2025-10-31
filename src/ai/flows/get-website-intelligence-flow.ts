
'use server';
/**
 * @fileOverview An AI flow to generate a comprehensive intelligence report for a website.
 * This flow consolidates summary, tech stack, and traffic estimation into a single AI call.
 *
 * - getWebsiteIntelligence - A function that takes website data and returns a full AI-generated report.
 * - WebsiteIntelligenceInput - The input type for the function.
 * - WebsiteIntelligenceOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getCache, setCache } from '@/lib/cache';
import type { AISummary, TechStackData, TrafficData } from '@/lib/types';


// Input Schema
const WebsiteIntelligenceInputSchema = z.object({
  url: z.string().describe('The URL of the website.'),
  htmlContent: z.string().optional().describe('The first 5000 characters of the website\'s HTML content.'),
  headers: z.record(z.string()).optional().describe('A subset of the HTTP response headers.'),
  description: z.string().optional().describe('The meta description of the website.'),
});
export type WebsiteIntelligenceInput = z.infer<typeof WebsiteIntelligenceInputSchema>;

// Output Schemas
const AISummarySchema = z.object({
  summary: z.string().describe('A concise, one-paragraph summary of the website\'s technical and security profile based on the provided data. Written in a helpful and professional tone.'),
  recommendations: z.array(z.string()).describe('A list of 2-3 actionable recommendations for the website owner to improve their site. Focus on the most impactful changes.'),
});

const TechStackSchema = z.array(z.object({
  name: z.string().describe('The name of the technology detected (e.g., "React", "Shopify").'),
  category: z.string().describe('The category of the technology (e.g., "JavaScript Framework", "CMS", "Web Server").'),
  confidence: z.number().min(0).max(100).describe('The confidence level of the detection (0-100).'),
  description: z.string().optional().describe('A brief, one-sentence description of the technology.'),
})).describe('A list of technologies detected on the website.');

const TrafficEstimateSchema = z.object({
  estimatedMonthlyVisits: z.number().describe('A numerical estimation of the monthly visits to the website. Should be a round number.'),
  estimationConfidence: z.enum(['low', 'medium', 'high']).describe('The confidence level of the estimation.'),
  trafficSources: z.object({
    direct: z.number().describe('Estimated percentage of traffic from direct visits. Range 0-100.'),
    search: z.number().describe('Estimated percentage of traffic from organic search. Range 0-100.'),
    social: z.number().describe('Estimated percentage of traffic from social media. Range 0-100.'),
    referral: z.number().describe('Estimated percentage of traffic from referral links. Range 0-100.'),
  }).describe('Estimated breakdown of traffic sources. The sum of percentages should be 100.'),
  topCountries: z.array(z.object({
    country: z.string().describe('The two-letter country code (e.g., US, DE).'),
    percentage: z.number().describe('The estimated percentage of traffic from this country. Range 0-100.'),
  })).length(3).describe('A list of the top 3 countries contributing to the website traffic. The sum of percentages should not exceed 100.'),
  engagement: z.object({
    avgSessionDuration: z.string().describe('The estimated average session duration in a human-readable format (e.g., "2m 15s").'),
    bounceRate: z.number().describe('The estimated bounce rate as a percentage. Range 0-100.'),
  }).describe('Key user engagement metrics.'),
});

const WebsiteIntelligenceOutputSchema = z.object({
    summary: AISummarySchema,
    techStack: TechStackSchema.nullable(),
    traffic: TrafficEstimateSchema.nullable(),
});
export type WebsiteIntelligenceOutput = z.infer<typeof WebsiteIntelligenceOutputSchema>;

const FlowOutputSchema = z.union([
    WebsiteIntelligenceOutputSchema,
    z.object({ error: z.string() })
]);

// Main exported function
export async function getWebsiteIntelligence(input: WebsiteIntelligenceInput): Promise<WebsiteIntelligenceOutput | { error: string }> {
  const cacheKey = `intelligence:${input.url}`;
  const cached = await getCache<WebsiteIntelligenceOutput>(cacheKey);
  if (cached) return cached;
  
  if (input.htmlContent) {
    input.htmlContent = input.htmlContent.substring(0, 8000); // Increased limit for better analysis
  }

  try {
    const result = await websiteIntelligenceFlow(input);
    if (!('error' in result)) {
        await setCache(cacheKey, result);
    }
    return result;
  } catch (e: any) {
    console.error("AI intelligence flow failed:", e);
    return { error: e.message || 'An unexpected error occurred while generating the AI analysis.' };
  }
}

// Genkit Prompt
const prompt = ai.definePrompt({
  name: 'websiteIntelligencePrompt',
  input: { schema: WebsiteIntelligenceInputSchema },
  output: { schema: WebsiteIntelligenceOutputSchema },
  prompt: `You are an expert web analyst. Your task is to provide a comprehensive analysis of a website based on the provided data.
You must generate three separate pieces of analysis: a summary with recommendations, a technology stack detection, and a website traffic estimation.

**Analysis Data:**
- URL: {{{url}}}
- Description: {{{description}}}
- Response Headers: {{{json headers}}}
- HTML Content (first 8000 chars):
\`\`\`html
{{{htmlContent}}}
\`\`\`

**Instructions for each section:**

1.  **AI Summary & Recommendations:**
    -   Provide a concise, one-paragraph summary of the website's technical and security profile.
    -   Provide 2-3 actionable recommendations for improvement.

2.  **Technology Stack Detection:**
    -   Analyze the HTML, headers, and URL to identify key technologies.
    -   Look for frameworks (React, Next.js, Vue), CMS (WordPress, Shopify), servers (Nginx, Cloudflare), and analytics tools (Google Analytics).
    -   Provide a list of up to 12 prominent technologies. If a core JavaScript framework is detected, it MUST be included.
    -   If no technologies can be detected with reasonable confidence, return null for this section.

3.  **Traffic Estimation:**
    -   Provide a realistic estimation of monthly traffic, user engagement, and audience profile.
    -   Consider the domain name, industry, brand recognition, and typical user behavior for such a site.
    -   Ensure traffic source percentages sum to 100.
    -   If the website is obscure or there is insufficient data to make a reasonable estimate (e.g., a personal portfolio, a new site), return null for this section.

Return the entire analysis as a single JSON object matching the required output schema.
`,
});

// Retry logic helper
async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
    try {
        return await fn();
    } catch (e: any) {
        if (retries > 0 && e.message.includes('429')) {
            console.warn(`AI rate limited. Retrying in ${delay}ms... (${retries} retries left)`);
            await new Promise(res => setTimeout(res, delay));
            return retryWithBackoff(fn, retries - 1, delay * 2);
        }
        throw e;
    }
}

// Genkit Flow
const websiteIntelligenceFlow = ai.defineFlow(
  {
    name: 'websiteIntelligenceFlow',
    inputSchema: WebsiteIntelligenceInputSchema,
    outputSchema: FlowOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await retryWithBackoff(() => prompt(input));
      
      if (!output) {
        return { error: 'The AI model did not return a valid analysis. Please try again.' };
      }
      return output;
    } catch (e: any) {
      console.error("AI intelligence flow failed:", e);
      let errorMessage = e.message || 'An unexpected error occurred while generating the AI analysis.';
      if (errorMessage.includes('429')) {
        errorMessage = 'The AI is currently receiving too many requests. Please try again in a few moments.';
      }
      return { error: errorMessage };
    }
  }
);
