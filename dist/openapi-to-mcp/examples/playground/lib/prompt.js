"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePromptResponse = generatePromptResponse;
const openai_1 = __importDefault(require("openai"));
// Initialize OpenAI client with a function that allows passing the API key
const createOpenAIClient = (apiKey) => {
    return new openai_1.default({
        apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
};
/**
 * Generate a response from the AI model using the provided text and prompt template
 * @param userText The user's input text
 * @param promptTemplate The template to use for prompting the AI
 * @param apiKey Optional API key from the UI
 * @returns Promise with the parsed JSON response
 */
async function generatePromptResponse(userText, promptTemplate, apiKey) {
    try {
        // Create OpenAI client with the provided API key or fallback to env variable
        const openai = createOpenAIClient(apiKey);
        // Combine the user text with the prompt template
        const combinedPrompt = promptTemplate.replace("{{USER_TEXT}}", userText);
        // Make the request to OpenAI
        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that converts user requests into MCP commands.",
                },
                { role: "user", content: combinedPrompt },
            ],
            response_format: { type: "json_object" },
            temperature: 0.2,
        });
        // Extract the content from the response
        const content = response.choices[0]?.message?.content || "";
        // Parse the JSON response
        try {
            const parsedResponse = JSON.parse(content);
            return parsedResponse;
        }
        catch (parseError) {
            throw new Error(`Failed to parse AI response as JSON: ${content}`);
        }
    }
    catch (error) {
        console.error("Error calling OpenAI:", error);
        throw new Error(`AI processing error: ${error instanceof Error ? error.message : String(error)}`);
    }
}
/**
 * Alternative implementation using Anthropic's Claude (commented out)
 */
/*
import Anthropic from '@anthropic-ai/sdk';

const createAnthropicClient = (apiKey?: string) => {
  return new Anthropic({
    apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
  });
};

export async function generatePromptResponseWithClaude(userText: string, promptTemplate: string, apiKey?: string) {
  try {
    const anthropic = createAnthropicClient(apiKey);
    const combinedPrompt = promptTemplate.replace('{{USER_TEXT}}', userText);
    
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      system: 'You are a helpful assistant that converts user requests into MCP commands.',
      messages: [
        { role: 'user', content: combinedPrompt }
      ],
    });
    
    const content = response.content[0]?.text || '';
    
    try {
      return JSON.parse(content);
    } catch (parseError) {
      throw new Error(`Failed to parse Claude response as JSON: ${content}`);
    }
  } catch (error) {
    console.error('Error calling Claude:', error);
    throw new Error(`AI processing error: ${error instanceof Error ? error.message : String(error)}`);
  }
}
*/
//# sourceMappingURL=prompt.js.map