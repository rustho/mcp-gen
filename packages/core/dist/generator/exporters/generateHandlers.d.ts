import { MCPJson } from '../types';
/**
 * Generates separate handler files for each action in the MCP JSON
 */
export declare function generateHandlers(mcpJson: MCPJson, outputPath: string, apiBaseUrl: string): void;
