
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI({apiKey: 'AIzaSyDpoJ3h889m_6bhj1k0DmgmxWF3d9vupLw'})],
  model: 'googleai/gemini-2.5-flash',
});
