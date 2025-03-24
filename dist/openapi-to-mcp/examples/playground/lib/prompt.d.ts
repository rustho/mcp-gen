/**
 * Generate a response from the AI model using the provided text and prompt template
 * @param userText The user's input text
 * @param promptTemplate The template to use for prompting the AI
 * @param apiKey Optional API key from the UI
 * @returns Promise with the parsed JSON response
 */
export declare function generatePromptResponse(userText: string, promptTemplate: string, apiKey?: string): Promise<any>;
/**
 * Alternative implementation using Anthropic's Claude (commented out)
 */
