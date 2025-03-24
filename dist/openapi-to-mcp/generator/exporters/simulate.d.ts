import { MCPJson } from "../types";
/**
 * Simulate an LLM agent using the MCP specification
 */
export declare function simulateMcp(mcpJson: MCPJson, prompt: string, apiBaseUrl: string, options?: any): Promise<any>;
