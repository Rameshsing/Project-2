// This file uses server-side code.
'use server';

/**
 * @fileOverview AI-powered content moderation flow to identify and filter out harmful content using sentiment analysis.
 *
 * - moderateContent - A function that handles the content moderation process.
 * - ModerateContentInput - The input type for the moderateContent function.
 * - ModerateContentOutput - The return type for the moderateContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModerateContentInputSchema = z.object({
  text: z.string().describe('The text content to be analyzed for sentiment.'),
});
export type ModerateContentInput = z.infer<typeof ModerateContentInputSchema>;

const ModerateContentOutputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'The overall sentiment of the text (e.g., positive, negative, neutral)'
    ),
  isHarmful: z
    .boolean()
    .describe(
      'Whether the content is considered harmful or inappropriate based on sentiment and content analysis.'
    ),
  reason: z
    .string()
    .describe(
      'The reason why the content is considered harmful or inappropriate. If content is not harmful, this field should be empty.'
    ),
});
export type ModerateContentOutput = z.infer<typeof ModerateContentOutputSchema>;

export async function moderateContent(input: ModerateContentInput): Promise<ModerateContentOutput> {
  return moderateContentFlow(input);
}

const moderateContentPrompt = ai.definePrompt({
  name: 'moderateContentPrompt',
  input: {schema: ModerateContentInputSchema},
  output: {schema: ModerateContentOutputSchema},
  prompt: `You are an AI content moderation expert.

You will analyze the sentiment of the given text and determine if it is harmful or inappropriate based on the following guidelines:

- Harmful content includes hate speech, harassment, threats, and any content that violates the platform's community guidelines.
- Inappropriate content includes sexually suggestive content, spam, and content that is not suitable for all audiences.

Based on your analysis, you will determine the overall sentiment of the text (positive, negative, or neutral) and whether it is considered harmful or inappropriate. If the content is harmful or inappropriate, you will provide a reason why.

Text: {{{text}}}

Respond in JSON format with the following keys:
- sentiment: The overall sentiment of the text (e.g., positive, negative, neutral).
- isHarmful: Whether the content is considered harmful or inappropriate (true or false).
- reason: The reason why the content is considered harmful or inappropriate. If content is not harmful, this field should be empty.
`,
});

const moderateContentFlow = ai.defineFlow(
  {
    name: 'moderateContentFlow',
    inputSchema: ModerateContentInputSchema,
    outputSchema: ModerateContentOutputSchema,
  },
  async input => {
    const {output} = await moderateContentPrompt(input);
    return output!;
  }
);
