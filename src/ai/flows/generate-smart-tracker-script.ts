'use server';

/**
 * @fileOverview Generates a smart tracking script that uses an LLM to filter visitor events.
 *
 * - generateSmartTrackerScript - A function that generates the smart tracking script.
 * - GenerateSmartTrackerScriptInput - The input type for the generateSmartTrackerScript function.
 * - GenerateSmartTrackerScriptOutput - The return type for the generateSmartTrackerScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSmartTrackerScriptInputSchema = z.object({
  websiteUrl: z.string().describe('The URL of the website where the tracking script will be installed.'),
});
export type GenerateSmartTrackerScriptInput = z.infer<typeof GenerateSmartTrackerScriptInputSchema>;

const GenerateSmartTrackerScriptOutputSchema = z.object({
  trackingScript: z.string().describe('The generated JavaScript tracking script.'),
});
export type GenerateSmartTrackerScriptOutput = z.infer<typeof GenerateSmartTrackerScriptOutputSchema>;

export async function generateSmartTrackerScript(input: GenerateSmartTrackerScriptInput): Promise<GenerateSmartTrackerScriptOutput> {
  return generateSmartTrackerScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSmartTrackerScriptPrompt',
  input: {schema: GenerateSmartTrackerScriptInputSchema},
  output: {schema: GenerateSmartTrackerScriptOutputSchema},
  prompt: `You are an expert JavaScript developer specializing in creating tracking scripts.

You will generate a JavaScript tracking script that, when installed on a website, sends visitor events (IP address, country, timestamp, referrer) to a specified endpoint for analytics.

However, to avoid overwhelming the database, the script should use an LLM to determine whether each visitor event is worth recording.  The LLM should consider the IP address, country, timestamp, and referrer to determine if the event seems like it would represent meaningful user behavior on the site.

Here is the URL of the website where the script will be installed: {{{websiteUrl}}}.

Only record the event if the LLM determines that it is likely to be a valuable data point.

Return only the JavaScript code, do not include any explanations or comments outside the script tags.

Here is the tracking script:

<script>
  (function() {
    const websiteUrl = "{{{websiteUrl}}}";
    const endpoint = '/api/track'; // Replace with your actual endpoint

    function shouldRecordEvent(ip, country, timestamp, referrer) {
      // This function uses an LLM to determine if the event is worth recording.
      // Replace with actual LLM call (e.g., via a serverless function).
      // For now, it returns a random boolean for demonstration purposes.
      // In production, this is where you would call the genkit flow.
      // Example:  const response = await fetch(\"/api/llm-check?ip=\