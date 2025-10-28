
'use server';
/**
 * @fileOverview A flow to redesign a website visually based on an image and a prompt.
 *
 * - redesignWebsite - A function that takes a screenshot and a prompt to generate a new design.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RedesignInputSchema = z.object({
  screenshotDataUri: z.string().describe("A screenshot of the website as a data URI. Expected format: 'data:image/png;base64,<encoded_data>'."),
  prompt: z.string().describe("A text prompt describing the desired design changes (e.g., 'Make it look more modern', 'Use a dark theme with blue accents')."),
});

export type RedesignInput = z.infer<typeof RedesignInputSchema>;

const RedesignOutputSchema = z.object({
  imageUrl: z.string().describe("The data URI of the newly generated website design image."),
  reasoning: z.string().describe("A brief explanation from the AI about the design choices it made based on the prompt."),
});

export type RedesignOutput = z.infer<typeof RedesignOutputSchema>;

const FlowOutputSchema = z.union([
    z.object({ design: RedesignOutputSchema, error: z.undefined() }),
    z.object({ design: z.undefined(), error: z.string() })
]);

export async function redesignWebsite(input: RedesignInput): Promise<z.infer<typeof FlowOutputSchema>> {
  return redesignWebsiteFlow(input);
}

const redesignWebsiteFlow = ai.defineFlow(
  {
    name: 'redesignWebsiteFlow',
    inputSchema: RedesignInputSchema,
    outputSchema: FlowOutputSchema,
  },
  async (input) => {
    try {
      const { output, media } = await ai.generate({
        model: 'googleai/gemini-pro-vision',
        prompt: [
            { media: { url: input.screenshotDataUri } },
            { text: `Redesign the provided website screenshot based on the following instruction: "${input.prompt}". In your response, provide ONLY a JSON object containing the redesigned image and a short 'reasoning' for your design choices.` },
        ],
        output: {
          schema: z.object({
            reasoning: z.string().describe("A brief explanation from the AI about the design choices it made based on the prompt."),
          }),
        },
      });

      if (!output || !media?.url) {
        return { error: 'The AI model did not return a valid design. Please try again.' };
      }
      
      return { design: {
        imageUrl: media.url,
        reasoning: output.reasoning,
      } };
    } catch (e: any) {
      console.error("AI redesign flow failed:", e);
      if (e.message && e.message.includes('429')) {
        return { error: 'The AI is currently receiving too many requests. Please try again in a few moments.' };
      }
      return { error: e.message || 'An unexpected error occurred while generating the redesign.' };
    }
  }
);
